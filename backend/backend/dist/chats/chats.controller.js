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
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const CreateChatDto_1 = require("./dto/CreateChatDto");
const CreateGroupChat_dto_1 = require("./dto/CreateGroupChat.dto");
const authentication_guard_1 = require("../auth/guards/authentication.guard");
const authorization_guard_1 = require("../auth/guards/authorization.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_decorator_2 = require("../auth/decorators/roles.decorator");
let ChatsController = class ChatsController {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    async createChatMessage(createChatDto, req) {
        const senderId = req.user.id;
        return this.chatsService.createChatMessage(createChatDto, senderId);
    }
    async getChatHistory(conversationId) {
        return this.chatsService.getChatHistory(conversationId);
    }
    async deleteMessage(messageId) {
        return this.chatsService.ActiveChatMessage(messageId);
    }
    async createGroup(createGroupDto, req) {
        return this.chatsService.createGroup(createGroupDto, req.user._id);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Student, roles_decorator_2.Role.Instructor),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateChatDto_1.CreateChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "createChatMessage", null);
__decorate([
    (0, common_1.Get)(':conversationId'),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getChatHistory", null);
__decorate([
    (0, common_1.Delete)(':messageId'),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "deleteMessage", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGroupChat_dto_1.CreateGroupChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "createGroup", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map