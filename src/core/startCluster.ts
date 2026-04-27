import { ConfigureAppFn } from "../types.js";

export const startCluster = async (configureApp: ConfigureAppFn, desiredWorkers: number) => {
    // min is 1 primary and 2 workers
    const maxWorkers = Math.max(2, desiredWorkers);
}