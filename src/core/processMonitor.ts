import { logger } from "../logger.js";
import type { Server } from "node:net";
import { ShutdownFn } from "../types.js";

export const monitorNodeProcess = () => {
    
    process.on('beforeExit', (code) => {
        logger.info(`Process beforeExit event with code: ${code}`);
    });

    process.on('exit', (code) => {
        logger.info(`Process exit event with code: ${code}`);
    });

    process.on('warning', (warning) => {
        logger.warn(warning.name);    // Print the warning name
        logger.warn(warning.message); // Print the warning message
        logger.warn(warning.stack);   // Print the stack trace
    });

}

export const monitorShutdown = (server: Server, shutdown: ShutdownFn) => {

    const gracefulShutdown = (signal: 'SIGINT' | 'SIGTERM') => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      
      // Force exit after a timeout (e.g., 10s)
      setTimeout(() => {
          logger.error('Timeout during shutdown, forcing exit');
          process.exit(1);
      }, 10000);

      // Stop accepting new requests
      server.close(async () => {
          logger.info('HTTP server closed.');
          
          // Close other resources (e.g., database)
          try {
            await shutdown();
            process.exit(0);
          } catch (err) {
            logger.error(err, 'Error during shutdown');
            process.exit(1);
          }
      });
  }

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}