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
exports.QuizzesController = void 0;
const common_1 = require("@nestjs/common");
const authentication_guard_1 = require("../auth/guards/authentication.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_decorator_2 = require("../auth/decorators/roles.decorator");
const authorization_guard_1 = require("../auth/guards/authorization.guard");
const quizzes_service_1 = require("./quizzes.service");
const CreateQuizDto_1 = require("./dto/CreateQuizDto");
const CreateQuestionDto_1 = require("./dto/CreateQuestionDto");
let QuizzesController = class QuizzesController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    async createQuestion(createQuestionDto) {
        return this.quizService.createQuestion(createQuestionDto);
    }
    async createQuiz(createQuizDto) {
        return this.quizService.createQuiz(createQuizDto);
    }
};
exports.QuizzesController = QuizzesController;
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Student, roles_decorator_2.Role.Instructor),
    (0, common_1.Post)('questions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateQuestionDto_1.CreateQuestionDto]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Instructor),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateQuizDto_1.CreateQuizDto]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "createQuiz", null);
exports.QuizzesController = QuizzesController = __decorate([
    (0, common_1.Controller)('quizzes'),
    __metadata("design:paramtypes", [quizzes_service_1.QuizzesService])
], QuizzesController);
//# sourceMappingURL=quizzes.controller.js.map