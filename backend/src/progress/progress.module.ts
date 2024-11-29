import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from './models/progress.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'Progress',schema:ProgressSchema}])],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports:[ProgressService,MongooseModule]
})
export class ProgressModule {}
