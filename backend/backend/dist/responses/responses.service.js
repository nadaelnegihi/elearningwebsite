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
exports.ResponsesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const responses_schema_1 = require("./models/responses.schema");
const questionbank_schema_1 = require("../quizzes/models/questionbank.schema");
const users_schema_1 = require("../users/models/users.schema");
let ResponsesService = class ResponsesService {
    constructor(ResponseModel, questionModel, userModel) {
        this.ResponseModel = ResponseModel;
        this.questionModel = questionModel;
        this.userModel = userModel;
    }
    async submitQuiz(submitQuizDto) {
        const { studentId, quizId, answers } = submitQuizDto;
        let score = 0;
        const feedback = [];
        for (const { questionId, selectedAnswer } of answers) {
            const question = await this.questionModel.findById(questionId);
            if (!question) {
                throw new common_1.NotFoundException(`Question with ID ${questionId} not found`);
            }
            if (question.correctAnswer === selectedAnswer) {
                score += 1;
                feedback.push(`Question ${questionId}: Correct`);
            }
            else {
                feedback.push(`Question ${questionId}: Incorrect. Review the module for this question's topic.`);
            }
        }
        const totalQuestions = answers.length;
        const percentage = (score / totalQuestions) * 100;
        const user = await this.userModel.findById(studentId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${studentId} not found`);
        }
        if (user.role === 'student') {
            user.scores.push(percentage);
            await user.save();
        }
        const passingScore = totalQuestions * 0.5;
        const advice = score >= passingScore
            ? 'Well done! Keep progressing.'
            : 'You did not pass. Please review the module content and try again.';
        return {
            percentage,
            feedback: `${feedback.join('\n')}\n\n${advice}`,
        };
    }
};
exports.ResponsesService = ResponsesService;
exports.ResponsesService = ResponsesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(responses_schema_1.Response.name)),
    __param(1, (0, mongoose_1.InjectModel)(questionbank_schema_1.Questionbank.name)),
    __param(2, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model])
], ResponsesService);
//# sourceMappingURL=responses.service.js.map