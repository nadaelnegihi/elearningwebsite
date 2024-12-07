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
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const forums_service_1 = require("./forums.service");
const CreateForumPost_dto_1 = require("./dto/CreateForumPost.dto");
const UpdateForumPost_dto_1 = require("./dto/UpdateForumPost.dto");
const CreateComment_dto_1 = require("./dto/CreateComment.dto");
const UpdateComment_dto_1 = require("./dto/UpdateComment.dto");
const CreateThread_dto_1 = require("./dto/CreateThread.dto");
const Reply_dto_1 = require("./dto/Reply.dto");
const authentication_guard_1 = require("../auth/guards/authentication.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_decorator_2 = require("../auth/decorators/roles.decorator");
const authorization_guard_1 = require("../auth/guards/authorization.guard");
let ForumController = class ForumController {
    constructor(forumService) {
        this.forumService = forumService;
    }
    async createPost(createForumPostDto) {
        return this.forumService.createPost(createForumPostDto);
    }
    async getAllPosts() {
        return this.forumService.getAllPosts();
    }
    async getPostById(id) {
        return this.forumService.getPostById(id);
    }
    async updatePost(id, updateForumPostDto) {
        return this.forumService.updatePost(id, updateForumPostDto);
    }
    async deletePost(id) {
        return this.forumService.ActiveForum(id);
    }
    async createComment(postId, createCommentDto) {
        return this.forumService.createComment(postId, createCommentDto);
    }
    async getComments(postId) {
        return this.forumService.getComments(postId);
    }
    async updateComment(commentId, updateCommentDto) {
        return this.forumService.updateComment(commentId, updateCommentDto);
    }
    async deleteComment(commentId) {
        return this.forumService.deleteComment(commentId);
    }
    async getForum(courseId, forumId, req) {
        const userId = req.user.id;
        await this.forumService.validateForumAccess(userId, courseId);
        return this.forumService.getForumById(forumId);
    }
    async createThread(createThreadDto, req) {
        const userId = req.user.id;
        return this.forumService.createThread(createThreadDto, userId);
    }
    async addReply(threadId, createReplyDto, req) {
        const userId = req.user.id;
        return this.forumService.addReply({ ...createReplyDto, threadId }, userId);
    }
    async searchThreads(query) {
        return this.forumService.searchThreads(query);
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Student, roles_decorator_2.Role.Instructor),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateForumPost_dto_1.CreateForumPostDto]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getAllPosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getPostById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateForumPost_dto_1.UpdateForumPostDto]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Post)(':postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateComment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)(':postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getComments", null);
__decorate([
    (0, common_1.Put)('comments/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateComment_dto_1.UpdateCommentDto]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)(':courseId/:forumId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('forumId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "getForum", null);
__decorate([
    (0, common_1.Post)('threads'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateThread_dto_1.CreateThreadDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "createThread", null);
__decorate([
    (0, common_1.Post)('threads/:threadId/replies'),
    __param(0, (0, common_1.Param)('threadId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Reply_dto_1.CreateReplyDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "addReply", null);
__decorate([
    (0, common_1.Get)('threads/search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "searchThreads", null);
exports.ForumController = ForumController = __decorate([
    (0, common_1.Controller)('forums'),
    __metadata("design:paramtypes", [forums_service_1.ForumService])
], ForumController);
//# sourceMappingURL=forums.controller.js.map