import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { ModuleDocument } from './models/modules.schema';
import { Response } from 'express';
import mongoose from 'mongoose';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
export declare class ModulesController {
    private modulesService;
    constructor(modulesService: ModulesService);
    createModule(createModuleDto: CreateModuleDto): Promise<ModuleDocument>;
    uploadMedia(moduleId: mongoose.Types.ObjectId, file: Express.Multer.File, contentType: string, title: string): Promise<{
        message: string;
        module: ModuleDocument;
    }>;
    downloadResource(moduleId: mongoose.Schema.Types.ObjectId, resourceId: mongoose.Schema.Types.ObjectId, req: any, res: Response): Promise<void>;
    getModulesForStudents(courseId: mongoose.Schema.Types.ObjectId, req: any): Promise<ModuleDocument[]>;
    getModulesForInstructors(courseId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]>;
    updateModule(moduleId: mongoose.Types.ObjectId, updateModuleDto: UpdateModuleDto): Promise<ModuleDocument>;
    getModuleById(moduleId: mongoose.Types.ObjectId): Promise<ModuleDocument>;
}
