import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { SignInDto } from './dto/SignInDto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: SignInDto, res: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        user: {
            userid: import("mongoose").Types.ObjectId;
            role: string;
        };
    }>;
    signup(registerRequestDto: RegisterRequestDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: string;
    }>;
}
