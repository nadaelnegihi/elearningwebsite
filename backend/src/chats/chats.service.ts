import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from './models/chats.schema';
import { Conversation, ConversationDocument } from './models/conversation.schema';
import { CreateChatDto } from './dto/CreateChatDto';
import { CreateGroupChatDto } from './dto/CreateGroupChat.dto';
import { AddGroupChatMessageDto } from './dto/AddGroupChatMessage.dto';
import { v4 as uuidv4 } from 'uuid';  // Import uuid to generate conversationId
import { Server } from 'socket.io';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatMessage.name) private chatModel: mongoose.Model<ChatMessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: mongoose.Model<ConversationDocument>,
  ) {}

  // Create a new chat message and ensure a conversation exists
  async createChatMessage(createChatDto: CreateChatDto & { conversationId: string }, senderId: string) {
    const { conversationId, message, recipientId } = createChatDto;
  
    // If no conversationId is provided, generate a new one
    let conversation;
    if (!conversationId) {
      // Create a new conversation ID
      const newConversationId = uuidv4();
      
      // Create a new conversation document
      conversation = new this.conversationModel({
        id: newConversationId,
        participants: [senderId, recipientId].filter(Boolean),  // Add sender and recipient
        createdAt: new Date(),
      });
      
      // Save the conversation to the database
      await conversation.save();
    } else {
      // If a conversationId is provided, check if the conversation exists
      conversation = await this.conversationModel.findOne({ id: conversationId });
      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }
    }

    // Create the chat message
    const chatMessage = new this.chatModel({
      conversationId: conversation.id,
      content: message,
      sender: senderId,
      receiver: recipientId || null,
      timestamp: new Date(),
    });

    await chatMessage.save();

    return chatMessage;
  }

  // Fetch chat history between users or within a group
  async getChatHistory(conversationId: string): Promise<ChatMessageDocument[]> {
    const messages = await this.chatModel.find({ conversationId }).exec();
    if (!messages) {
      throw new NotFoundException('Chat history not found');
    }
    return messages;
  }

  // Mark a message as inactive (soft delete)
  async ActiveChatMessage(messageId: string): Promise<{ message: string }> {
    const objectId = new mongoose.Types.ObjectId(messageId);
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

 // Create a new group chat
 async createGroup(createGroupDto: CreateGroupChatDto, creatorId: string): Promise<ChatMessageDocument> {
  const groupChat = new this.chatModel({
    ...createGroupDto,
    isGroupChat: true,
    sender: creatorId,
  });

  return groupChat.save();
}


  

  // Add a message to a group chat
  async addMessageToGroup(addGroupMessageDto: AddGroupChatMessageDto, senderId: string): Promise<ChatMessageDocument> {
    const { content, groupId } = addGroupMessageDto;
  
    // Retrieve the group document using the groupId
    const group = await this.chatModel.findById(groupId).exec();
  
    if (!group || !group.isGroupChat) {
      throw new NotFoundException('Group not found or is not a valid group chat');
    }
  
    // Create the new message with the required groupName
    const newMessage = new this.chatModel({
      content,  // The message content
      sender: senderId,
      conversationId: groupId,  // The conversation ID (groupId)
      receiver: null,  // No specific receiver for group chats
      timestamp: new Date(),
      isGroupChat: true,  // Mark as a group chat message
      groupName: group.groupName,  // Set the groupName field from the group document
    });
  
    return newMessage.save();
  }

  // Fetch group chat history
  async getGroupChatHistory(groupId: string): Promise<ChatMessageDocument[]> {
    return this.chatModel.find({ conversationId: groupId, isGroupChat: true }).exec();
  }

  // WebSocket Notification Broadcasting
  notifyClients(server: Server, message: any, conversationId: string) {
    // Notify all clients within the conversation room
    server.to(conversationId).emit('newMessage', message);
  }
}
