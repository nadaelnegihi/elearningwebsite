import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesSchema } from './models/responses.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'responses',schema:ResponsesSchema}])],
  providers: [ResponsesService],
  controllers: [ResponsesController]
})
export class ResponsesModule {}