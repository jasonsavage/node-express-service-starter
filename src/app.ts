import type { Response } from 'express';
import { ConfigureAppFn } from './types.js';
import { ResponseEntity } from './utils/ResponseEntity.js';

export const configureApp: ConfigureAppFn = (app) => {
    app.get('/healthcheck', (_, res: Response) => {
        return ResponseEntity.ok(res, { status: 'ok' });
    });

    return async () => {};
};
