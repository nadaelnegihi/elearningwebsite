import { Course, CourseDocument } from './models/courses.schema';
import { CreateCourseDto } from './dto/CreateCourseDto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument, } from 'src/users/models/users.schema';
import { UpdateCourseDto } from './dto/UpdateCourseDto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: mongoose.Model<Course>,
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    instructorId: mongoose.Types.ObjectId
  ): Promise<CourseDocument> {
    const instructor = await this.userModel.findOne({ _id: instructorId, role: 'instructor' });
    if (!instructor) {
      throw new Error('Instructor not found');
    }
  
    // Extract the instructor's name from the fetched instructor
    const instructorName = instructor.name;
  
    // Create a new course and set the `created_by` field with the instructor's name
    const newCourse = new this.courseModel({
      ...createCourseDto,
      created_by: instructorName,
    });
  
    // Save the new course
    const savedCourse = await newCourse.save();
    const courseId = savedCourse._id as mongoose.Types.ObjectId;
  
    // Add the course ID to the instructor's teachingCourses array
    instructor.teachingCourses.push(courseId);
    await instructor.save();
  
    return savedCourse;
  }
  
  async getAllCourses(): Promise<CourseDocument[]> {
    return this.courseModel.find({ isAvailable: true }).exec();
  }
  

  async getCourseById(courseId:  mongoose.Schema.Types.ObjectId): Promise<CourseDocument> {
    const course = await this.courseModel
      .findById(courseId)
      .populate('modules') 
      .exec();
    
    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  async updateCourse(
    courseId: mongoose.Schema.Types.ObjectId,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      courseId,
      { $set: updateCourseDto },
      { new: true },
    );

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    return updatedCourse;
  }

  async deleteCourse(courseId: mongoose.Schema.Types.ObjectId): Promise<void> {
    const course = await this.courseModel.findById(courseId);
  
    if (!course) {
      throw new Error('Course not found');
    }
  
    course.isAvailable = false; // Mark the course as unavailable
    await course.save();
  }
  async searchCourses(query: string): Promise<Course[]> {
    return this.courseModel.find({
      isAvailable: true, // Ensures only available courses are returned
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { created_by: { $regex: query, $options: 'i' } },
        { keywords: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }
  
  
  async rateCourse(
    courseId: mongoose.Types.ObjectId,
    rating: number,
  ): Promise<void> {
    const course = await this.courseModel.findById(courseId);
  
    if (!course) {
      throw new Error('Course not found');
    }
  
    course.ratings.push(rating);
    await course.save();
  }
  
}
