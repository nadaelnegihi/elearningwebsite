import mongoose from 'mongoose';
import { User, UserDocument } from 'src/users/models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser.dto';
export declare class UsersService {
    private UserModel;
    constructor(UserModel: mongoose.Model<User>);
    create(userData: User): Promise<UserDocument>;
    findByName(username: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument>;
    findById(id: string): Promise<UserDocument>;
    update(id: string, updateData: UpdateUserDto): Promise<UserDocument>;
}
