import { Controller, Get,Post,Req,Put,Res, Param, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Module, ModuleDocument } from './models/modules.schema';
import { diskStorage } from 'multer';
import { Response } from 'express';
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
  @Post('upload/:moduleId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('moduleId') moduleId: mongoose.Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Body('contentType') contentType: string,
    @Body('title') title: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
  
    // Validate content type
    const validContentTypes = ['video', 'pdf', 'image'];
    if (!validContentTypes.includes(contentType)) {
      throw new Error('Invalid content type');
    }
  
    if (!title) {
      throw new Error('Title is required for the resource');
    }
  
    // Process the uploaded file
    const updatedModule = await this.modulesService.addMediaToModule(
      moduleId,
      file.path, // Save the full file path (retaining original name and extension)
      contentType,
      title,
    );
  
    return {
      message: 'File uploaded successfully',
      module: updatedModule,
    };
  }
  
  @UseGuards(AuthGuard)
  @Roles(Role.Student)
  @Get(':moduleId/resources/:resourceId/download')
  async downloadResource(
    @Param('moduleId') moduleId: mongoose.Schema.Types.ObjectId,
    @Param('resourceId') resourceId: mongoose.Types.ObjectId,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const studentId = req.user._id;
  
    // Mark the resource as completed
    await this.modulesService.markResourceAsComplete(resourceId, studentId);
  
    // Get the file path for the resource
    const filePath = await this.modulesService.getResourcePath(resourceId);
  
    if (!filePath) {
      res.status(404).send({ message: 'Resource not found.' });
      return;
    }
  
    // Set headers to prompt file download
    res.setHeader('Content-Disposition', `attachment; filename=${filePath.split('/').pop()}`);
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send({ message: 'Error downloading the file.' });
      }
    });
  }
  


@UseGuards(AuthGuard)
@Roles(Role.Student)
@Get('course/:courseId/student') // Removed studentId from URL
async getModulesForStudents(
  @Param('courseId') courseId: mongoose.Schema.Types.ObjectId,
  @Req() req: any, // Access the request object
): Promise<ModuleDocument[]> {
  const studentId = req.user._id; // Retrieve the studentId from the authenticated user
  return this.modulesService.getModulesForStudents(courseId, studentId);
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor)
@Get('course/:courseId/instructor') // For instructors to get all modules, including outdated ones
async getModulesForInstructors(
  @Param('courseId') courseId: mongoose.Schema.Types.ObjectId,
): Promise<ModuleDocument[]> {
  return this.modulesService.getModulesForInstructors(courseId);
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor)
@Put('update/:moduleId')
async updateModule(
  @Param('moduleId') moduleId: mongoose.Types.ObjectId,
  @Body() updateModuleDto: UpdateModuleDto,
): Promise<ModuleDocument> {
  return this.modulesService.updateModule(moduleId, updateModuleDto);
}
@UseGuards(AuthGuard)
@Roles(Role.Instructor,Role.Student)
@Get(':moduleId')
async getModuleById(
  @Param('moduleId') moduleId: mongoose.Types.ObjectId,
): Promise<ModuleDocument> {
  return this.modulesService.getModuleById(moduleId);
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Student)
@Post(':moduleId/rate')
async rateModule(
  @Param('moduleId') moduleId: mongoose.Types.ObjectId,
  @Body('rating') rating: number,
): Promise<{ message: string }> {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  await this.modulesService.rateModule(moduleId, rating);
  return { message: 'Module rated successfully' };
}
}
    

