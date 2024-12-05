import { ProgressService } from './progress.service';
import mongoose from 'mongoose';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getCourseCompletionRate(courseId: mongoose.Types.ObjectId, req: any): Promise<{
        courseId: mongoose.Types.ObjectId;
        completionRate: number;
    }>;
}
