import mongoose, { Model } from 'mongoose';
import { ProgressDocument } from './models/progress.schema';
import { ModuleDocument } from 'src/modules/models/modules.schema';
export declare class ProgressService {
    private readonly progressModel;
    private readonly moduleModel;
    constructor(progressModel: Model<ProgressDocument>, moduleModel: Model<ModuleDocument>);
    getCourseCompletionRate(courseId: mongoose.Types.ObjectId, studentId: mongoose.Types.ObjectId): Promise<{
        courseId: mongoose.Types.ObjectId;
        completionRate: number;
    }>;
}
