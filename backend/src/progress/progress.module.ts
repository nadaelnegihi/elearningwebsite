import { forwardRef, Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from './models/progress.schema';
import { UsersModule } from 'src/users/users.module';
import { ResponsesModule } from 'src/responses/responses.module';
import { CoursesModule } from 'src/courses/courses.module';
import { ModulesModule } from 'src/modules/modules.module';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
@Module({
  imports: [forwardRef(() => UsersModule), ResponsesModule, CoursesModule,
    ModulesModule,
     QuizzesModule,
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
  ],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService, MongooseModule],
})
export class ProgressModule {}
