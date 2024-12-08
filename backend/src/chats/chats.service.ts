import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from './models/chats.schema';
import { CreateChatDto } from './dto/CreateChatDto';
import { CreateGroupChatDto } from './dto/CreateGroupChat.dto';
import { AddGroupChatMessageDto } from './dto/AddGroupChatMessage.dto';
import { Server } from 'socket.io';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatMessage.name) private chatModel: mongoose.Model<ChatMessageDocument>,
  ) {}

  // Create and save a new chat message
  async createChatMessage(createChatDto: CreateChatDto, senderId: string): Promise<ChatMessageDocument> {
    const newMessage = new this.chatModel({
      ...createChatDto,
      sender: senderId,
      createdAt: new Date(),
    });
    const savedMessage = await newMessage.save();
    return savedMessage;
  }

  // Fetch chat history between users or within a group
  async getChatHistory(conversationId: string): Promise<ChatMessageDocument[]> {
    const messages = await this.chatModel.find({ conversationId }).exec();
    if (!messages) {
      throw new NotFoundException('Chat history not found');
    }
    return messages;
  }

 
async ActiveChatMessage(messageId: string): Promise<{ message: string }> {
  const updatedMessage = await this.chatModel.findByIdAndUpdate(
    messageId,
    { isActive: false }, // Set the message as inactive
    { new: true } // Return the updated document
  );

  if (!updatedMessage) {
    throw new NotFoundException('Chat message not found');
  }

  return { message: 'Chat message marked as inactive successfully' };
}

async createGroup(createGroupDto: CreateGroupChatDto, creatorId: string): Promise<ChatMessageDocument> {
  const groupChat = new this.chatModel({
    ...createGroupDto,
    isGroupChat: true,
    sender: creatorId,
  });

  return groupChat.save();
}

async addMessageToGroup(addGroupMessageDto: AddGroupChatMessageDto, senderId: string): Promise<ChatMessageDocument> {
  const { message, groupId } = addGroupMessageDto;

  const group = await this.chatModel.findById(groupId).exec();
  if (!group || !group.isGroupChat) {
    throw new NotFoundException('Group not found');
  }

  const newMessage = new this.chatModel({
    message,
    sender: senderId,
    conversationId: groupId,
    isGroupChat: true,
  });

  return newMessage.save();
}

async getGroupChatHistory(groupId: string): Promise<ChatMessageDocument[]> {
  return this.chatModel.find({ conversationId: groupId, isGroupChat: true }).exec();
}




    // WebSocket Notification Broadcasting
    notifyClients(server: Server, message: any, conversationId: string) {
        // Notify all clients within the conversation room
        server.to(conversationId).emit('newMessage', message);
      }
}

