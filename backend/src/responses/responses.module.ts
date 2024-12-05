import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesSchema } from './models/responses.schema';
import { UsersModule } from 'src/users/users.module';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
@Module({
  imports:[QuizzesModule,UsersModule,MongooseModule.forFeature([{name:'Response',schema:ResponsesSchema}])],
  providers: [ResponsesService],
  controllers: [ResponsesController],
  exports:[ResponsesService,MongooseModule]
})
export class ResponsesModule {}