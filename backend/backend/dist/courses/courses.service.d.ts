import { Course, CourseDocument } from './models/courses.schema';
import { CreateCourseDto } from './dto/CreateCourseDto';
import mongoose from 'mongoose';
import { User } from 'src/users/models/users.schema';
import { UpdateCourseDto } from './dto/UpdateCourseDto';
export declare class CoursesService {
    private courseModel;
    private userModel;
    constructor(courseModel: mongoose.Model<Course>, userModel: mongoose.Model<User>);
    createCourse(createCourseDto: CreateCourseDto, instructorName: string): Promise<CourseDocument>;
    getAllCourses(): Promise<CourseDocument[]>;
    getCourseById(courseId: mongoose.Schema.Types.ObjectId): Promise<CourseDocument>;
    updateCourse(courseId: mongoose.Schema.Types.ObjectId, updateCourseDto: UpdateCourseDto): Promise<Course>;
    deleteCourse(courseId: mongoose.Schema.Types.ObjectId): Promise<void>;
    searchCourses(query: {
        title?: string;
        category?: string;
        created_by?: string;
    }): Promise<Course[]>;
}
