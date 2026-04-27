import { type Response } from "express";


export class ResponseEntity {

    private statusCode: Number;
    private body: Record<string, any> | undefined;
    private headers: Record<string, string> | undefined;

    constructor(statusCode: Number, body?: Record<string, any>, headers?: Record<string, string>) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }

    public static ok(res: Response, body?: Record<string, any>, headers?: Record<string, string>) {
        res.status(200);
        res.send("ok");
    }

}
