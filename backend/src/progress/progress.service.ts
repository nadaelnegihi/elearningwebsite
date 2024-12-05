import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Progress, ProgressDocument } from './models/progress.schema';
import { Module,ModuleDocument } from 'src/modules/models/modules.schema';
import { User,UserDocument } from 'src/users/models/users.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: mongoose.Model<ProgressDocument>,
    @InjectModel(User.name) private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Module.name) private readonly moduleModel: mongoose.Model<ModuleDocument>,
  ) {}

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
    courseId: mongoose.Types.ObjectId,
  ): Promise<{
    enrolledStudents: number;
    completedStudents: number;
    performanceMetrics: {
      belowAverage: number;
      average: number;
      aboveAverage: number;
      excellent: number;
    };
  }> {
    // Fetch students enrolled in the course
    const students = await this.userModel
      .find({ 'studentCourses.course': courseId, role: 'student' })
      .exec();

    const enrolledStudents = students.length;

    // Count students who completed the course
    const completedStudents = students.filter((student) =>
      student.studentCourses.some(
        (course) =>
          course.course.toString() === courseId.toString() &&
          course.status === 'completed',
      ),
    ).length;

    // Count students based on their performance metrics
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

    return {
      enrolledStudents,
      completedStudents,
      performanceMetrics,
    };
  }
  
}
