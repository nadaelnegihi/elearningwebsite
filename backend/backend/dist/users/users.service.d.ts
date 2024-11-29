import mongoose from 'mongoose';
import { User, UserDocument } from 'src/users/models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser';
export declare class UsersService {
    private UserModel;
    constructor(UserModel: mongoose.Model<User>);
    create(userData: User): Promise<UserDocument>;
    findByName(username: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument>;
    findById(id: mongoose.Schema.Types.ObjectId): Promise<UserDocument>;
    updateUser(userId: mongoose.Schema.Types.ObjectId, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    getUserCourses(userId: mongoose.Schema.Types.ObjectId): Promise<any>;
    searchStudents(query: string): Promise<UserDocument[]>;
    searchInstructors(query: string): Promise<UserDocument[]>;
}
