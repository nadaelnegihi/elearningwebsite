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
exports.ChatsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chats_service_1 = require("./chats.service");
const CreateChatDto_1 = require("./dto/CreateChatDto");
const AddGroupChatMessage_dto_1 = require("./dto/AddGroupChatMessage.dto");
let ChatsGateway = class ChatsGateway {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    async handleMessage(createChatDto, client) {
        const message = await this.chatsService.createChatMessage(createChatDto, client.id);
        this.server.to(createChatDto.conversationId).emit('newMessage', message);
    }
    handleJoinRoom(conversationId, client) {
        client.join(conversationId);
        this.server.to(conversationId).emit('userJoined', { userId: client.id });
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleSendGroupMessage(payload, client) {
        const message = await this.chatsService.addMessageToGroup(payload, client.id);
        this.server.to(payload.groupId).emit('newGroupMessage', message);
    }
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateChatDto_1.CreateChatDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatsGateway.prototype, "handleJoinRoom", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatsGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendGroupMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddGroupChatMessage_dto_1.AddGroupChatMessageDto, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleSendGroupMessage", null);
exports.ChatsGateway = ChatsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map