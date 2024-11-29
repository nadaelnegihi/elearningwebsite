import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesSchema } from './models/notes.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'Note',schema:NotesSchema}])],
  providers: [NotesService],
  controllers: [NotesController],
  exports:[NotesService,MongooseModule]
})
export class NotesModule {}
