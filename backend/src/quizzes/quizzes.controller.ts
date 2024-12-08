import { Controller, Get,Post,Req,Put, Param, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/CreateQuizDto';
import { CreateQuestionDto } from './dto/CreateQuestionDto';
import { QuestionDocument,Questionbank } from './models/questionbank.schema';
import mongoose from 'mongoose';
@Controller('quizzes')
export class QuizzesController {  
    constructor(private quizService: QuizzesService) {}

    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Instructor)
    @Post('questions')
    async createQuestion(@Body() createQuestionDto: CreateQuestionDto): Promise<Questionbank> {
      return this.quizService.createQuestion(createQuestionDto);
    }
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Instructor)
    @Post('create')
    async createQuiz(@Body() createQuizDto: CreateQuizDto, @Req() req: any) {
      const instructorId = req.user._id; // Extract the instructor's ID from the JWT
      return this.quizService.createQuiz(createQuizDto, instructorId);
    }
    
  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student, Role.Instructor)
  @Get()
  async getAllQuizzes() {
      return this.quizService.getAllQuizzes();
  }

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student, Role.Instructor)
  @Get(':quizId')
  async getQuizById(@Param('quizId') quizId: string) {
    const objectId = new mongoose.Types.ObjectId(quizId); // Convert `quizId` to ObjectId
    return this.quizService.getQuizById(objectId);
  }
  
}

