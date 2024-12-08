import { Module } from '@nestjs/common';
import { ForumService } from './forums.service';
import { ForumController } from './forums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';  // Ensure this path is correct
import { ForumPostSchema } from './models/forums.schema';  
import { CommentSchema } from './models/comments.schema'; 
import { Thread, ThreadSchema } from './models/threads.schema';
import { Reply, ReplySchema } from './models/replies.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: 'ForumPost', schema: ForumPostSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: Thread.name, schema: ThreadSchema },
      { name: Reply.name, schema: ReplySchema },
    ]), 
  ],
  providers: [ForumService],
  controllers: [ForumController],
  exports: [MongooseModule],
})
export class ForumsModule {}
