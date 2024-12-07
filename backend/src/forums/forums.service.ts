import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumPost, ForumPostDocument } from './models/forums.schema';
import { Comment, CommentDocument } from './models/comments.schema';
import { User, UserDocument, } from 'src/users/models/users.schema';
import { Thread, ThreadDocument } from './models/threads.schema';
import { Reply, ReplyDocument } from './models/replies.schema';
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
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
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
      { is_active: false },  // Set is_active to false
      { new: true }  // Return the updated document
    ).exec();
  
    if (!updatedPost) {
      throw new NotFoundException('Forum post not found');
    }
  
    return { message: 'Forum post marked as inactive successfully' };
  }
  

  // Comments Management
  async createComment(postId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const newComment = new this.commentModel({ ...createCommentDto, postId });
    return newComment.save();
  }

  async getComments(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId }).exec();
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, updateCommentDto, { new: true }).exec();
    if (!updatedComment) {
      throw new NotFoundException('Comment not found');
    }
    return updatedComment;
  }

  async deleteComment(commentId: string): Promise<{ message: string }> {
    const deletedComment = await this.commentModel.findByIdAndDelete(commentId).exec();
    if (!deletedComment) {
      throw new NotFoundException('Comment not found');
    }
    return { message: 'Comment deleted successfully' };
  }

  async validateForumAccess(userId: string, courseId: string): Promise<boolean> {
    // Fetch user details
    const user = await this.userModel.findById(userId).populate('studentCourses.course teachingCourses').exec();
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Check if the user is an instructor teaching the course
    if (user.role === 'instructor' && user.teachingCourses?.some((id) => id.toString() === courseId)) {
      return true;
    }
  
    // Check if the user is a student enrolled in the course
    if (
      user.role === 'student' &&
      user.studentCourses?.some((course) => course.course.toString() === courseId && course.status === 'enrolled')
    ) {
      return true;
    }
  
    // If none of the conditions are met, throw an exception
    throw new NotFoundException('Access denied to this forum');
  }

  async getForumById(forumId: string) {
    return this.forumPostModel.findById(forumId).populate('creator').exec(); // In order to get forum details as in to check if students are enrolled
  }

  async createThread(createThreadDto: CreateThreadDto, userId: string): Promise<ThreadDocument> {
    const newThread = new this.threadModel({
      ...createThreadDto,
      createdBy: userId,
    });
    return newThread.save();
  }

  async addReply(createReplyDto: CreateReplyDto, userId: string): Promise<ReplyDocument> {
    const reply = new this.replyModel({
      ...createReplyDto,
      createdBy: userId,
    });
    return reply.save();
  }

  async searchThreads(query: string): Promise<ThreadDocument[]> {
    return this.threadModel
      .find({ title: { $regex: query, $options: 'i' } })
      .populate('createdBy', 'name')
      .exec();
  }
  
}
