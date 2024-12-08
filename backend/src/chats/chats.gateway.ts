import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/CreateChatDto';
import { AddGroupChatMessageDto } from './dto/AddGroupChatMessage.dto';

@WebSocketGateway({ cors: true }) // Adjust CORS if needed for frontend connection
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  // Handle incoming messages from the client
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const message = await this.chatsService.createChatMessage(createChatDto, client.id);
    this.server.to(createChatDto.conversationId).emit('newMessage', message);  // Broadcast message to room
  }

  // Handle client joining a conversation room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(conversationId);
    this.server.to(conversationId).emit('userJoined', { userId: client.id });
  }

  // Handle client disconnecting
  handleDisconnect(@ConnectedSocket() client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendGroupMessage')
async handleSendGroupMessage(@MessageBody() payload: AddGroupChatMessageDto, @ConnectedSocket() client: Socket) {
  const message = await this.chatsService.addMessageToGroup(payload, client.
    id);

  // Broadcast the message to the group room
  this.server.to(payload.groupId).emit('newGroupMessage', message);
}

}
