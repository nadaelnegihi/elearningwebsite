import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { Reflector } from '@nestjs/core';
  import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
  
      // Add debug log to check the token
      console.log("Token received in request:", token); // Debug the token
  
      if (!token) {
        throw new UnauthorizedException('No token, please login');
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
  
        const { userid, role } = payload.user;
        request['user'] = { _id: userid, role };
        console.log('Decoded JWT Payload:', request['user']);
      } catch (e) {
        throw new UnauthorizedException('Invalid token');
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
        const cookieToken = request.headers["cookie"]
          ?.split("; ")
          .find((cookie) => cookie.startsWith("token="))
          ?.split("=")[1];
      
        const authHeaderToken = request.headers["authorization"]?.split(" ")[1];
      
        console.log("Extracted Token from Cookie:", cookieToken); // Debug cookie token
        console.log("Extracted Token from Authorization Header:", authHeaderToken); // Debug header token
      
        return cookieToken || authHeaderToken;
      }
      
  }
  