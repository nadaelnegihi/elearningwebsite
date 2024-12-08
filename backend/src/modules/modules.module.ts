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
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [CoursesModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: 'Module', schema: ModulesSchema }, 
      { name: 'Resource', schema: ResourceSchema },]), forwardRef(() => ProgressModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  ],
  providers: [ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService, MongooseModule],
})
export class ModulesModule {}
