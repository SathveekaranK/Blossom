import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const ADMIN_EMAIL = process.env.EMAIL_USER;

interface OrderItem {
    product: {
        name: string;
    };
    quantity: number;
    price: number;
}

interface OrderDetails {
    id: string;
    totalAmount: number;
    createdAt: Date;
    shippingAddress: string | null;
    houseNo?: string | null;
    street?: string | null;
    landmark?: string | null;
    area?: string | null;
    district?: string | null;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
    user: {
        name: string;
        email: string;
        phone?: string | null;
    };
    items: OrderItem[];
}

export const sendOrderAdminNotification = async (order: OrderDetails) => {
    const itemsHtml = order.items
        .map(
            (item) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
    `
        )
        .join('');

    const fullAddress = [
        order.houseNo,
        order.street,
        order.landmark,
        order.area,
        order.district,
        order.state,
        order.country,
        order.pincode
    ].filter(Boolean).join(', ') || order.shippingAddress || 'N/A';

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; color: #333;">
            <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">NEW ORDER RECEIVED</h1>
                <p style="margin: 10px 0 0; opacity: 0.8;">Order ID: #${order.id.slice(0, 8)}</p>
            </div>
            <div style="padding: 30px;">
                <h2 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; font-size: 18px;">Customer Information</h2>
                <p><strong>Name:</strong> ${order.user.name}</p>
                <p><strong>Email:</strong> ${order.user.email}</p>
                <p><strong>Phone:</strong> ${order.user.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${fullAddress}</p>

                <h2 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; font-size: 18px; margin-top: 30px;">Order Summary</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f9f9f9;">
                            <th style="padding: 10px; text-align: left;">Product</th>
                            <th style="padding: 10px; text-align: center;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 20px 10px 10px; text-align: right; font-weight: bold; font-size: 18px;">Total Amount:</td>
                            <td style="padding: 20px 10px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #d4af37;">$${order.totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <div style="margin-top: 40px; text-align: center;">
                    <p style="font-size: 12px; color: #999;">Order Date: ${new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                © 2026 Blossom Admin Panel. All rights reserved.
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Blossom Admin" <${process.env.EMAIL_USER}>`,
            to: ADMIN_EMAIL,
            subject: `New Order Received - Order ID #${order.id.slice(0, 8)}`,
            html,
        });
        console.log(`Order notification email sent for Order #${order.id}`);
    } catch (error) {
        console.error('Failed to send order notification email:', error);
    }
};

export const sendLowStockAlert = async (product: { id: string; name: string; stock: number }) => {
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ffcccc; border-radius: 10px; overflow: hidden; color: #333;">
            <div style="background-color: #cc0000; color: #ffffff; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">LOW STOCK ALERT</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Action Required Immediately</p>
            </div>
            <div style="padding: 30px; text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
                <h2 style="margin: 0; color: #333;">${product.name}</h2>
                <p style="font-size: 18px; color: #666; margin: 15px 0;">Remaining Stock: <span style="color: #cc0000; font-weight: bold; font-size: 24px;">${product.stock}</span></p>
                <p style="font-size: 14px; color: #999;">Product ID: ${product.id}</p>
                
                <div style="margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL}/admin/products" 
                       style="background-color: #1a1a1a; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                       Update Inventory
                    </a>
                </div>
            </div>
            <div style="background-color: #fdf2f2; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                This is an automated alert from the Blossom Inventory System.
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Blossom Inventory" <${process.env.EMAIL_USER}>`,
            to: ADMIN_EMAIL,
            subject: `Low Stock Alert - ${product.name}`,
            html,
        });
        console.log(`Low stock alert email sent for Product: ${product.name}`);
    } catch (error) {
        console.error('Failed to send low stock alert email:', error);
    }
};
