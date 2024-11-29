import { Controller, Get,Post,Req,Put, Param, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/CreateQuizDto';
@Controller('quizzes')
export class QuizzesController {  
    constructor(private readonly quizService: QuizzesService) {}


}
