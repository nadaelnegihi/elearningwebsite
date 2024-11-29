import mongoose from "mongoose";
export declare class CreateModuleDto {
    courseId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    resources: {
        contentType: string;
        resource: string;
    }[];
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
}
