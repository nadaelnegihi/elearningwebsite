import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersSchema } from './models/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:UsersSchema}])],
  providers: [UsersService],
  controllers: [UsersController],
  exports:[UsersService,MongooseModule]
})
export class UsersModule {}

