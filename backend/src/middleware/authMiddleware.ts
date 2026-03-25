import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    userId: string;
    role: string;
}

// Non-blocking: attaches user if token valid, continues regardless
export const optionalAuth = (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'fallback_secret'
            ) as DecodedToken;
            req.user = decoded;
        } catch (err) {
            req.user = undefined;
        }
    } else {
        req.user = undefined;
    }

    next();
};

// Blocking: requires authenticated user (use after optionalAuth or standalone)
export const requireAuth = (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'fallback_secret'
        ) as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

// Backward-compatible alias
export const authenticate = requireAuth;

export const authorize = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};
