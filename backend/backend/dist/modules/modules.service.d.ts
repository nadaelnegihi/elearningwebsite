import mongoose from 'mongoose';
import { ModuleDocument } from './models/modules.schema';
import { ResourceDocument } from './models/resourses.schema';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { CourseDocument } from '../courses/models/courses.schema';
import { UserDocument } from 'src/users/models/users.schema';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
import { ProgressDocument } from 'src/progress/models/progress.schema';
export declare class ModulesService {
    private moduleModel;
    private resourceModel;
    private courseModel;
    private userModel;
    private progressModel;
    constructor(moduleModel: mongoose.Model<ModuleDocument>, resourceModel: mongoose.Model<ResourceDocument>, courseModel: mongoose.Model<CourseDocument>, userModel: mongoose.Model<UserDocument>, progressModel: mongoose.Model<ProgressDocument>);
    createModule(createModuleDto: CreateModuleDto): Promise<ModuleDocument>;
    addMediaToModule(moduleId: mongoose.Types.ObjectId, filePath: string, contentType: string, title: string): Promise<ModuleDocument>;
    getResourcePath(resourceId: mongoose.Schema.Types.ObjectId): Promise<string | null>;
    markResourceAsComplete(resourceId: mongoose.Schema.Types.ObjectId, studentId: mongoose.Types.ObjectId): Promise<void>;
    getModulesForStudents(courseId: mongoose.Schema.Types.ObjectId, studentId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]>;
    private getAccessibleLevels;
    getModulesForInstructors(courseId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]>;
    updateModule(moduleId: mongoose.Types.ObjectId, updateModuleDto: UpdateModuleDto): Promise<ModuleDocument>;
    getModuleById(moduleId: mongoose.Types.ObjectId): Promise<ModuleDocument>;
}
