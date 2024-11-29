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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("./models/users.schema");
let UsersService = class UsersService {
    constructor(UserModel) {
        this.UserModel = UserModel;
    }
    async create(userData) {
        const newuser = new this.UserModel(userData);
        const user = await newuser.save();
        return user;
    }
    async findByName(username) {
        return await this.UserModel.findOne({ username });
    }
    async findByEmail(email) {
        const user = await this.UserModel.findOne({ email });
        return user;
    }
    async findById(id) {
        console.log(id);
        const user = await this.UserModel.findById(id);
        return user;
    }
    async updateUser(userId, updateUserDto) {
        return await this.UserModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
    }
    async getUserCourses(userId) {
        const user = await this.UserModel.findById(userId)
            .populate('studentCourses.course')
            .populate('teachingCourses')
            .exec();
        if (!user) {
            throw new Error('User not found');
        }
        if (user.role === 'student') {
            return {
                role: 'student',
                courses: user.studentCourses.map((courseStatus) => ({
                    course: courseStatus.course,
                    status: courseStatus.status,
                })),
            };
        }
        else if (user.role === 'instructor') {
            return {
                role: 'instructor',
                courses: user.teachingCourses,
            };
        }
        throw new Error('User role does not have courses.');
    }
    async searchStudents(query) {
        return this.UserModel.find({
            role: 'student',
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        }).exec();
    }
    async searchInstructors(query) {
        return this.UserModel.find({
            role: 'instructor',
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map