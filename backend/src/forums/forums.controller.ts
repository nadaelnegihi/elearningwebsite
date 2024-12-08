import { Body, Controller, Post, Get, Put, Delete, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ForumService } from './forums.service';
import { CreateForumPostDto } from './dto/CreateForumPost.dto';
import { UpdateForumPostDto } from './dto/UpdateForumPost.dto';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { UpdateCommentDto } from './dto/UpdateComment.dto';
import { CreateThreadDto } from './dto/CreateThread.dto';
import { CreateReplyDto } from './dto/Reply.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student, Role.Instructor)
  @Post()
  async createPost(@Body() createForumPostDto: CreateForumPostDto) {
    return this.forumService.createPost(createForumPostDto);
  }

  @Get()
  async getAllPosts() {
    return this.forumService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.forumService.getPostById(id);
  }

  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() updateForumPostDto: UpdateForumPostDto) {
    return this.forumService.updatePost(id, updateForumPostDto);
  }

  @Post(':postId/comments')
  async createComment(@Param('postId') postId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.forumService.createComment(postId, createCommentDto);
  }

  @Get(':postId/comments')
  async getComments(@Param('postId') postId: string) {
    return this.forumService.getComments(postId);
  }

  @Put('comments/:commentId')
  async updateComment(@Param('commentId') commentId: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.forumService.updateComment(commentId, updateCommentDto);
  }

  @Get(':courseId/:forumId')
  async getForum(@Param('courseId') courseId: string, @Param('forumId') forumId: string, @Req() req: any) {
    const userId = req.user.id;
    
    // Validate access
    await this.forumService.validateForumAccess(userId, courseId);

    // Fetch forum details
    return this.forumService.getForumById(forumId);
  }

  @Post('threads')
  async createThread(@Body() createThreadDto: CreateThreadDto, @Req() req: any) {
    const userId = req.user.id;
    return this.forumService.createThread(createThreadDto, userId);
  }

  @Post('threads/:threadId/replies')
  async addReply(@Param('threadId') threadId: string, @Body() createReplyDto: CreateReplyDto, @Req() req: any) {
    const userId = req.user.id;
    return this.forumService.addReply({ ...createReplyDto, threadId }, userId);
  }

  @Get('threads/search')
  async searchThreads(@Query('query') query: string) {
    return this.forumService.searchThreads(query);
  }
}

