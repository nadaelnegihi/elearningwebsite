import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesSchema } from './models/quizzes.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'quizzes',schema:QuizzesSchema}])],
  providers: [QuizzesService],
  controllers: [QuizzesController]
})
export class QuizzesModule {}
