import { ForumService } from './forums.service';
import { CreateForumPostDto } from './dto/CreateForumPost.dto';
import { UpdateForumPostDto } from './dto/UpdateForumPost.dto';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { UpdateCommentDto } from './dto/UpdateComment.dto';
import { CreateThreadDto } from './dto/CreateThread.dto';
import { CreateReplyDto } from './dto/Reply.dto';
export declare class ForumController {
    private readonly forumService;
    constructor(forumService: ForumService);
    createPost(createForumPostDto: CreateForumPostDto): Promise<import("./models/forums.schema").ForumPost>;
    getAllPosts(): Promise<import("./models/forums.schema").ForumPost[]>;
    getPostById(id: string): Promise<import("./models/forums.schema").ForumPost>;
    updatePost(id: string, updateForumPostDto: UpdateForumPostDto): Promise<import("./models/forums.schema").ForumPost>;
    deletePost(id: string): Promise<{
        message: string;
    }>;
    createComment(postId: string, createCommentDto: CreateCommentDto): Promise<import("./models/comments.schema").Comment>;
    getComments(postId: string): Promise<import("./models/comments.schema").Comment[]>;
    updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<import("./models/comments.schema").Comment>;
    deleteComment(commentId: string): Promise<{
        message: string;
    }>;
    getForum(courseId: string, forumId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./models/forums.schema").ForumPostDocument> & import("./models/forums.schema").ForumPost & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createThread(createThreadDto: CreateThreadDto, req: any): Promise<import("./models/threads.schema").ThreadDocument>;
    addReply(threadId: string, createReplyDto: CreateReplyDto, req: any): Promise<import("./models/replies.schema").ReplyDocument>;
    searchThreads(query: string): Promise<import("./models/threads.schema").ThreadDocument[]>;
}
