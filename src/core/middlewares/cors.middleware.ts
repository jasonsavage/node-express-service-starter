import cors from 'cors';
import { getEnv } from '../env.js';

export const corsMiddleware = () => {
    const corsOrigin = getEnv('SERVER_CORS', '*');

    // TODO: add additional cors configurations
    return cors({ origin: corsOrigin });
};
