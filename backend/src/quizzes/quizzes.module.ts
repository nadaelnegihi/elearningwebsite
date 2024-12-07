import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesSchema } from './models/quizzes.schema';
import { UsersModule } from 'src/users/users.module';
import { QuestionbankSchema} from './models/questionbank.schema';
@Module({
  imports:[UsersModule,MongooseModule.forFeature([ { name: 'Quiz', schema: QuizzesSchema },{ name: 'Questionbank', schema: QuestionbankSchema }])],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports:[QuizzesService,MongooseModule]
})
export class QuizzesModule {}
