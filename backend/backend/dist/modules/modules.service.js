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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const modules_schema_1 = require("./models/modules.schema");
const courses_schema_1 = require("../courses/models/courses.schema");
const users_schema_1 = require("../users/models/users.schema");
let ModulesService = class ModulesService {
    constructor(moduleModel, courseModel, userModel) {
        this.moduleModel = moduleModel;
        this.courseModel = courseModel;
        this.userModel = userModel;
    }
    async createModule(createModuleDto) {
        const { courseId, ...moduleData } = createModuleDto;
        const newModule = new this.moduleModel(moduleData);
        const savedModule = await newModule.save();
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        course.modules.push(savedModule._id);
        await course.save();
        return savedModule;
    }
    async addMediaToModule(moduleid, filePath, contentType) {
        const module = await this.moduleModel.findById(moduleid);
        if (!module) {
            throw new Error('Module not found');
        }
        module.resources.push({
            contentType: contentType,
            resource: filePath,
        });
        await module.save();
        return module;
    }
    async getModulesForStudents(courseId, studentId) {
        const student = await this.userModel.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        const studentLevel = student.level;
        return this.moduleModel.find({
            courseId,
            isOutdated: false,
            difficulty_level: { $in: this.getAccessibleLevels(studentLevel) },
        }).exec();
    }
    getAccessibleLevels(level) {
        switch (level) {
            case 'Beginner':
                return ['Beginner', 'Intermediate'];
            case 'Intermediate':
                return ['Beginner', 'Intermediate', 'Advanced'];
            case 'Advanced':
                return ['Beginner', 'Intermediate', 'Advanced'];
            default:
                return ['Beginner'];
        }
    }
    async getModulesForInstructors(courseId) {
        return this.moduleModel.find({ courseId }).exec();
    }
    async updateModule(moduleId, updateModuleDto) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new Error('Module not found');
        }
        module.isOutdated = true;
        await module.save();
        const newModule = new this.moduleModel({
            ...updateModuleDto,
            updatedAt: new Date(),
        });
        return newModule.save();
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(modules_schema_1.Module.name)),
    __param(1, (0, mongoose_1.InjectModel)(courses_schema_1.Course.name)),
    __param(2, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model])
], ModulesService);
//# sourceMappingURL=modules.service.js.map