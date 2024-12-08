
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
  async updateUser(userId: mongoose.Types.ObjectId, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const user= await this.UserModel.findByIdAndUpdate(
      userId,
      { $set: updateUserDto }, // Apply updates
      { new: true } // Return the updated document
    ).exec();
    return user
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
        courses: user.studentCourses.map((courseStatus) => ({
          course: courseStatus.course,
          status: courseStatus.status, // enrolled or completed
        })),
      };
    } else if (user.role === 'instructor') {
      return {
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
        { email: { $regex: query, $options: 'i' } },   
      ],
    }).exec();
  }
  async rateInstructor(
    instructorId: mongoose.Types.ObjectId,
    rating: number,
  ): Promise<void> {
    const instructor = await this.UserModel.findById(instructorId);
  
    if (!instructor ) {
      throw new Error('Instructor not found');
    }
  
    instructor.ratings.push(rating);
    await instructor.save();
  }
  async findAll(): Promise<UserDocument[]> {
    return this.UserModel.find({ role: { $in: ['student', 'instructor'] } }) // Filter by roles
      .select('-password') // Exclude the password field from the results
      .exec();
  }
  
  async deleteUser(userId: mongoose.Schema.Types.ObjectId): Promise<void> {
    const result = await this.UserModel.findByIdAndDelete(userId);
    if (!result) {
      throw new Error('User not found');
    }

}
  async enrollInCourse(userId: mongoose.Types.ObjectId, courseId: mongoose.Types.ObjectId): Promise<void> {
    // Fetch the student by ID
    const user = await this.UserModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    // Check if the course is already enrolled
    const isAlreadyEnrolled = user.studentCourses.some((courseStatus) =>
      courseStatus.course.equals(courseId),
    );

    if (isAlreadyEnrolled) {
      throw new Error('Already enrolled in this course');
    }

    // Add the course to the studentCourses array
    user.studentCourses.push({ course: courseId, status: 'enrolled' });
    await user.save();
  }

}
