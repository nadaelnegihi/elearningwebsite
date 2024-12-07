
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument, } from 'src/users/models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: mongoose.Model<User>
  ) { }

  async create(userData: User): Promise<UserDocument> {
    const newuser = new this.UserModel(userData);  // Create a new student document
    const user = await newuser.save()
    return user;  // Save it to the database
  }
  async findByName(username: string): Promise<UserDocument> {
    return await this.UserModel.findOne({ username });  // Fetch a student by username
  }
  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({ email })
    return user;  // Fetch a student by username
  }
  async findById(id: mongoose.Schema.Types.ObjectId): Promise<UserDocument> {
    console.log(id)
    const user = await this.UserModel.findById(id).select("-password");  // Fetch a student by ID
    return user
  }
  async updateUser(userId: mongoose.Schema.Types.ObjectId, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return await this.UserModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
  }
  async getUserCourses(userId: mongoose.Schema.Types.ObjectId): Promise<any> {
    const user = await this.UserModel.findById(userId)
      .populate('studentCourses.course')
      .populate('teachingCourses')
      .exec();

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'student') {
      return {
        role: 'student',
        courses: user.studentCourses.map((courseStatus) => ({
          course: courseStatus.course,
          status: courseStatus.status, // enrolled or completed
        })),
      };
    } else if (user.role === 'instructor') {
      return {
        role: 'instructor',
        courses: user.teachingCourses, // Courses being taught
      };
    }

    throw new Error('User role does not have courses.');
  }
  async searchStudents(query: string): Promise<UserDocument[]> {
    return this.UserModel.find({
      role: 'student',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }

  async searchInstructors(query: string): Promise<UserDocument[]> {
    return this.UserModel.find({
      role: 'instructor', // Only instructors
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },                                // Exact match for ID
      ],
    }).exec();
  }





}