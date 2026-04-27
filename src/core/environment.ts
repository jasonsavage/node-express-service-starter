import express, {Express} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getEnv } from '../utils/getEnv.js';
import { correlationIdMiddleware } from './middleware/correlationId.middleware.js';
import { requestIdMiddleware } from './middleware/requestId.middleware.js';
import {pinoHttp} from 'pino-http';


export const configureEnvironment = (app: Express) => {

    const corsOrigin = getEnv("SERVER_CORS", "*");
    
    // setup request logger
    app.use(pinoHttp());

    // setup CORS
    app.use(cors({origin: corsOrigin}));

    // JSON reponses
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // support cookies
    app.use(cookieParser());

    // Custom middleware
    app.use(correlationIdMiddleware());
    app.use(requestIdMiddleware());
}
