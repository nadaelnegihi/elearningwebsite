import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumPost, ForumPostDocument } from './models/forums.schema';
import { User, UserDocument, } from 'src/users/models/users.schema';
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
      { is_active: false },  // Set is_active to false
      { new: true }  // Return the updated document
    ).exec();
  
    if (!updatedPost) {
      throw new NotFoundException('Forum post not found');
    }
  
    return { message: 'Forum post marked as inactive successfully' };
  }
  

  // Comments Management
  async createComment(postId: string, createCommentDto: CreateCommentDto): Promise<ForumPost> {
    const post = await this.forumPostModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  
    // Add the comment to the comments array
    const comment = { content: createCommentDto.content, timestamp: new Date() };
    post.comments.push(comment as any); // Adjust based on the structure of `comments`
  
    return post.save(); // Save the updated post
  }
  
  async getComments(postId: string): Promise<any[]> {
    const post = await this.forumPostModel.findById(postId, 'comments').exec(); // Only fetch comments
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  
    return post.comments; // Return the comments array
  }
  

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<any> {
    const updatedPost = await this.forumPostModel.findOneAndUpdate(
      { 'comments._id': commentId }, // Locate the post containing the comment
      { $set: { 'comments.$': { ...updateCommentDto, _id: commentId } } }, // Update the matched comment
      { new: true }
    ).exec();
  
    if (!updatedPost) {
      throw new NotFoundException('Comment not found');
    }
  
    return updatedPost;
  }
  

  async deleteComment(commentId: string): Promise<{ message: string }> {
    const deletedComment = await this.forumPostModel.findByIdAndDelete(commentId).exec();
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

  async addReply(createReplyDto: CreateReplyDto, userId: string): Promise<ThreadDocument> {
    // Create a new reply
    const newReply = new this.threadModel({
      content: createReplyDto.content,
      createdBy: userId,
      threadId: createReplyDto.threadId,  
    });
  
    const savedReply = await newReply.save();
  
    const updatedThread = await this.threadModel.findByIdAndUpdate(
      createReplyDto.threadId, // Find the thread by threadId
      { $push: { replies: savedReply._id } }, // Push the new reply's ObjectId to the replies array
      { new: true } // Return the updated thread
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
