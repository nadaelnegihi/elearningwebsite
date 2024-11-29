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
exports.CoursesService = void 0;
const courses_schema_1 = require("./models/courses.schema");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("../users/models/users.schema");
let CoursesService = class CoursesService {
    constructor(courseModel, userModel) {
        this.courseModel = courseModel;
        this.userModel = userModel;
    }
    async createCourse(createCourseDto, instructorName) {
        const newCourse = new this.courseModel({
            ...createCourseDto,
            created_by: instructorName,
        });
        const savedCourse = await newCourse.save();
        const courseId = savedCourse._id;
        const instructor = await this.userModel.findOne({ name: instructorName, role: 'instructor' });
        if (!instructor) {
            throw new Error('Instructor not found');
        }
        instructor.teachingCourses.push(courseId);
        await instructor.save();
        return savedCourse;
    }
    async getAllCourses() {
        return this.courseModel.find().exec();
    }
    async getCourseById(courseId) {
        const course = await this.courseModel
            .findById(courseId)
            .populate('modules')
            .exec();
        if (!course) {
            throw new Error('Course not found');
        }
        return course;
    }
    async updateCourse(courseId, updateCourseDto) {
        const updatedCourse = await this.courseModel.findByIdAndUpdate(courseId, { $set: updateCourseDto }, { new: true });
        if (!updatedCourse) {
            throw new Error('Course not found');
        }
        return updatedCourse;
    }
    async deleteCourse(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        await this.courseModel.findByIdAndDelete(courseId);
    }
    async searchCourses(query) {
        const searchConditions = {};
        if (query.title) {
            searchConditions['title'] = { $regex: query.title, $options: 'i' };
        }
        if (query.category) {
            searchConditions['category'] = { $regex: query.category, $options: 'i' };
        }
        if (query.created_by) {
            searchConditions['created_by'] = { $regex: query.created_by, $options: 'i' };
        }
        return this.courseModel.find(searchConditions).exec();
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(courses_schema_1.Course.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model])
], CoursesService);
//# sourceMappingURL=courses.service.js.map