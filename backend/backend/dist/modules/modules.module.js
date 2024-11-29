"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesModule = void 0;
const common_1 = require("@nestjs/common");
const modules_service_1 = require("./modules.service");
const modules_controller_1 = require("./modules.controller");
const mongoose_1 = require("@nestjs/mongoose");
const modules_schema_1 = require("./models/modules.schema");
const platform_express_1 = require("@nestjs/platform-express");
const courses_module_1 = require("../courses/courses.module");
const users_module_1 = require("../users/users.module");
let ModulesModule = class ModulesModule {
};
exports.ModulesModule = ModulesModule;
exports.ModulesModule = ModulesModule = __decorate([
    (0, common_1.Module)({
        imports: [courses_module_1.CoursesModule, users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Module', schema: modules_schema_1.ModulesSchema }]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        providers: [modules_service_1.ModulesService],
        controllers: [modules_controller_1.ModulesController],
        exports: [modules_service_1.ModulesService, mongoose_1.MongooseModule]
    })
], ModulesModule);
//# sourceMappingURL=modules.module.js.map