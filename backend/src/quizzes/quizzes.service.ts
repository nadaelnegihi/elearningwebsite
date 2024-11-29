import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Quiz } from './models/quizzes.schema';
import { CreateQuizDto } from './dto/CreateQuizDto';
import { User } from 'src/users/models/users.schema'; 

@Injectable()
export class QuizzesService {
  constructor(
  ) {}


}
