import { Controller,UseGuards,Post, Param,Body } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { SubmitQuizDto } from './dto/SubmitQuizDto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import mongoose from 'mongoose';
@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}
  
@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Student)
@Post(':quizId/submit')
async submitQuiz(
  @Param('quizId') quizId: mongoose.Types.ObjectId, // Extract quizId from the URL
  @Body() submitQuizDto: Omit<SubmitQuizDto, 'quizId'>, // Exclude quizId from the DTO
): Promise<{
  percentage: number;
  feedback: string[];
  detailedResults: { questionId: string; status: string; selectedAnswer: string; correctAnswer: string }[];
}> {
  return this.responsesService.submitQuiz(quizId, submitQuizDto);
}

  
  
}
