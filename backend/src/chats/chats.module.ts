import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ChatMessageSchema } from './models/chats.schema'; 
import { Conversation, ConversationSchema } from './models/conversation.schema';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: 'ChatMessage', schema: ChatMessageSchema }, 
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ChatsService, ChatsGateway],
  controllers: [ChatsController],
  exports: [MongooseModule , ChatsService],
})
export class ChatsModule {}

