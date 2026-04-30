import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { correlationIdMiddleware } from './middlewares/correlationId.middleware.js';
import { requestIdMiddleware } from './middlewares/requestId.middleware.js';
import { loggingMiddleware } from './middlewares/logging.middleware.js';
import { corsMiddleware } from './middlewares/cors.middleware.js';

export const configureMiddleware = (app: Express) => {
    // remove X-Powered-By Express header
    app.disable('x-powered-by');

    // setup request logger
    app.use(loggingMiddleware());

    // setup CORS
    app.use(corsMiddleware());

    // JSON reponses
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // support cookies
    app.use(cookieParser());

    // add custom headers middleware
    app.use(correlationIdMiddleware());
    app.use(requestIdMiddleware());
};
