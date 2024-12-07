"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumsModule = void 0;
const common_1 = require("@nestjs/common");
const forums_service_1 = require("./forums.service");
const forums_controller_1 = require("./forums.controller");
const mongoose_1 = require("@nestjs/mongoose");
const users_module_1 = require("../users/users.module");
const forums_schema_1 = require("./models/forums.schema");
const comments_schema_1 = require("./models/comments.schema");
const threads_schema_1 = require("./models/threads.schema");
const replies_schema_1 = require("./models/replies.schema");
let ForumsModule = class ForumsModule {
};
exports.ForumsModule = ForumsModule;
exports.ForumsModule = ForumsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([
                { name: 'ForumPost', schema: forums_schema_1.ForumPostSchema },
                { name: 'Comment', schema: comments_schema_1.CommentSchema },
                { name: threads_schema_1.Thread.name, schema: threads_schema_1.ThreadSchema },
                { name: replies_schema_1.Reply.name, schema: replies_schema_1.ReplySchema },
            ]),
        ],
        providers: [forums_service_1.ForumService],
        controllers: [forums_controller_1.ForumController],
        exports: [mongoose_1.MongooseModule],
    })
], ForumsModule);
//# sourceMappingURL=forums.module.js.map