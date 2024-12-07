import { Controller,UseGuards,Post, Body } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { SubmitQuizDto } from './dto/SubmitQuizDto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}
  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student,Role.Instructor)
  @Post('submit')
  async submitQuiz(@Body() submitQuizDto: SubmitQuizDto): Promise<{ percentage: number; feedback: string }> {
    return this.responsesService.submitQuiz(submitQuizDto);
  }
}
