import { Request, Response, NextFunction } from "express";

export function authenticationMiddlware(req:Request, res: Response, next:NextFunction): void {
    //Check for authenticated token haha!
    next();
}