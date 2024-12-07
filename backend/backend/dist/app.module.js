"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const modules_module_1 = require("./modules/modules.module");
const auth_module_1 = require("./auth/auth.module");
const notes_module_1 = require("./notes/notes.module");
const progress_module_1 = require("./progress/progress.module");
const quizzes_module_1 = require("./quizzes/quizzes.module");
const responses_module_1 = require("./responses/responses.module");
const mongoose_1 = require("@nestjs/mongoose");
const chats_module_1 = require("./chats/chats.module");
const forums_module_1 = require("./forums/forums.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, courses_module_1.CoursesModule, modules_module_1.ModulesModule, auth_module_1.AuthModule, notes_module_1.NotesModule,
            progress_module_1.ProgressModule, quizzes_module_1.QuizzesModule, responses_module_1.ResponsesModule, mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/elearningweb'), chats_module_1.ChatsModule, forums_module_1.ForumsModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map