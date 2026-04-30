const parseType = <T>(value: string): T => {
    const lower = value.toLowerCase();

    if (lower === 'true' || lower === 'false') {
        return (lower === 'true') as T;
    }

    if (Number.isFinite(+value)) {
        const num = value.includes('.') ? parseFloat(value) : parseInt(value);
        return num as T;
    }

    return value as T;
};

/**
 * Env variable cache
 */
const envConfig = new Map();

/**
 * Loads all env files and adds them to the env config map
 */
export const loadEnv = (envPrefixes: string[]) => {
    process.loadEnvFile();

    const appEnvKeys = Object.keys(process.env).filter((k) => envPrefixes.some((x) => k.startsWith(x)));

    // proccess env keys for application
    appEnvKeys.forEach((key) => {
        const raw = process.env[key] as string;
        const value = parseType(raw.trim());
        envConfig.set(key, value);
    });
};

/**
 * Gets an environemnt variable from process.env and converts it to the correct type
 * Prevents access to env keys not associated with the application
 */
export const getEnv = <T extends string | boolean | number = string>(key: string, defaultValue?: T): T => {
    if (envConfig.has(key)) {
        return envConfig.get(key);
    }

    if (typeof defaultValue === 'undefined') {
        throw new Error(`Env variable not set and a default value was not provided: ${key}`);
    }

    return defaultValue;
};
