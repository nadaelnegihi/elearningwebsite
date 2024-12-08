  import {Body,Controller,Delete,Get,Param,Post,UseGuards,Req,} from '@nestjs/common';
  import { ChatsService } from './chats.service';
  import { CreateChatDto } from './dto/CreateChatDto';
  import { CreateGroupChatDto } from './dto/CreateGroupChat.dto';
  import { AddGroupChatMessageDto } from './dto/AddGroupChatMessage.dto';
  import { AuthGuard } from 'src/auth/guards/authentication.guard';
  import { authorizationGuard } from 'src/auth/guards/authorization.guard';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  import { Role } from 'src/auth/decorators/roles.decorator';
  
  @Controller('chats')
  export class ChatsController {
    constructor(private chatsService: ChatsService) {}
  
    @UseGuards(AuthGuard, authorizationGuard)
    @Roles(Role.Student, Role.Instructor)
    @Post()
    async createChatMessage(@Body() createChatDto: CreateChatDto, @Req() req: any) {
      const senderId = req.user.id; // Extract sender's ID from the request
      return this.chatsService.createChatMessage(createChatDto, senderId);
    }
  
    @Get(':conversationId')
    async getChatHistory(@Param('conversationId') conversationId: string) {
      return this.chatsService.getChatHistory(conversationId);
    }
  
    @Delete(':messageId')
    async deleteMessage(@Param('messageId') messageId: string) {
      return this.chatsService.ActiveChatMessage(messageId);
    }

    async createGroup(
      @Body() createGroupDto: CreateGroupChatDto,
      @Req() req: any,
    ): Promise<any> {
      return this.chatsService.createGroup(createGroupDto, req.user._id);
    }

    @Post('group/message')
    async addMessageToGroup(
      @Body() addGroupMessageDto: AddGroupChatMessageDto,
      @Req() req: any,
    ): Promise<any> {
      return this.chatsService.addMessageToGroup(addGroupMessageDto, req.user._id);
    }
    
    @Get('group/:groupId')
    async getGroupChatHistory(@Param('groupId') groupId: string) {
      return this.chatsService.getGroupChatHistory(groupId);
    }
    
  }
  