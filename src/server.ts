import { configureApp } from './app.js';
import { startCluster } from './core/startCluster.js';
import { startServer } from './core/startServer.js';
import { loadEnv, getEnv } from './core/env.js';
import os from 'node:os';

// read ENV files
loadEnv(['SERVER', 'APP']);

const clusterMode = getEnv<boolean>('SERVER_CLUSTER_MODE', false);

if (clusterMode) {
    let desiredWorkers = getEnv<number>('SERVER_MAX_WORKERS', -1);

    if (desiredWorkers === -1) {
        // Get available parallelism
        const coreCount = os.availableParallelism();
        // keep the main event loop responsive
        desiredWorkers = coreCount - 1;
    }

    /**
     * Start multi-threaded api server
     */
    await startCluster(configureApp, desiredWorkers);
} else {
    /**
     * Start single threaded apiserver
     */
    await startServer(configureApp);
}
