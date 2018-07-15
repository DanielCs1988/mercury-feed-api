import {NextFunction, Request, Response} from "express";

export function cors(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return next();
}