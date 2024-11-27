import { Role } from '../decorators/roles.decorator';
export declare class RegisterRequestDto {
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}
