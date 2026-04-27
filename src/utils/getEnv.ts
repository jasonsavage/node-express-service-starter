export const getEnv = <T extends string | boolean | number>(key: string, defaultValue?: T): T => {

    const raw = (key in process.env) ? process.env[key] : undefined;

    if(!raw) {
        if (typeof defaultValue === 'undefined') {
            throw new Error(`Env variable not set and a default value was not provided: ${key}`)
        }
        return defaultValue;
    }

    const value = raw.trim();
    const lower = value.toLowerCase();

    if(lower === 'true' || lower === 'false') {
        return (lower === 'true') as T;
    }

    if(Number.isFinite(+value)) {
        const num = value.includes('.') ? parseFloat(value) : parseInt(value);
        return num as T;
    }

    return value as T;
}