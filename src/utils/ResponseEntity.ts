import { type Response } from 'express';

export class ResponseEntity {
    private statusCode: number;
    private body: Record<string, any> | undefined;
    private headers: Record<string, string> | undefined;

    constructor(statusCode: number, body?: Record<string, any>, headers?: Record<string, string>) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }

    public static ok(res: Response, body?: Record<string, unknown>) {
        res.status(200).json(body);
    }
}
