import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { ProgressService } from './progress.service';
import mongoose from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}
  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student)
  @Get('course/:courseId/completion-rate')
  async getCourseCompletionRate(
    @Param('courseId') courseId: mongoose.Types.ObjectId,
    @Req() req: any, // Access the request object
  ): Promise<{ courseId: mongoose.Types.ObjectId; completionRate: number }> {
    const studentId = req.user._id; // Retrieve the studentId from the authenticated user
    return this.progressService.getCourseCompletionRate(courseId, studentId);
  }
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student)
    @Get('student/average-score')
    async getStudentAverageScore(
      @Req() req: any,
    ): Promise<{ studentId: mongoose.Types.ObjectId; averageScore: number }> {
      const studentId = req.user._id; // Retrieve student ID from the authenticated user
      return this.progressService.getStudentAverageScore(studentId);
    }
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student)
    @Get('course/:courseId/performance-metric')
    async getStudentPerformanceMetric(
      @Param('courseId') courseId: mongoose.Types.ObjectId,
      @Req() req: any,
    ): Promise<{
      courseId: mongoose.Types.ObjectId;
      performanceMetric: number;
    }> {
      const studentId = req.user._id; // Retrieve student ID from the authenticated user
      return this.progressService.getStudentPerformanceMetric(courseId, studentId);
    }
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Instructor) // Ensure only instructors can access this endpoint
    @Get('course/:courseId/engagement')
    async getStudentEngagementAnalytics(
      @Param('courseId') courseId: mongoose.Types.ObjectId,
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
      return this.progressService.getStudentEngagementAnalytics(courseId);
    }
  }
   

