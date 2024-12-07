import { Controller, Get, Param, Req,Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { ProgressService } from './progress.service';
import mongoose from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { createObjectCsvStringifier } from 'csv-writer';
import { Response } from 'express';
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
    @Roles(Role.Instructor)
    @Get('instructor/engagement')
    async getStudentEngagementAnalytics(
      @Req() req: any,
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
      const instructorId = req.user._id;
      return this.progressService.getStudentEngagementAnalytics(instructorId);
    }
    

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Instructor)
  @Get('instructor/content-effectiveness')
  async getContentEffectivenessAnalytics(
    @Req() req: any,
  ): Promise<
    {
      courseId: mongoose.Types.ObjectId;
      courseName: string;
      courseRating: number;
      moduleRatings: { moduleId: mongoose.Types.ObjectId; averageRating: number }[];
      instructorRating: number;
    }[]
  > {
    const instructorId = req.user._id; // Get the instructor ID from the authenticated user
    return this.progressService.getContentEffectivenessAnalytics(instructorId);
  }

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Instructor)
  @Get('instructor/quiz-results')
  async getQuizzesByInstructor(
    @Req() req: any,
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
    const instructorId = req.user._id; // Get the instructor ID from the authenticated user
    return this.progressService.getQuizzesByInstructor(instructorId);
  }
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Instructor)
    @Get('instructor/download')
    async downloadAnalytics(
      @Req() req: any,
      @Res() res: Response,
    ): Promise<void> {
      const instructorId = req.user._id; // Retrieve instructor ID from the authenticated user
  
      // Fetch the analytics
      const engagementData = await this.progressService.getStudentEngagementAnalytics(instructorId);
      const effectivenessData = await this.progressService.getContentEffectivenessAnalytics(instructorId);
      const quizzesData = await this.progressService.getQuizzesByInstructor(instructorId);
  
      // Prepare CSV writers
      const engagementCsv = createObjectCsvStringifier({
        header: [
          { id: 'courseId', title: 'Course ID' },
          { id: 'courseName', title: 'Course Name' },
          { id: 'enrolledStudents', title: 'Enrolled Students' },
          { id: 'completedStudents', title: 'Completed Students' },
          { id: 'belowAverage', title: 'Below Average' },
          { id: 'average', title: 'Average' },
          { id: 'aboveAverage', title: 'Above Average' },
          { id: 'excellent', title: 'Excellent' },
        ],
      });
  
      const effectivenessCsv = createObjectCsvStringifier({
        header: [
          { id: 'courseId', title: 'Course ID' },
          { id: 'courseName', title: 'Course Name' },
          { id: 'courseRating', title: 'Course Rating' },
          { id: 'moduleId', title: 'Module ID' },
          { id: 'averageRating', title: 'Module Average Rating' },
          { id: 'instructorRating', title: 'Instructor Rating' },
        ],
      });
  
      const quizzesCsv = createObjectCsvStringifier({
        header: [
          { id: 'courseId', title: 'Course ID' },
          { id: 'courseName', title: 'Course Name' },
          { id: 'quizId', title: 'Quiz ID' },
          { id: 'totalSubmissions', title: 'Total Submissions' },
          { id: 'averageScore', title: 'Average Score' },
          { id: 'topScores', title: 'Top Scores' },
        ],
      });
  
      // Format data for CSV
      const engagementRows = engagementData.map((course) => ({
        courseId: course.courseId.toString(),
        courseName: course.courseName,
        enrolledStudents: course.enrolledStudents,
        completedStudents: course.completedStudents,
        belowAverage: course.performanceMetrics.belowAverage,
        average: course.performanceMetrics.average,
        aboveAverage: course.performanceMetrics.aboveAverage,
        excellent: course.performanceMetrics.excellent,
      }));
  
      const effectivenessRows = effectivenessData.flatMap((course) =>
        course.moduleRatings.map((module) => ({
          courseId: course.courseId.toString(),
          courseName: course.courseName,
          courseRating: course.courseRating,
          moduleId: module.moduleId.toString(),
          averageRating: module.averageRating,
          instructorRating: course.instructorRating,
        })),
      );
  
      const quizzesRows = quizzesData.flatMap((course) =>
        course.quizzes.map((quiz) => ({
          courseId: course.courseId.toString(),
          courseName: course.courseName,
          quizId: quiz.quizId.toString(),
          totalSubmissions: quiz.totalSubmissions,
          averageScore: quiz.averageScore,
          topScores: quiz.topScores.map((s) => `${s.userId.toString()} (${s.score})`).join(', '),
        })),
      );
  
      // Combine CSV content
      const engagementContent = engagementCsv.getHeaderString() + engagementCsv.stringifyRecords(engagementRows);
      const effectivenessContent = effectivenessCsv.getHeaderString() + effectivenessCsv.stringifyRecords(effectivenessRows);
      const quizzesContent = quizzesCsv.getHeaderString() + quizzesCsv.stringifyRecords(quizzesRows);
  
      // Combine all CSVs into one file
      const combinedContent = [
        'Student Engagement Analytics',
        engagementContent,
        '\nContent Effectiveness Analytics',
        effectivenessContent,
        '\nQuiz Results Analytics',
        quizzesContent,
      ].join('\n');
  
      // Send as file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      res.send(combinedContent);
    }
  }
  

   

