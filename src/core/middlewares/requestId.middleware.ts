import type { Request, Response, NextFunction } from 'express';
import rid from 'rid';

const HEADER_KEY = 'X-Request-Id';

/**
 * Adds a request ID to each response.
 */
export const requestIdMiddleware = () => {
    return (_: Request, res: Response, next: NextFunction) => {
        res.setHeader(HEADER_KEY, rid());
        next();
    };
};
