import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesSchema } from './models/quizzes.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'Question',schema:QuizzesSchema}])],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports:[QuizzesService,MongooseModule]
})
export class QuizzesModule {}
