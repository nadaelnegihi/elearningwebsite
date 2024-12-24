import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumPost, ForumPostDocument } from './models/forums.schema';
import { User, UserDocument } from 'src/users/models/users.schema';
import { Thread, ThreadDocument } from './models/threads.schema';
import { CreateForumPostDto } from './dto/CreateForumPost.dto';
import { UpdateForumPostDto } from './dto/UpdateForumPost.dto';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { UpdateCommentDto } from './dto/UpdateComment.dto';
import { CreateThreadDto } from './dto/CreateThread.dto';
import { CreateReplyDto } from './dto/Reply.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(ForumPost.name) private forumPostModel: Model<ForumPostDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
  ) {}

  async createPost(createForumPostDto: CreateForumPostDto): Promise<ForumPost> {
    const newPost = new this.forumPostModel(createForumPostDto);
    return newPost.save();
  }

  async getAllPosts(): Promise<ForumPost[]> {
    return this.forumPostModel.find().exec();
  }

  async getPostById(id: string): Promise<ForumPost> {
    const post = await this.forumPostModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Forum post not found');
    }
    return post;
  }

  async updatePost(id: string, updateForumPostDto: UpdateForumPostDto): Promise<ForumPost> {
    const updatedPost = await this.forumPostModel.findByIdAndUpdate(id, updateForumPostDto, { new: true }).exec();
    if (!updatedPost) {
      throw new NotFoundException('Forum post not found');
    }
    return updatedPost;
  }

  async ActiveForum(id: string): Promise<{ message: string }> {
    const updatedPost = await this.forumPostModel.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true }
    ).exec();

    if (!updatedPost) {
      throw new NotFoundException('Forum post not found');
    }

    return { message: 'Forum post marked as inactive successfully' };
  }

  async createComment(postId: string, createCommentDto: CreateCommentDto): Promise<ForumPost> {
    const post = await this.forumPostModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = { content: createCommentDto.content, timestamp: new Date() };
    post.comments.push(comment as any);

    try {
      return await post.save();
    } catch (error) {
      console.error("Error saving post with comment:", error);
      throw new InternalServerErrorException("Failed to save the comment");
    }
  }

  async getComments(postId: string): Promise<any[]> {
    const post = await this.forumPostModel.findById(postId, 'comments').exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post.comments;
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<any> {
    const updatedPost = await this.forumPostModel.findOneAndUpdate(
      { 'comments._id': commentId },
      { $set: { 'comments.$': { ...updateCommentDto, _id: commentId } } },
      { new: true }
    ).exec();

    if (!updatedPost) {
      throw new NotFoundException('Comment not found');
    }
    return updatedPost;
  }

  async deleteComment(commentId: string): Promise<{ message: string }> {
    const deletedComment = await this.forumPostModel.findOneAndUpdate(
      { 'comments._id': commentId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    ).exec();

    if (!deletedComment) {
      throw new NotFoundException('Comment not found');
    }
    return { message: 'Comment deleted successfully' };
  }

  async validateForumAccess(userId: string, courseId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).populate('studentCourses.course teachingCourses').exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'instructor' && user.teachingCourses?.some((id) => id.toString() === courseId)) {
      return true;
    }

    if (
      user.role === 'student' &&
      user.studentCourses?.some((course) => course.course.toString() === courseId && course.status === 'enrolled')
    ) {
      return true;
    }

    throw new NotFoundException('Access denied to this forum');
  }

  async getForumById(postId: string): Promise<ForumPost> {
    const post = await this.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createThread(createThreadDto: CreateThreadDto, userId: string): Promise<ThreadDocument> {
    const newThread = new this.threadModel({
      ...createThreadDto,
      createdBy: userId,
    });
    return newThread.save();
  }

  async addReply(createReplyDto: CreateReplyDto, userId: string): Promise<ThreadDocument> {
    const newReply = new this.threadModel({
      content: createReplyDto.content,
      createdBy: userId,
      threadId: createReplyDto.threadId,
    });

    const savedReply = await newReply.save();

    const updatedThread = await this.threadModel.findByIdAndUpdate(
      createReplyDto.threadId,
      { $push: { replies: savedReply._id } },
      { new: true }
    ).exec();

    if (!updatedThread) {
      throw new Error('Thread not found');
    }

    return updatedThread;
  }

  async searchThreads(query: string): Promise<ThreadDocument[]> {
    return this.threadModel
      .find({ title: { $regex: query, $options: 'i' } })
      .populate('createdBy', 'name')
      .exec();
  }
}
