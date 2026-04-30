import { createClient, RedisClientType, RedisClientOptions } from 'redis';
import { getEnv } from '../env.js';
import { logger } from '../../logger.js';
import { readFileSync } from 'node:fs';

let keyPrefix: string;
let client: RedisClientType;

/**
 * Creates a Redis client and opens a connection to the Redis DB server
 */
export const createRedisClient = async () => {
    // load keyspace prefix
    keyPrefix = getEnv('SERVER_REDIS_KEY_PREFIX', 'api');

    // Redis default port (6379) and host (127.0.0.1)
    let socketConfig: RedisClientOptions['socket'] = {
        host: getEnv('SERVER_REDIS_HOST', '127.0.0.1'),
        port: getEnv<number>('SERVER_REDIS_PORT', 6379),
    };

    const tls = getEnv<boolean>('SERVER_REDIS_TLS', false);
    if (tls) {
        socketConfig = {
            ...socketConfig,
            tls: true,
            key: readFileSync(getEnv('SERVER_REDIS_TLS_KEY_FILE')),
            cert: readFileSync(getEnv('SERVER_REDIS_TLS_CERT_FILE')),
            ca: [readFileSync(getEnv('SERVER_REDIS_TLS_CA_FILE'))],
        };
    }

    // create redis client instance
    // TODO: support cluster and sentinal
    client = createClient({
        username: getEnv('SERVER_REDIS_USERNAME', ''),
        password: getEnv('SERVER_REDIS_PASSWORD', ''),
        socket: socketConfig,
    });

    client.on('error', (err) => logger.warn('Redis client error', err));

    client.on('ready', () => logger.info(`Redis connected to ${socketConfig.host}:${socketConfig.port}`));

    // open connection
    await client.connect();
};

/**
 * Diconnects and destroys the current redis client
 */
export const destroyRedisClient = async () => {
    if (client) {
        await client.close();
        client.destroy();
    }
};

/**
 * Get the application's connected Redis client instance.
 */
export const getClient = () => {
    if (!client) {
        throw new Error('Redis client has not been created!');
    }

    return client;
};

/**
 * Takes a string or array of strings for a Redis key name and returns a
 * string containing that key with the application's configurable
 * prefix added to the front.
 */
const getKeyspace = (key: string | string[]) => {
    if (Array.isArray(key)) {
        return `${keyPrefix}:${key.join(':')}`;
    }
    return `${keyPrefix}:${key}`;
};
