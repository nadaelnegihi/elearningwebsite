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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['student', 'instructor', 'admin'],
        default: 'admin',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Below Average', 'Average', 'Above Average'], default: 'Below Average', required: function () {
            return this.role === 'student';
        } }),
    __metadata("design:type", String)
], User.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ course: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Course' }, status: { type: String, enum: ['enrolled', 'completed'], default: 'enrolled' } }],
        required: function () {
            return this.role === 'student';
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "studentCourses", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Course' }],
        required: function () {
            return this.role === 'instructor';
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "teachingCourses", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Response' }],
        required: function () {
            return this.role === 'student';
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "quizResponses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], required: function () {
            return this.role === 'student';
        } }),
    __metadata("design:type", Array)
], User.prototype, "scores", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)()
], User);
exports.UsersSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=users.schema.js.map