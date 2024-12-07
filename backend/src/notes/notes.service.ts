import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Note, NoteDocument } from './models/notes.schema';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { UpdateNoteDto } from './dto/UpdateNoteDto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  // Create a note
  async createNote(createNoteDto: CreateNoteDto,userId: string): Promise<Note> {
    const {courseId, content } = createNoteDto;

    const newNote = new this.noteModel({
      noteId: new mongoose.Types.ObjectId(),
      userId,
      courseId,
      content,
    });

    return newNote.save();
  }

  // Retrieve notes by user
  async getNotesByUser(userId: string): Promise<Note[]> {
    return this.noteModel.find({ userId }).exec();
  }

  // Edit a note
  async editNote(noteId: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const { content } = updateNoteDto;

    const note = await this.noteModel.findOneAndUpdate(
      { noteId },
      { content, lastUpdated: new Date() },
      { new: true },
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    const result = await this.noteModel.deleteOne({ noteId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Note not found');
    }
  }
}
