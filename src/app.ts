import type { Response } from "express";
import { ConfigureAppFn } from "./types.js";
import { ResponseEntity } from "./utils/ResponseEntity.js";

export const configureApp: ConfigureAppFn = (app) => {
    

    app.get("/healthcheck", (_, res: Response) => {
        res.status(200);
        res.send(JSON.stringify({"status": "ok"}));
    });

    return async () => {};

}