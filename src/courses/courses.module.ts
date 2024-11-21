import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from './models/courses.schema';
@Module({
    imports:[MongooseModule.forFeature([{name:'courses',schema:CoursesSchema}])],
    providers: [CoursesService],
    controllers: [CoursesController]
  })
export class CoursesModule {}