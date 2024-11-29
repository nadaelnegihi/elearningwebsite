import mongoose from "mongoose";

export class CreateModuleDto {
  courseId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    resources: { contentType: string; resource: string }[];
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  }