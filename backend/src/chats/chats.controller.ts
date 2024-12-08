  import {Body,Controller,Delete,Get,Param,Post,UseGuards,Req,} from '@nestjs/common';
  import { ChatsService } from './chats.service';
  import { CreateChatDto } from './dto/CreateChatDto';
  import { CreateGroupChatDto } from './dto/CreateGroupChat.dto';
  import { AddGroupChatMessageDto } from './dto/AddGroupChatMessage.dto';
  import { AuthGuard } from 'src/auth/guards/authentication.guard';
  import { authorizationGuard } from 'src/auth/guards/authorization.guard';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  import { Role } from 'src/auth/decorators/roles.decorator';
  import { v4 as uuidv4 } from 'uuid'; 
  
  @Controller('chats')
  export class ChatsController {
    constructor(private chatsService: ChatsService) {}

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student, Role.Instructor)
  @Post()
async createChatMessage(@Body() createChatDto: CreateChatDto, @Req() req: any) {
  const senderId = req.user.id; // Extract sender's ID from the request
  
  // Generate a unique conversationId
  const conversationId = uuidv4();

  // Pass the conversationId to the chat service along with the chat details
 return this.chatsService.createChatMessage(createChatDto, senderId);
}

   @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student, Role.Instructor)
    @Get(':conversationId')
    async getChatHistory(@Param('conversationId') conversationId: string) {
      return this.chatsService.getChatHistory(conversationId);
    }

    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student, Role.Instructor)
    @Delete(':messageId')
    async deleteMessage(@Param('messageId') messageId: string) {
      return this.chatsService.ActiveChatMessage(messageId);
    }

    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Instructor)
    @Post('create-group')
    async createGroup(
      @Body() createGroupDto: CreateGroupChatDto,
      @Req() req: any,
    ): Promise<any> {
      return this.chatsService.createGroup(createGroupDto, req.user._id);
    }

    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student, Role.Instructor)
    @Post('group/message')
    async addMessageToGroup(
      @Body() addGroupMessageDto: AddGroupChatMessageDto,
      @Req() req: any,
    ): Promise<any> {
      return this.chatsService.addMessageToGroup(addGroupMessageDto, req.user._id);
    }
    
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student, Role.Instructor)
    @Get('group/:groupId')
    async getGroupChatHistory(@Param('groupId') groupId: string) {
      return this.chatsService.getGroupChatHistory(groupId);
    }
    
  }
  