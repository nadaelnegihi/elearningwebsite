import { forwardRef, Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from './models/progress.schema';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    forwardRef(() => ModulesModule), // Use forwardRef here
  ],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService, MongooseModule],
})
export class ProgressModule {}
