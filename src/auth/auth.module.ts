import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from 'src/users/models/users.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'users',schema:UsersSchema}])],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
