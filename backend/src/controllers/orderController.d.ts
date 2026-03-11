import type { Request, Response } from 'express';
export declare const getAllOrders: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyOrders: (req: any, res: Response) => Promise<void>;
export declare const getOrderById: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCheckoutSession: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const stripeWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map