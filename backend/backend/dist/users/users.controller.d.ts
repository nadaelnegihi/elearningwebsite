import { UsersService } from './users.service';
import { User, UserDocument } from './models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getUserCourses(req: any): Promise<any>;
    searchStudents(query: string): Promise<UserDocument[]>;
    searchInstructors(query: string): Promise<UserDocument[]>;
}
