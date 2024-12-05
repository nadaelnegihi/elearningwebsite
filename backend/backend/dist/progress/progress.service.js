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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const progress_schema_1 = require("./models/progress.schema");
const modules_schema_1 = require("../modules/models/modules.schema");
let ProgressService = class ProgressService {
    constructor(progressModel, moduleModel) {
        this.progressModel = progressModel;
        this.moduleModel = moduleModel;
    }
    async getCourseCompletionRate(courseId, studentId) {
        const progress = await this.progressModel
            .findOne({ courseId, userId: studentId })
            .populate('completedModules')
            .exec();
        if (!progress) {
            throw new Error('Progress record not found for this student and course.');
        }
        const totalModules = await this.moduleModel.countDocuments({ courseId });
        if (totalModules === 0) {
            throw new Error('No modules found for this course.');
        }
        const completionRate = (progress.completedModules.length / totalModules) * 100;
        return {
            courseId,
            completionRate: Math.round(completionRate * 100) / 100,
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(progress_schema_1.Progress.name)),
    __param(1, (0, mongoose_1.InjectModel)(modules_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProgressService);
//# sourceMappingURL=progress.service.js.map