import { Controller, Get,Post,Req,Put, Param, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Module, ModuleDocument } from './models/modules.schema';
import { diskStorage } from 'multer';
import mongoose from 'mongoose';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
@Controller('modules')
export class ModulesController {
  constructor(private  modulesService: ModulesService) {}

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Instructor) // Only instructors can add modules
  @Post()
  async createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.createModule(createModuleDto);
  }

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Instructor)
  @Post('upload/:moduleid')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('moduleid') moduleid: mongoose.Schema.Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Body('contentType') contentType: string, 
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
  
    const updatedModule = await this.modulesService.addMediaToModule(
      moduleid,
      file.path, 
      contentType,
    );
  
    return {
      message: 'File uploaded successfully',
      module: updatedModule,
    };
  }

  @UseGuards(AuthGuard)
  @Get('course/:courseId/student')  // Removed studentId from URL
  async getModulesForStudents(
    @Param('courseId') courseId: mongoose.Schema.Types.ObjectId,
    @Req() req: any,  // Access the request object
  ): Promise<ModuleDocument[]> {
    const studentId = req.user._id; 
     // Retrieve the studentId from the authenticated user
    return this.modulesService.getModulesForStudents(courseId, studentId);
  }

  // Endpoint for instructors to get all modules, including outdated ones
  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Instructor)
  @Get('course/:courseId/instructor')
  async getModulesForInstructors(
    @Param('courseId') courseId: mongoose.Schema.Types.ObjectId,
  ): Promise<ModuleDocument[]> {
    return this.modulesService.getModulesForInstructors(courseId);
  }


@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor)
@Put('update/:moduleId')
async updateModule(
  @Param('moduleId') moduleId: mongoose.Schema.Types.ObjectId,
  @Body() updateModuleDto: UpdateModuleDto,
): Promise<ModuleDocument> {
  return this.modulesService.updateModule(moduleId, updateModuleDto);
}

    }

