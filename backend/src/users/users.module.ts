import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersSchema } from './models/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressModule } from 'src/progress/progress.module';

@Module({
  imports: [ProgressModule,
    MongooseModule.forFeature([{ name: 'User', schema: UsersSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
