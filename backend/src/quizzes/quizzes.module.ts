import { forwardRef, Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesSchema } from './models/quizzes.schema';
import { QuestionbankSchema } from './models/questionbank.schema';
import { UsersModule } from 'src/users/users.module';
import { ModulesModule } from 'src/modules/modules.module';
@Module({
  imports: [forwardRef(()=>UsersModule) ,ModulesModule,
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizzesSchema },
      { name: 'Questionbank', schema: QuestionbankSchema },
    ]),
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports: [QuizzesService, MongooseModule],
})
export class QuizzesModule {}
