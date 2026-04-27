import express, {type Express} from 'express';
import fs from 'node:fs';
import path from 'node:path';
import https from 'https';
import http from 'http';
import { configureEnvironment } from './environment.js';
import {getEnv} from '../utils/getEnv.js';
import {monitorNodeProcess, monitorShutdown} from './processMonitor.js';
import { ConfigureAppFn } from '../types.js';
import { logger } from '../logger.js';

const startHttp = (app: Express) => {
  const host = getEnv<string>("SERVER_HOST", "0.0.0.0");
  const port = getEnv<number>("SERVER_PORT", 3000);

  const server = http.createServer(app);
  return server.listen(port, host, () => {
    logger.info(`Server running at https://${host}:${port}`);
  });
}

const startHttps = (app: Express) => {
  const host = getEnv<string>("SERVER_HOST", "0.0.0.0");
  const port = getEnv<number>("SERVER_PORT", 3443);

  // Load certificate and key files
  const keyFile = getEnv<string>("SERVER_HTTPS_KEY_FILE");
  const certFile = getEnv<string>("SERVER_HTTPS_CERT_FILE");

  const options = {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile)
  };

  const server = https.createServer(options, app);

  return server.listen(port, host, () => {
    logger.info(`Server running at https://${host}:${port}`);
  });
}


/**
 * Creates, configures, and starts an express server instance.
 */
export const startServer = async (configureApp: ConfigureAppFn) => {
  // create express app
  const app = express();

  // configure environment
  configureEnvironment(app);
  
  // configure application
  const onShutdown = configureApp(app);

  // add process listeners
  monitorNodeProcess();

  // start server
  const isHttps = getEnv<boolean>("SERVER_HTTPS", false);
  const server = isHttps ? startHttps(app) : startHttp(app);

  // handle shutdown
  monitorShutdown(server, onShutdown);
}
