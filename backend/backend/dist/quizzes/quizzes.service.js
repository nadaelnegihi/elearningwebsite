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
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const quizzes_schema_1 = require("./models/quizzes.schema");
const users_schema_1 = require("../users/models/users.schema");
const questionbank_schema_1 = require("./models/questionbank.schema");
let QuizzesService = class QuizzesService {
    constructor(questionModel, quizModel, userModel) {
        this.questionModel = questionModel;
        this.quizModel = quizModel;
        this.userModel = userModel;
    }
    async createQuestion(createQuestionDto) {
        const newQuestion = new this.questionModel(createQuestionDto);
        return newQuestion.save();
    }
    async createQuiz(createQuizDto) {
        const { moduleId, numQuestions, questionTypes, createdBy, studentId } = createQuizDto;
        const quiz = new this.quizModel({
            moduleId,
            numQuestions,
            questionTypes,
            createdBy,
            questions: [],
        });
        await quiz.save();
        const updatedQuiz = await this.generateQuestions(studentId, quiz.quizId);
        return updatedQuiz;
    }
    async generateQuestions(studentId, quizId) {
        const student = await this.userModel.findById(studentId);
        if (!student || student.role !== 'student') {
            throw new common_1.NotFoundException('Student not found');
        }
        const quiz = await this.quizModel.findById(quizId);
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found');
        }
        const { level } = student;
        const difficulty = this.mapPerformanceToDifficulty(level);
        const questions = await this.questionModel.aggregate([
            { $match: { moduleId: quiz.moduleId, questionTypes: { $in: quiz.questionTypes }, difficulty: { $in: difficulty } } },
            { $sample: { size: quiz.numberOfQuestions } },
        ]);
        quiz.questions = questions.map((q) => q._id);
        await quiz.save();
        return quiz;
    }
    mapPerformanceToDifficulty(level) {
        switch (level) {
            case 'Below Average':
                return ['easy'];
            case 'Average':
                return ['easy', 'medium'];
            case 'Above Average':
                return ['medium', 'hard'];
            default:
                return ['medium'];
        }
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(questionbank_schema_1.Questionbank.name)),
    __param(1, (0, mongoose_1.InjectModel)(quizzes_schema_1.Quiz.name)),
    __param(2, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.Model,
        mongoose_2.Model])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map