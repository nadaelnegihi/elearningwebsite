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

  async createCourse(createCourseDto: CreateCourseDto, instructorName: string): Promise<CourseDocument> {
    const newCourse = new this.courseModel({
      ...createCourseDto,
      created_by: instructorName, 
    });
    const savedCourse = await newCourse.save();
    const courseId = savedCourse._id as mongoose.Types.ObjectId;
    const instructor = await this.userModel.findOne({ name: instructorName, role: 'instructor' });
    if (!instructor) {
      throw new Error('Instructor not found');
    }
    instructor.teachingCourses.push(courseId);
    await instructor.save();

    return savedCourse;
  }
  async getAllCourses(): Promise<CourseDocument[]> {
    return this.courseModel.find().exec();
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
  
    await this.courseModel.findByIdAndDelete(courseId);  
  }
  async searchCourses(query: { title?: string, category?: string, created_by?: string }): Promise<Course[]> {
    const searchConditions = {};

    if (query.title) {
      searchConditions['title'] = { $regex: query.title, $options: 'i' };  
    }

    if (query.category) {
      searchConditions['category'] = { $regex: query.category, $options: 'i' };
    }

    if (query.created_by) {
      searchConditions['created_by'] = { $regex: query.created_by, $options: 'i' };
    }

    return this.courseModel.find(searchConditions).exec();
  }
  
}
