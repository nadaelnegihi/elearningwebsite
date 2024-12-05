"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsesModule = void 0;
const common_1 = require("@nestjs/common");
const responses_service_1 = require("./responses.service");
const responses_controller_1 = require("./responses.controller");
const mongoose_1 = require("@nestjs/mongoose");
const responses_schema_1 = require("./models/responses.schema");
const users_module_1 = require("../users/users.module");
const quizzes_module_1 = require("../quizzes/quizzes.module");
let ResponsesModule = class ResponsesModule {
};
exports.ResponsesModule = ResponsesModule;
exports.ResponsesModule = ResponsesModule = __decorate([
    (0, common_1.Module)({
        imports: [quizzes_module_1.QuizzesModule, users_module_1.UsersModule, mongoose_1.MongooseModule.forFeature([{ name: 'Response', schema: responses_schema_1.ResponsesSchema }])],
        providers: [responses_service_1.ResponsesService],
        controllers: [responses_controller_1.ResponsesController],
        exports: [responses_service_1.ResponsesService, mongoose_1.MongooseModule]
    })
], ResponsesModule);
//# sourceMappingURL=responses.module.js.map