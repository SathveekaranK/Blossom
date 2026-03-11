import { prisma } from '../index.js';
// Subscribe / Unsubscribe current user
export const toggleSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { isSubscribed: !user.isSubscribed },
            select: { id: true, isSubscribed: true },
        });
        res.json({
            message: updated.isSubscribed ? 'Subscribed successfully' : 'Unsubscribed successfully',
            isSubscribed: updated.isSubscribed,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to toggle subscription' });
    }
};
// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isSubscribed: true },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ isSubscribed: user.isSubscribed });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get subscription status' });
    }
};
// Get notifications for the current user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        const unreadCount = await prisma.notification.count({
            where: { userId, isRead: false },
        });
        res.json({ notifications, unreadCount });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};
// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
        res.json({ message: 'Marked as read' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};
// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        res.json({ message: 'All marked as read' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
};
// Utility: notify all subscribers about a new product (called internally)
export const notifySubscribers = async (product) => {
    try {
        const subscribers = await prisma.user.findMany({
            where: { isSubscribed: true },
            select: { id: true },
        });
        if (subscribers.length === 0)
            return;
        const notificationData = subscribers.map((sub) => ({
            userId: sub.id,
            title: '✨ New Product Added!',
            message: `${product.name} is now available for $${product.price.toFixed(2)}. Check it out!`,
            type: 'PRODUCT_NEW',
            productId: product.id,
        }));
        await prisma.notification.createMany({ data: notificationData });
    }
    catch (error) {
        console.error('Failed to notify subscribers:', error);
    }
};
//# sourceMappingURL=subscriptionController.js.map