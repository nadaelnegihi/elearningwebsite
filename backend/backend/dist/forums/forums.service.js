"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const forums_schema_1 = require("./models/forums.schema");
const comments_schema_1 = require("./models/comments.schema");
const threads_schema_1 = require("./models/threads.schema");
const replies_schema_1 = require("./models/replies.schema");
let ForumService = class ForumService {
    constructor(forumPostModel, commentModel, userModel, threadModel, replyModel) {
        this.forumPostModel = forumPostModel;
        this.commentModel = commentModel;
        this.userModel = userModel;
        this.threadModel = threadModel;
        this.replyModel = replyModel;
    }
    async createPost(createForumPostDto) {
        const newPost = new this.forumPostModel(createForumPostDto);
        return newPost.save();
    }
    async getAllPosts() {
        return this.forumPostModel.find().exec();
    }
    async getPostById(id) {
        const post = await this.forumPostModel.findById(id).exec();
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        return post;
    }
    async updatePost(id, updateForumPostDto) {
        const updatedPost = await this.forumPostModel.findByIdAndUpdate(id, updateForumPostDto, { new: true }).exec();
        if (!updatedPost) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        return updatedPost;
    }
    async ActiveForum(id) {
        const updatedPost = await this.forumPostModel.findByIdAndUpdate(id, { is_active: false }, { new: true }).exec();
        if (!updatedPost) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        return { message: 'Forum post marked as inactive successfully' };
    }
    async createComment(postId, createCommentDto) {
        const newComment = new this.commentModel({ ...createCommentDto, postId });
        return newComment.save();
    }
    async getComments(postId) {
        return this.commentModel.find({ postId }).exec();
    }
    async updateComment(commentId, updateCommentDto) {
        const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, updateCommentDto, { new: true }).exec();
        if (!updatedComment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return updatedComment;
    }
    async deleteComment(commentId) {
        const deletedComment = await this.commentModel.findByIdAndDelete(commentId).exec();
        if (!deletedComment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return { message: 'Comment deleted successfully' };
    }
    async validateForumAccess(userId, courseId) {
        const user = await this.userModel.findById(userId).populate('studentCourses.course teachingCourses').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === 'instructor' && user.teachingCourses?.some((id) => id.toString() === courseId)) {
            return true;
        }
        if (user.role === 'student' &&
            user.studentCourses?.some((course) => course.course.toString() === courseId && course.status === 'enrolled')) {
            return true;
        }
        throw new common_1.NotFoundException('Access denied to this forum');
    }
    async getForumById(forumId) {
        return this.forumPostModel.findById(forumId).populate('creator').exec();
    }
    async createThread(createThreadDto, userId) {
        const newThread = new this.threadModel({
            ...createThreadDto,
            createdBy: userId,
        });
        return newThread.save();
    }
    async addReply(createReplyDto, userId) {
        const reply = new this.replyModel({
            ...createReplyDto,
            createdBy: userId,
        });
        return reply.save();
    }
    async searchThreads(query) {
        return this.threadModel
            .find({ title: { $regex: query, $options: 'i' } })
            .populate('createdBy', 'name')
            .exec();
    }
};
exports.ForumService = ForumService;
exports.ForumService = ForumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(forums_schema_1.ForumPost.name)),
    __param(1, (0, mongoose_1.InjectModel)(comments_schema_1.Comment.name)),
    __param(2, (0, mongoose_1.InjectModel)('User')),
    __param(3, (0, mongoose_1.InjectModel)(threads_schema_1.Thread.name)),
    __param(4, (0, mongoose_1.InjectModel)(replies_schema_1.Reply.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ForumService);
//# sourceMappingURL=forums.service.js.map