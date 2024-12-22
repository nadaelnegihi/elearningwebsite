
import mongoose from "mongoose";
export class CreateNoteDto {

  moduleId?:  mongoose.Types.ObjectId;

  content: string; 
}
