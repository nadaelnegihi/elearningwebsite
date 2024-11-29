"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressModule = void 0;
const common_1 = require("@nestjs/common");
const progress_service_1 = require("./progress.service");
const progress_controller_1 = require("./progress.controller");
const mongoose_1 = require("@nestjs/mongoose");
const progress_schema_1 = require("./models/progress.schema");
let ProgressModule = class ProgressModule {
};
exports.ProgressModule = ProgressModule;
exports.ProgressModule = ProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Progress', schema: progress_schema_1.ProgressSchema }])],
        providers: [progress_service_1.ProgressService],
        controllers: [progress_controller_1.ProgressController],
        exports: [progress_service_1.ProgressService, mongoose_1.MongooseModule]
    })
], ProgressModule);
//# sourceMappingURL=progress.module.js.map