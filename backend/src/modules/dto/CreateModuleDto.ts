import mongoose from "mongoose";

export class CreateModuleDto {
    courseId: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  }