"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = AuthenticationMiddleware;
const unauthorized_exception_1 = require("@nestjs/common/exceptions/unauthorized.exception");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
function AuthenticationMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        throw new unauthorized_exception_1.UnauthorizedException('Authentication token missing');
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, String(process.env.JWT_SECRET));
        req['user'] = decoded.user;
        next();
    }
    catch (err) {
        throw new unauthorized_exception_1.UnauthorizedException('Invalid or expired token');
    }
}
//# sourceMappingURL=authentication.middleware.js.map