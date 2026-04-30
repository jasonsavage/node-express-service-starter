import { pinoHttp } from 'pino-http';

export const loggingMiddleware = () => {
    return pinoHttp();
};
