import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

const HEADER_KEY = 'X-Correlation-Id';

/**
 * Passes the incomming correlation ID to the response or creates a new one.
 */
export const correlationIdMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        // get incomming ID
        let correlationId = req.header(HEADER_KEY);

        // if not found, create one
        if (!correlationId) {
            correlationId = randomUUID({
                disableEntropyCache: true,
            });
        }

        res.setHeader(HEADER_KEY, correlationId);

        next();
    };
};
