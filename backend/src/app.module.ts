import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { ProgressModule } from './progress/progress.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import { ForumsModule } from './forums/forums.module';
@Module({
  imports: [UsersModule, CoursesModule, ModulesModule,AuthModule,NotesModule,
    ProgressModule,QuizzesModule,ResponsesModule,MongooseModule.forRoot('mongodb://localhost:27017/elearningweb'), ChatsModule, ForumsModule],
  controllers: [AppController],
  providers: [AppService, BackupService, BackupDbService],
})
export class AppModule { }
