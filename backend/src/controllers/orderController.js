import { prisma } from '../config/db.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-04-30.basil',
});
// Admin: Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status && status !== 'ALL')
            where.status = String(status);
        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};
// Customer: Get my orders
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch your orders' });
    }
};
// Customer: Get single order detail
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const order = await prisma.order.findFirst({
            where: { id, userId },
            include: {
                items: { include: { product: true } },
            },
        });
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};
// Customer: Create order and Stripe checkout session
export const createCheckoutSession = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required before checkout',
        });
    }
    try {
        const userId = req.user.userId;
        const { items, shippingAddress } = req.body;
        // items: [{ productId, quantity }]
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }
        // Validate stock and calculate total
        let totalAmount = 0;
        const orderItems = [];
        const lineItems = [];
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
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
        // Create the order in PENDING state
        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'PENDING',
                shippingAddress: shippingAddress || null,
                items: {
                    create: orderItems,
                },
            },
        });
        // Try Stripe session — if Stripe key is not configured, simulate
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
            // Simulate payment: mark order as PAID immediately
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'PAID' },
            });
            // Deduct stock
            for (const item of orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            // Clear user cart
            const cart = await prisma.cart.findUnique({ where: { userId } });
            if (cart) {
                await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
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
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?orderId=${order.id}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/cancel?orderId=${order.id}`,
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
    }
    catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};
// Stripe webhook handler
export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
        return res.status(400).json({ error: 'Webhook secret not configured' });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook verification failed' });
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId) {
            // Prevent duplicate processing
            const order = await prisma.order.findUnique({ where: { id: orderId } });
            if (order && order.status === 'PENDING') {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'PAID' },
                });
                // Deduct stock
                const items = await prisma.orderItem.findMany({ where: { orderId } });
                for (const item of items) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
                // Clear user cart
                const cart = await prisma.cart.findUnique({ where: { userId: order.userId } });
                if (cart) {
                    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
                }
            }
        }
    }
    res.json({ received: true });
};
// Dashboard stats (Admin)
export const getDashboardStats = async (req, res) => {
    try {
        const totalRevenue = await prisma.order.aggregate({
            where: { status: { not: 'CANCELLED' } },
            _sum: { totalAmount: true },
        });
        const totalOrders = await prisma.order.count();
        const activeUsers = await prisma.user.count();
        const activeProducts = await prisma.product.count({ where: { isActive: true } });
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
//# sourceMappingURL=orderController.js.map