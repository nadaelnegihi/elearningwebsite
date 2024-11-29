import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesSchema } from './models/modules.schema';
import { MulterModule } from '@nestjs/platform-express';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [CoursesModule,UsersModule,
    MongooseModule.forFeature([{ name: 'Module', schema: ModulesSchema }]),  
    MulterModule.register({
      dest: './uploads',  
    }),
  ],
  providers: [ModulesService],
  controllers: [ModulesController],
  exports:[ModulesService,MongooseModule]
})
export class ModulesModule {}
