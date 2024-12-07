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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chats_schema_1 = require("./models/chats.schema");
let ChatsService = class ChatsService {
    constructor(chatModel) {
        this.chatModel = chatModel;
    }
    async createChatMessage(createChatDto, senderId) {
        const newMessage = new this.chatModel({
            ...createChatDto,
            sender: senderId,
            createdAt: new Date(),
        });
        const savedMessage = await newMessage.save();
        return savedMessage;
    }
    async getChatHistory(conversationId) {
        const messages = await this.chatModel.find({ conversationId }).exec();
        if (!messages) {
            throw new common_1.NotFoundException('Chat history not found');
        }
        return messages;
    }
    async ActiveChatMessage(messageId) {
        const updatedMessage = await this.chatModel.findByIdAndUpdate(messageId, { isActive: false }, { new: true });
        if (!updatedMessage) {
            throw new common_1.NotFoundException('Chat message not found');
        }
        return { message: 'Chat message marked as inactive successfully' };
    }
    async createGroup(createGroupDto, creatorId) {
        const groupChat = new this.chatModel({
            ...createGroupDto,
            isGroupChat: true,
            sender: creatorId,
        });
        return groupChat.save();
    }
    async addMessageToGroup(addGroupMessageDto, senderId) {
        const { message, groupId } = addGroupMessageDto;
        const group = await this.chatModel.findById(groupId).exec();
        if (!group || !group.isGroupChat) {
            throw new common_1.NotFoundException('Group not found');
        }
        const newMessage = new this.chatModel({
            message,
            sender: senderId,
            conversationId: groupId,
            isGroupChat: true,
        });
        return newMessage.save();
    }
    async getGroupChatHistory(groupId) {
        return this.chatModel.find({ conversationId: groupId, isGroupChat: true }).exec();
    }
    notifyClients(server, message, conversationId) {
        server.to(conversationId).emit('newMessage', message);
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chats_schema_1.ChatMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model])
], ChatsService);
//# sourceMappingURL=chats.service.js.map