import { Module, forwardRef } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from './models/courses.schema';
import { UsersModule } from 'src/users/users.module';
@Module({
    imports:[ forwardRef(() => UsersModule),MongooseModule.forFeature([{name:'Course',schema:CoursesSchema}])],
    providers: [CoursesService],
    controllers: [CoursesController],
    exports:[CoursesService,MongooseModule]
  })
export class CoursesModule {}