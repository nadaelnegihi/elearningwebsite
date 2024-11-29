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
exports.ModulesSchema = exports.Module = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Module = class Module {
};
exports.Module = Module;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Module.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] }),
    __metadata("design:type", String)
], Module.prototype, "difficulty_level", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                contentType: { type: String, enum: ['video', 'pdf', 'image'], required: true },
                resource: { type: String, required: true },
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], Module.prototype, "resources", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Module.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: String,
                content: String,
                hierarchy: [{ contentType: String, resource: String }],
                updatedAt: { type: Date, default: Date.now },
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], Module.prototype, "versions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Module.prototype, "isOutdated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Quiz' }] }),
    __metadata("design:type", Array)
], Module.prototype, "quizzes", void 0);
exports.Module = Module = __decorate([
    (0, mongoose_1.Schema)()
], Module);
exports.ModulesSchema = mongoose_1.SchemaFactory.createForClass(Module);
//# sourceMappingURL=modules.schema.js.map