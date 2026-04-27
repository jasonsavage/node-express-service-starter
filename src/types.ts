import {type Express} from 'express';


export type ShutdownFn = () => Promise<void>;
export type ConfigureAppFn = (server: Express) => ShutdownFn;