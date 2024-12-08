
import mongoose from "mongoose";
export class CreateNoteDto {

  courseId?:  mongoose.Types.ObjectId;

  content: string; 
}
