import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/CreateChatDto';
import { AddGroupChatMessageDto } from './dto/AddGroupChatMessage.dto';
export declare class ChatsGateway {
    private readonly chatsService;
    server: Server;
    constructor(chatsService: ChatsService);
    handleMessage(createChatDto: CreateChatDto, client: Socket): Promise<void>;
    handleJoinRoom(conversationId: string, client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSendGroupMessage(payload: AddGroupChatMessageDto, client: Socket): Promise<void>;
}
