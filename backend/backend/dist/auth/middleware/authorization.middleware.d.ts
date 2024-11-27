import { NextFunction, Request, Response } from 'express';
declare const isUserAuthorized: (roles: String[]) => (req: Request, res: Response, next: NextFunction) => NextFunction | void;
export default isUserAuthorized;
