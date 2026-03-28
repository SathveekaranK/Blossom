import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import Stripe from 'stripe';
import { sendOrderAdminNotification, sendLowStockAlert } from '../utils/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil' as any,
});

// Admin: Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const where: any = {};
        if (status && status !== 'ALL') where.status = String(status);

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Admin: Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { status } = req.body;
        const validStatuses = ['ORDER', 'SHIPPED', 'DELIVERED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        // Fetch the order to get the userId and current status
        const currentOrder = await prisma.order.findUnique({
            where: { id },
            include: { user: { select: { id: true, name: true } } }
        });

        if (!currentOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        // Notify the user
        await prisma.notification.create({
            data: {
                userId: currentOrder.userId,
                title: `Order #${id.slice(0, 8)} ${status}`,
                message: `Your order status has been updated to ${status}.`,
                type: 'ORDER_STATUS',
            }
        });

        // Special notification for Admin if DELIVERED or requested
        // Since the requirement says "message send to the admin and the user"
        // We find an admin user to notify
        const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (adminUser) {
            await prisma.notification.create({
                data: {
                    userId: adminUser.id,
                    title: `Order Delivered: #${id.slice(0, 8)}`,
                    message: `Order #${id.slice(0, 8)} for ${currentOrder.user.name} has been marked as ${status}.`,
                    type: 'ADMIN_ALERT',
                }
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

// Customer: Get my orders
export const getMyOrders = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your orders' });
    }
};

// Customer: Get single order detail
export const getOrderById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const order = await prisma.order.findFirst({
            where: { id, userId },
            include: {
                items: { include: { product: true } },
            },
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Customer: Create order and Stripe checkout session
export const createCheckoutSession = async (req: any, res: Response) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required before checkout',
        });
    }

    try {
        const userId = req.user.userId;
        const { items, shippingAddress, phone, houseNo, street, landmark, area, district, state, country, pincode } = req.body;
        // items: [{ productId, quantity }]
        
        if (phone && phone.trim().length >= 10) {
            await prisma.user.update({
                where: { id: userId },
                data: { phone: phone.trim() }
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }

        // Validate stock and calculate total
        let totalAmount = 0;
        const orderItems: { productId: string; quantity: number; price: number }[] = [];
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        for (const item of items) {
            const product = await prisma.product.findFirst({
                where: { id: item.productId, isDeleted: false },
            });

            if (!product || !product.isActive) {
                return res.status(400).json({ error: `Product ${item.productId} is not available` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
                });
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: product.imageUrl ? [product.imageUrl] : [],
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            });
        }

        // Create the order in ORDER state
        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'ORDER',
                shippingAddress: shippingAddress || null,
                houseNo,
                street,
                landmark,
                area,
                district,
                state,
                country,
                pincode,
                items: {
                    create: orderItems,
                },
            },
        });

        // Try Stripe session — if Stripe key is not configured, simulate
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
            // Simulate payment: keep order as ORDER

            // Deduct stock and check for low stock
            for (const item of orderItems) {
                const product = await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });

                // Low stock check
                if (product.stock < 10 && !product.lowStockAlertSent) {
                    await sendLowStockAlert(product);
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { lowStockAlertSent: true }
                    });
                }
            }

            // Clear user cart
            const cart = await prisma.cart.findUnique({ where: { userId } });
            if (cart) {
                await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            }

            // Send admin notification
            const fullOrder = await prisma.order.findUnique({
                where: { id: order.id },
                include: {
                    user: { select: { name: true, email: true, phone: true } },
                    items: { include: { product: true } },
                },
            });
            if (fullOrder) {
                // @ts-ignore - type conversion
                await sendOrderAdminNotification(fullOrder);
            }

            return res.json({
                orderId: order.id,
                mode: 'simulated',
                message: 'Order placed successfully (payment simulated)',
                url: null,
            });
        }

        // Real Stripe checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/checkout/success?orderId=${order.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel?orderId=${order.id}`,
            metadata: {
                orderId: order.id,
            },
        });

        // Save session ID to order
        await prisma.order.update({
            where: { id: order.id },
            data: { paymentIntentId: session.id },
        });

        res.json({ url: session.url, orderId: order.id, mode: 'stripe' });
    } catch (error: any) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

// Stripe webhook handler
export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        return res.status(400).json({ error: 'Webhook secret not configured' });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook verification failed' });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
            // Prevent duplicate processing
            const order = await prisma.order.findUnique({ where: { id: orderId } });
            if (order && order.status === 'ORDER') {
                // Deduct stock and check for low stock
                const items = await prisma.orderItem.findMany({ where: { orderId } });
                for (const item of items) {
                    const product = await prisma.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });

                    // Low stock check
                    if (product.stock < 10 && !product.lowStockAlertSent) {
                        await sendLowStockAlert(product);
                        await prisma.product.update({
                            where: { id: product.id },
                            data: { lowStockAlertSent: true }
                        });
                    }
                }

                // Clear user cart
                const cart = await prisma.cart.findUnique({ where: { userId: order.userId } });
                if (cart) {
                    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
                }

                // Send admin notification
                const fullOrder = await prisma.order.findUnique({
                    where: { id: orderId },
                    include: {
                        user: { select: { name: true, email: true, phone: true } },
                        items: { include: { product: true } },
                    },
                });
                if (fullOrder) {
                    // @ts-ignore - type conversion
                    await sendOrderAdminNotification(fullOrder);
                }
            }
        }
    }

    res.json({ received: true });
};

// Dashboard stats (Admin)
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalAmount: true },
        });

        const totalOrders = await prisma.order.count();
        const activeUsers = await prisma.user.count();
        const activeProducts = await prisma.product.count({ where: { isActive: true, isDeleted: false } });
        const subscriberCount = await prisma.user.count({ where: { isSubscribed: true } });

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true } },
                items: { include: { product: { select: { name: true } } } },
            },
        });

        // Orders in the last 30 days vs previous 30 days for % change
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const recentOrderCount = await prisma.order.count({
            where: { createdAt: { gte: thirtyDaysAgo } },
        });
        const previousOrderCount = await prisma.order.count({
            where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
        });

        const orderChange = previousOrderCount > 0
            ? (((recentOrderCount - previousOrderCount) / previousOrderCount) * 100).toFixed(1)
            : '0';

        res.json({
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalOrders,
            activeUsers,
            activeProducts,
            subscriberCount,
            orderChange: `${Number(orderChange) >= 0 ? '+' : ''}${orderChange}%`,
            recentOrders,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
