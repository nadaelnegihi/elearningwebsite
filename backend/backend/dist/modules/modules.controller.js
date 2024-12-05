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
exports.ModulesController = void 0;
const common_1 = require("@nestjs/common");
const modules_service_1 = require("./modules.service");
const CreateModuleDto_1 = require("./dto/CreateModuleDto");
const authentication_guard_1 = require("../auth/guards/authentication.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_decorator_2 = require("../auth/decorators/roles.decorator");
const authorization_guard_1 = require("../auth/guards/authorization.guard");
const platform_express_1 = require("@nestjs/platform-express");
const mongoose_1 = require("mongoose");
const UpdateModuleDto_1 = require("./dto/UpdateModuleDto");
let ModulesController = class ModulesController {
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    async createModule(createModuleDto) {
        return this.modulesService.createModule(createModuleDto);
    }
    async uploadMedia(moduleId, file, contentType, title) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        const validContentTypes = ['video', 'pdf', 'image'];
        if (!validContentTypes.includes(contentType)) {
            throw new Error('Invalid content type');
        }
        if (!title) {
            throw new Error('Title is required for the resource');
        }
        const updatedModule = await this.modulesService.addMediaToModule(moduleId, file.path, contentType, title);
        return {
            message: 'File uploaded successfully',
            module: updatedModule,
        };
    }
    async downloadResource(moduleId, resourceId, req, res) {
        const studentId = req.user._id;
        await this.modulesService.markResourceAsComplete(resourceId, studentId);
        const filePath = await this.modulesService.getResourcePath(resourceId);
        if (!filePath) {
            res.status(404).send({ message: 'Resource not found.' });
            return;
        }
        res.download(filePath, (err) => {
            if (err) {
                res.status(500).send({ message: 'Error downloading the file.' });
            }
        });
    }
    async getModulesForStudents(courseId, req) {
        const studentId = req.user._id;
        return this.modulesService.getModulesForStudents(courseId, studentId);
    }
    async getModulesForInstructors(courseId) {
        return this.modulesService.getModulesForInstructors(courseId);
    }
    async updateModule(moduleId, updateModuleDto) {
        return this.modulesService.updateModule(moduleId, updateModuleDto);
    }
    async getModuleById(moduleId) {
        return this.modulesService.getModuleById(moduleId);
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Instructor),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateModuleDto_1.CreateModuleDto]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "createModule", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Instructor),
    (0, common_1.Post)('upload/:moduleId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('contentType')),
    __param(3, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId, Object, String, String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "uploadMedia", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    (0, common_1.Get)(':moduleId/resources/:resourceId/download'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('resourceId')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Schema.Types.ObjectId, mongoose_1.default.Schema.Types.ObjectId, Object, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "downloadResource", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    (0, common_1.Get)('course/:courseId/student'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Schema.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "getModulesForStudents", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Instructor),
    (0, common_1.Get)('course/:courseId/instructor'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Schema.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "getModulesForInstructors", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Instructor),
    (0, common_1.Put)('update/:moduleId'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId, UpdateModuleDto_1.UpdateModuleDto]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "updateModule", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    (0, common_1.Get)(':moduleId'),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "getModuleById", null);
exports.ModulesController = ModulesController = __decorate([
    (0, common_1.Controller)('modules'),
    __metadata("design:paramtypes", [modules_service_1.ModulesService])
], ModulesController);
//# sourceMappingURL=modules.controller.js.map