import mongoose from 'mongoose';
import { Module, ModuleDocument } from './models/modules.schema';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { Course } from '../courses/models/courses.schema';
import { User } from 'src/users/models/users.schema';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
export declare class ModulesService {
    private moduleModel;
    private courseModel;
    private userModel;
    constructor(moduleModel: mongoose.Model<Module>, courseModel: mongoose.Model<Course>, userModel: mongoose.Model<User>);
    createModule(createModuleDto: CreateModuleDto): Promise<ModuleDocument>;
    addMediaToModule(moduleid: mongoose.Schema.Types.ObjectId, filePath: string, contentType: string): Promise<ModuleDocument>;
    getModulesForStudents(courseId: mongoose.Schema.Types.ObjectId, studentId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]>;
    private getAccessibleLevels;
    getModulesForInstructors(courseId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]>;
    updateModule(moduleId: mongoose.Schema.Types.ObjectId, updateModuleDto: UpdateModuleDto): Promise<ModuleDocument>;
}
