import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { Module, ModuleDocument } from './models/modules.schema';
import mongoose from 'mongoose';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
export declare class ModulesController {
    private modulesService;
    constructor(modulesService: ModulesService);
    createModule(createModuleDto: CreateModuleDto): Promise<mongoose.Document<unknown, {}, Module> & Module & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    uploadMedia(moduleid: mongoose.Schema.Types.ObjectId, file: Express.Multer.File, contentType: string): Promise<{
        message: string;
        module: mongoose.Document<unknown, {}, Module> & Module & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    getModulesForStudents(courseId: mongoose.Schema.Types.ObjectId, req: any): Promise<ModuleDocument[]>;
    getModulesForInstructors(courseId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]>;
    updateModule(moduleId: mongoose.Schema.Types.ObjectId, updateModuleDto: UpdateModuleDto): Promise<ModuleDocument>;
}
