import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/CreateCourseDto';
import { UpdateCourseDto } from './dto/UpdateCourseDto';
import { Course } from './models/courses.schema';
import mongoose from 'mongoose';
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    createCourse(createCourseDto: CreateCourseDto, req: any): Promise<mongoose.Document<unknown, {}, Course> & Course & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCourses(): Promise<(mongoose.Document<unknown, {}, Course> & Course & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getCourse(courseId: mongoose.Schema.Types.ObjectId): Promise<mongoose.Document<unknown, {}, Course> & Course & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCourse(courseId: mongoose.Schema.Types.ObjectId, updateCourseDto: UpdateCourseDto): Promise<Course>;
    deleteCourse(courseId: mongoose.Schema.Types.ObjectId): Promise<{
        message: string;
    }>;
    searchCourses(title: string, category: string, created_by: string): Promise<Course[]>;
}
