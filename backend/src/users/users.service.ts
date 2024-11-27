
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument, } from 'src/users/models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {   constructor(
    @InjectModel(User.name) private UserModel: mongoose.Model<User>
) { }

async create(userData: User): Promise<UserDocument> {
    const newuser = new this.UserModel(userData);  // Create a new student document
    const user=  await newuser.save()
    return user;  // Save it to the database
}
async findByName(username: string):Promise<UserDocument> {
    return await this.UserModel.findOne({username});  // Fetch a student by username
}
async findByEmail(email: string):Promise<UserDocument> {
    const user=await this.UserModel.findOne({email})
    return user;  // Fetch a student by username
}
async findById(id: string): Promise<UserDocument> {
    console.log(id)
    const user=  await this.UserModel.findById(id);  // Fetch a student by ID
    return user
}
async update(id: string, updateData: UpdateUserDto): Promise<UserDocument> {
    return await this.UserModel.findByIdAndUpdate(id, updateData, { new: true });  // Find and update the student
}

  }