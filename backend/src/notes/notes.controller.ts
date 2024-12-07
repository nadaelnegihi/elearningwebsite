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
      const userId = req.user.id; 
      return this.notesService.createNote(createNoteDto, userId);
    }
  
  
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Get()
    async getNotes(@Body('userId') userId: string) {
      return this.notesService.getNotesByUser(userId);
    }
  
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Put(':noteId')
    async editNote(
      @Param('noteId') noteId: string,
      @Body() updateNoteDto: UpdateNoteDto,
    ) {
      return this.notesService.editNote(noteId, updateNoteDto);
    }
  
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Delete(':noteId')
    async deleteNote(
      @Param('noteId') noteId: string,
    ) {
      return this.notesService.deleteNote(noteId);
    }
  }
  