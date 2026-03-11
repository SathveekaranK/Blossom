import type { Response } from 'express';
export declare const toggleSubscription: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSubscriptionStatus: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getNotifications: (req: any, res: Response) => Promise<void>;
export declare const markAsRead: (req: any, res: Response) => Promise<void>;
export declare const markAllAsRead: (req: any, res: Response) => Promise<void>;
export declare const notifySubscribers: (product: {
    id: string;
    name: string;
    price: number;
}) => Promise<void>;
//# sourceMappingURL=subscriptionController.d.ts.map