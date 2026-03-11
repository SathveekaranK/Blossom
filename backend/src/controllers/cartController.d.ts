import type { Response } from 'express';
export declare const getCart: (req: any, res: Response) => Promise<void>;
export declare const syncCart: (req: any, res: Response) => Promise<void>;
export declare const addToCart: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCartItem: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeCartItem: (req: any, res: Response) => Promise<void>;
export declare const clearCart: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=cartController.d.ts.map