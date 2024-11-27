import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { Types } from 'mongoose';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(user: RegisterRequestDto): Promise<string>;
    signIn(email: string, password: string): Promise<{
        access_token: string;
        payload: {
            userid: Types.ObjectId;
            role: string;
        };
    }>;
}
