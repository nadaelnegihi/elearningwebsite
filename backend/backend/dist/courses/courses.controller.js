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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const authentication_guard_1 = require("../auth/guards/authentication.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_decorator_2 = require("../auth/decorators/roles.decorator");
const authorization_guard_1 = require("../auth/guards/authorization.guard");
const CreateCourseDto_1 = require("./dto/CreateCourseDto");
const UpdateCourseDto_1 = require("./dto/UpdateCourseDto");
const mongoose_1 = require("mongoose");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async createCourse(createCourseDto, req) {
        const instructorname = req.user.name;
        return this.coursesService.createCourse(createCourseDto, instructorname);
    }
    async getCourses() {
        return this.coursesService.getAllCourses();
    }
    async getCourse(courseId) {
        return this.coursesService.getCourseById(courseId);
    }
    async updateCourse(courseId, updateCourseDto) {
        return this.coursesService.updateCourse(courseId, updateCourseDto);
    }
    async deleteCourse(courseId) {
        await this.coursesService.deleteCourse(courseId);
        return { message: 'Course deleted successfully' };
    }
    async searchCourses(title, category, created_by) {
        return this.coursesService.searchCourses({ title, category, created_by });
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_2.Roles)(roles_decorator_1.Role.Instructor),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCourseDto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_2.Roles)(roles_decorator_1.Role.Student, roles_decorator_1.Role.Instructor),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourses", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_2.Roles)(roles_decorator_1.Role.Student, roles_decorator_1.Role.Instructor),
    (0, common_1.Get)(':courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Schema.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourse", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_2.Roles)(roles_decorator_1.Role.Instructor),
    (0, common_1.Put)(':courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Schema.Types.ObjectId, UpdateCourseDto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_2.Roles)(roles_decorator_1.Role.Instructor),
    (0, common_1.Delete)('delete/:courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Schema.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard, authorization_guard_1.authorizationGuard),
    (0, roles_decorator_2.Roles)(roles_decorator_1.Role.Student, roles_decorator_1.Role.Instructor),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('title')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('created_by')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "searchCourses", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map