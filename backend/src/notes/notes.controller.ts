import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { NotesService } from './notes.service';
  import { CreateNoteDto } from './dto/CreateNoteDto';
  import { UpdateNoteDto } from './dto/UpdateNoteDto';
  import { AuthGuard } from 'src/auth/guards/authentication.guard';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  import { Role } from 'src/auth/decorators/roles.decorator';
  import mongoose from 'mongoose';
  
  @Controller('notes')
  export class NotesController {
    constructor(private readonly notesService: NotesService) {}
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Post()
    async createNote(
      @Body() createNoteDto: CreateNoteDto,
      @Req() req: any, 
    ) {
      const userId = req.user._id; // Ensure `_id` matches the decoded JWT payload
      console.log('Extracted userId:', userId); // Debug log to verify the user ID
      return this.notesService.createNote(createNoteDto, userId);
    }
    
  
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Get()
    async getNotes(@Req() req: any) {
      const userId = req.user._id; // Extract userId from the authenticated user
      console.log('Fetching notes for userId:', userId); // Debug log for userId
      return this.notesService.getNotesByUser(userId);
    }
    
  
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Put(':noteId')
    async editNote(
      @Param('noteId') noteId: mongoose.Types.ObjectId,
      @Body() updateNoteDto: UpdateNoteDto,
    ) {
      return this.notesService.editNote(noteId, updateNoteDto);
    }
  
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Delete(':noteId')
    async deleteNote(@Param('noteId') noteId: mongoose.Types.ObjectId) {
      await this.notesService.deleteNote(noteId);
      return { message: 'Note deleted successfully.' };
    }
    
  }
  