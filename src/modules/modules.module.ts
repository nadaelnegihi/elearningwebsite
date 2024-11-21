import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesSchema } from './models/modules.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'modules',schema:ModulesSchema}])],
  providers: [ModulesService],
  controllers: [ModulesController]
})
export class ModulesModule {}
