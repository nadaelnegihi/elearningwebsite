import { Model } from 'mongoose';
import { ForumPost, ForumPostDocument } from './models/forums.schema';
import { Comment, CommentDocument } from './models/comments.schema';
import { UserDocument } from 'src/users/models/users.schema';
import { ThreadDocument } from './models/threads.schema';
import { ReplyDocument } from './models/replies.schema';
import { CreateForumPostDto } from './dto/CreateForumPost.dto';
import { UpdateForumPostDto } from './dto/UpdateForumPost.dto';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { UpdateCommentDto } from './dto/UpdateComment.dto';
import { CreateThreadDto } from './dto/CreateThread.dto';
import { CreateReplyDto } from './dto/Reply.dto';
export declare class ForumService {
    private forumPostModel;
    private commentModel;
    private userModel;
    private threadModel;
    private replyModel;
    constructor(forumPostModel: Model<ForumPostDocument>, commentModel: Model<CommentDocument>, userModel: Model<UserDocument>, threadModel: Model<ThreadDocument>, replyModel: Model<ReplyDocument>);
    createPost(createForumPostDto: CreateForumPostDto): Promise<ForumPost>;
    getAllPosts(): Promise<ForumPost[]>;
    getPostById(id: string): Promise<ForumPost>;
    updatePost(id: string, updateForumPostDto: UpdateForumPostDto): Promise<ForumPost>;
    ActiveForum(id: string): Promise<{
        message: string;
    }>;
    createComment(postId: string, createCommentDto: CreateCommentDto): Promise<Comment>;
    getComments(postId: string): Promise<Comment[]>;
    updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<Comment>;
    deleteComment(commentId: string): Promise<{
        message: string;
    }>;
    validateForumAccess(userId: string, courseId: string): Promise<boolean>;
    getForumById(forumId: string): Promise<import("mongoose").Document<unknown, {}, ForumPostDocument> & ForumPost & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createThread(createThreadDto: CreateThreadDto, userId: string): Promise<ThreadDocument>;
    addReply(createReplyDto: CreateReplyDto, userId: string): Promise<ReplyDocument>;
    searchThreads(query: string): Promise<ThreadDocument[]>;
}
