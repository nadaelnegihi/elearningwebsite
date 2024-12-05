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
const resourses_schema_1 = require("./models/resourses.schema");
const courses_schema_1 = require("../courses/models/courses.schema");
const users_schema_1 = require("../users/models/users.schema");
const progress_schema_1 = require("../progress/models/progress.schema");
let ModulesService = class ModulesService {
    constructor(moduleModel, resourceModel, courseModel, userModel, progressModel) {
        this.moduleModel = moduleModel;
        this.resourceModel = resourceModel;
        this.courseModel = courseModel;
        this.userModel = userModel;
        this.progressModel = progressModel;
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
    async addMediaToModule(moduleId, filePath, contentType, title) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new Error('Module not found');
        }
        const newResource = new this.resourceModel({
            title,
            contentType,
            resourcePath: filePath,
            moduleId,
            completed: false,
        });
        const savedResource = await newResource.save();
        module.resources.push(savedResource._id);
        await module.save();
        return module;
    }
    async getResourcePath(resourceId) {
        const resource = await this.resourceModel.findById(resourceId).exec();
        if (!resource) {
            throw new Error('Resource not found.');
        }
        return resource.resourcePath;
    }
    async markResourceAsComplete(resourceId, studentId) {
        const resource = await this.resourceModel.findById(resourceId).exec();
        if (!resource) {
            throw new Error('Resource not found.');
        }
        if (!resource.completed) {
            resource.completed = true;
            await resource.save();
        }
        const progress = await this.progressModel.findOne({
            courseId: resource.moduleId,
            userId: studentId,
        });
        if (!progress) {
            const newProgress = new this.progressModel({
                courseId: resource.moduleId,
                userId: studentId,
                completedModules: [resourceId],
                completionPercentage: 0,
                lastAccessed: new Date(),
            });
            await newProgress.save();
        }
        else {
            if (!progress.completedModules.includes(resourceId)) {
                progress.completedModules.push(resourceId);
                const totalModules = await this.moduleModel.countDocuments({
                    courseId: progress.courseId,
                });
                progress.completionPercentage =
                    (progress.completedModules.length / totalModules) * 100;
                progress.lastAccessed = new Date();
                await progress.save();
            }
        }
    }
    async getModulesForStudents(courseId, studentId) {
        const student = await this.userModel.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        const studentLevel = student.level;
        const modules = await this.moduleModel
            .find({
            courseId,
            isOutdated: false,
            difficulty_level: { $in: this.getAccessibleLevels(studentLevel) },
        })
            .populate({
            path: 'resources',
            options: { sort: { date: 1 } },
        })
            .exec();
        return modules;
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
        const modules = await this.moduleModel
            .find({ courseId })
            .populate({
            path: 'resources',
            options: { sort: { date: 1 } },
        })
            .exec();
        return modules;
    }
    async updateModule(moduleId, updateModuleDto) {
        const module = await this.moduleModel
            .findById(moduleId)
            .populate('resources')
            .exec();
        if (!module) {
            throw new Error('Module not found');
        }
        const resourcesDetails = await this.resourceModel
            .find({ moduleId: moduleId })
            .exec();
        module.versions.push({
            title: module.title,
            content: module.content,
            resources: resourcesDetails.map(resource => ({
                contentType: resource.contentType,
                resource: resource.resourcePath,
                date: resource.createdAt,
            })),
            updatedAt: module.updatedAt || new Date(),
        });
        module.isOutdated = true;
        await module.save();
        const updatedModule = new this.moduleModel({
            ...module.toObject(),
            ...updateModuleDto,
            isOutdated: false,
            updatedAt: new Date(),
            _id: undefined,
            versions: module.versions,
            resources: module.resources.map(res => res._id),
        });
        return updatedModule.save();
    }
    async getModuleById(moduleId) {
        const module = await this.moduleModel
            .findById(moduleId)
            .populate({
            path: 'resources',
            options: { sort: { date: 1 } },
        })
            .exec();
        if (!module) {
            throw new Error('Module not found');
        }
        return module;
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(modules_schema_1.Module.name)),
    __param(1, (0, mongoose_1.InjectModel)(resourses_schema_1.Resource.name)),
    __param(2, (0, mongoose_1.InjectModel)(courses_schema_1.Course.name)),
    __param(3, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __param(4, (0, mongoose_1.InjectModel)(progress_schema_1.Progress.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model])
], ModulesService);
//# sourceMappingURL=modules.service.js.map