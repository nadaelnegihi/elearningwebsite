import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/CreateChatDto';
import { CreateGroupChatDto } from './dto/CreateGroupChat.dto';
export declare class ChatsController {
    private chatsService;
    constructor(chatsService: ChatsService);
    createChatMessage(createChatDto: CreateChatDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./models/chats.schema").ChatMessage> & import("./models/chats.schema").ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getChatHistory(conversationId: string): Promise<(import("mongoose").Document<unknown, {}, import("./models/chats.schema").ChatMessage> & import("./models/chats.schema").ChatMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    deleteMessage(messageId: string): Promise<{
        message: string;
    }>;
    createGroup(createGroupDto: CreateGroupChatDto, req: any): Promise<any>;
}
