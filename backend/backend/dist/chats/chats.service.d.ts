import mongoose from 'mongoose';
import { ChatMessageDocument } from './models/chats.schema';
import { CreateChatDto } from './dto/CreateChatDto';
import { CreateGroupChatDto } from './dto/CreateGroupChat.dto';
import { AddGroupChatMessageDto } from './dto/AddGroupChatMessage.dto';
import { Server } from 'socket.io';
export declare class ChatsService {
    private chatModel;
    constructor(chatModel: mongoose.Model<ChatMessageDocument>);
    createChatMessage(createChatDto: CreateChatDto, senderId: string): Promise<ChatMessageDocument>;
    getChatHistory(conversationId: string): Promise<ChatMessageDocument[]>;
    ActiveChatMessage(messageId: string): Promise<{
        message: string;
    }>;
    createGroup(createGroupDto: CreateGroupChatDto, creatorId: string): Promise<ChatMessageDocument>;
    addMessageToGroup(addGroupMessageDto: AddGroupChatMessageDto, senderId: string): Promise<ChatMessageDocument>;
    getGroupChatHistory(groupId: string): Promise<ChatMessageDocument[]>;
    notifyClients(server: Server, message: any, conversationId: string): void;
}
