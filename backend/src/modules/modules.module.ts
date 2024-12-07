import { forwardRef, Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesSchema } from './models/modules.schema';
import { MulterModule } from '@nestjs/platform-express';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ResourceSchema } from './models/resourses.schema';

@Module({
  imports: [
    CoursesModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Module', schema: ModulesSchema }, 
      { name: 'Resource', schema: ResourceSchema },]),
    forwardRef(() => ProgressModule), // Use forwardRef here
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService, MongooseModule],
})
export class ModulesModule {}
