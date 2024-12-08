import { Module } from '@nestjs/common';
import { ForumService } from './forums.service';
import { ForumController } from './forums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';  // Ensure this path is correct
import { ForumPostSchema } from './models/forums.schema';  
import { Thread, ThreadSchema } from './models/threads.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: 'ForumPost', schema: ForumPostSchema },
      { name: 'Comment', schema: ForumPostSchema },
      { name: 'Thread', schema: ThreadSchema },
    ]), 
  ],
  providers: [ForumService],
  controllers: [ForumController],
  exports: [MongooseModule],
})
export class ForumsModule {}
