import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Progress, ProgressDocument } from './models/progress.schema';
import { Module, ModuleDocument } from 'src/modules/models/modules.schema';
import { User, UserDocument } from 'src/users/models/users.schema';
import { Course, CourseDocument } from 'src/courses/models/courses.schema';
import { Response, ResponseDocument } from 'src/responses/models/responses.schema';
import { Quiz, QuizDocument } from 'src/quizzes/models/quizzes.schema';
@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: mongoose.Model<ProgressDocument>,
    @InjectModel(User.name) private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: mongoose.Model<CourseDocument>,
    @InjectModel(Module.name) private readonly moduleModel: mongoose.Model<ModuleDocument>,
    @InjectModel(Response.name) private responseModel: mongoose.Model<ResponseDocument>,
    @InjectModel(Quiz.name) private quizModel: mongoose.Model<QuizDocument>,
  ) { }

  async getCourseCompletionRate(
    courseId: mongoose.Types.ObjectId,
    studentId: mongoose.Types.ObjectId,
  ): Promise<{ courseId: mongoose.Types.ObjectId; completionRate: number }> {
    // Fetch the student's progress document
    const progress = await this.progressModel
      .findOne({ courseId, userId: studentId })
      .populate('completedModules') // Populate the completed modules
      .exec();

    if (!progress) {
      throw new Error('Progress record not found for this student and course.');
    }

    // Fetch total number of modules in the course
    const totalModules = await this.moduleModel.countDocuments({ courseId });

    if (totalModules === 0) {
      throw new Error('No modules found for this course.');
    }

    // Calculate completion percentage
    const completionRate = (progress.completedModules.length / totalModules) * 100;

    return {
      courseId,
      completionRate: Math.round(completionRate * 100) / 100, // Round to two decimal places
    };
  }
  async getStudentAverageScore(
    studentId: mongoose.Types.ObjectId,
  ): Promise<{ studentId: mongoose.Types.ObjectId; averageScore: number }> {
    // Fetch the student's document
    const student = await this.userModel.findById(studentId);

    if (!student) {
      throw new Error('Student not found.');
    }

    // Calculate average score
    const averageScore =
      student.scores.length > 0
        ? student.scores.reduce((a, b) => a + b, 0) / student.scores.length
        : 0;

    return {
      studentId,
      averageScore: Math.round(averageScore * 100) / 100, // Round to two decimal places
    };
  }
  async getStudentPerformanceMetric(
    courseId: mongoose.Types.ObjectId,
    studentId: mongoose.Types.ObjectId,
  ): Promise<{
    courseId: mongoose.Types.ObjectId;
    performanceMetric: number;
  }> {
    // Fetch course completion rate
    const { completionRate } = await this.getCourseCompletionRate(courseId, studentId);

    // Fetch student's average score
    const { averageScore } = await this.getStudentAverageScore(studentId);

    // Calculate performance metric using a weighted formula
    const performanceMetric = (completionRate * 0.6) + (averageScore * 0.4);

    return {
      courseId,
      performanceMetric: Math.round(performanceMetric * 100) / 100, // Round to two decimal places
    };
  }


  async getStudentEngagementAnalytics(
    instructorId: mongoose.Types.ObjectId,
  ): Promise<
    {
      courseId: mongoose.Types.ObjectId;
      courseName: string;
      enrolledStudents: number;
      completedStudents: number;
      performanceMetrics: {
        belowAverage: number;
        average: number;
        aboveAverage: number;
        excellent: number;
      };
    }[]
  > {
    // Fetch the courses taught by the instructor
    const instructor = await this.userModel
      .findById(instructorId)
      .populate('teachingCourses')
      .exec();

    if (!instructor) {
      throw new Error('Instructor not found');
    }

    const courses = instructor.teachingCourses;

    if (!courses || courses.length === 0) {
      throw new Error('This instructor is not teaching any courses.');
    }

    const analytics = [];

    for (const courseId of courses) {
      const students = await this.userModel
        .find({ 'studentCourses.course': courseId, role: 'student' })
        .exec();

      const enrolledStudents = students.length;

      const completedStudents = students.filter((student) =>
        student.studentCourses.some(
          (course) =>
            course.course.toString() === courseId.toString() &&
            course.status === 'completed',
        ),
      ).length;

      const performanceMetrics = {
        belowAverage: 0,
        average: 0,
        aboveAverage: 0,
        excellent: 0,
      };

      for (const student of students) {
        const avgScore =
          student.scores.length > 0
            ? student.scores.reduce((a, b) => a + b, 0) / student.scores.length
            : 0;

        if (avgScore < 50) {
          performanceMetrics.belowAverage++;
        } else if (avgScore >= 50 && avgScore < 70) {
          performanceMetrics.average++;
        } else if (avgScore >= 70 && avgScore < 90) {
          performanceMetrics.aboveAverage++;
        } else {
          performanceMetrics.excellent++;
        }
      }

      const course = await this.courseModel.findById(courseId).exec();
      analytics.push({
        courseId,
        courseName: course.title,
        enrolledStudents,
        completedStudents,
        performanceMetrics,
      });
    }

    return analytics;
  }
  async getContentEffectivenessAnalytics(
    instructorId: mongoose.Types.ObjectId,
  ): Promise<
    {
      courseId: mongoose.Types.ObjectId;
      courseName: string;
      courseRating: number;
      moduleRatings: { moduleId: mongoose.Types.ObjectId; averageRating: number }[];
      instructorRating: number;
    }[]
  > {
    // Fetch the courses taught by the instructor
    const instructor = await this.userModel
      .findById(instructorId)
      .populate('teachingCourses')
      .exec();

    if (!instructor) {
      throw new Error('Instructor not found');
    }

    const courses = instructor.teachingCourses;

    if (!courses || courses.length === 0) {
      throw new Error('This instructor is not teaching any courses.');
    }

    const analytics = [];

    for (const courseId of courses) {
      const course = await this.courseModel.findById(courseId).exec();

      if (!course) continue;

      const courseRating =
        course.ratings.length > 0
          ? course.ratings.reduce((a, b) => a + b, 0) / course.ratings.length
          : 0;

      const modules = await this.moduleModel.find({ courseId }).exec();
      const moduleRatings = modules.map((module) => ({
        moduleId: module._id,
        name: module.title,
        averageRating:
          module.ratings.length > 0
            ? module.ratings.reduce((a, b) => a + b, 0) / module.ratings.length
            : 0,
      }));

      const instructorRating =
        instructor && instructor.ratings.length > 0
          ? instructor.ratings.reduce((a, b) => a + b, 0) / instructor.ratings.length
          : 0;

      analytics.push({
        courseId,
        courseName: course.title,
        courseRating: Math.round(courseRating * 100) / 100,
        moduleRatings: moduleRatings.map((module) => ({
          name: module.name,
          moduleId: module.moduleId,
          averageRating: Math.round(module.averageRating * 100) / 100,
        })),
        instructorRating: Math.round(instructorRating * 100) / 100,
      });
    }

    return analytics;
  }
  async getQuizzesByInstructor(
    instructorId: mongoose.Types.ObjectId,
  ): Promise<{
    courseId: mongoose.Types.ObjectId;
    courseName: string;
    quizzes: {
      quizId: mongoose.Types.ObjectId;
      totalSubmissions: number;
      averageScore: number;
      topScores: { userId: mongoose.Types.ObjectId; score: number }[];
    }[];
  }[]> {
    // Fetch courses taught by the instructor
    const instructor = await this.userModel
      .findById(instructorId)
      .populate('teachingCourses')
      .exec();

    if (!instructor || instructor.role !== 'instructor') {
      throw new Error('Instructor not found or not an instructor.');
    }

    const courses = instructor.teachingCourses;

    if (!courses || courses.length === 0) {
      throw new Error('This instructor is not teaching any courses.');
    }

    // Fetch quizzes and their results for each course
    const results = [];
    for (const courseId of courses) {
      const course = await this.courseModel.findById(courseId).exec();

      if (!course) continue;

      const quizzes = await this.quizModel.find({ moduleId: { $in: course.modules } }).exec();

      const quizzesResults = [];
      for (const quiz of quizzes) {
        const responses = await this.responseModel.find({ quizId: quiz._id }).exec();

        const totalSubmissions = responses.length;
        const averageScore =
          totalSubmissions > 0
            ? responses.reduce((sum, response) => sum + response.score, 0) / totalSubmissions
            : 0;

        const topScores = responses
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((response) => ({
            userId: response.userId,
            score: response.score,
          }));

        quizzesResults.push({
          quizId: quiz._id,
          totalSubmissions,
          averageScore: Math.round(averageScore * 100) / 100, // Round to two decimals
          topScores,
        });
      }

      results.push({
        courseId: course._id,
        courseName: course.title,
        quizzes: quizzesResults,
      });
    }

    return results;
  }
}


