import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Module, ModuleDocument } from './models/modules.schema';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { Course, CourseDocument } from '../courses/models/courses.schema';
import { User,UserDocument } from 'src/users/models/users.schema';
import { UpdateModuleDto } from './dto/UpdateModuleDto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private moduleModel: mongoose.Model<Module>,
    @InjectModel(Course.name) private courseModel: mongoose.Model<Course>, 
    @InjectModel(User.name) private userModel: mongoose.Model<User>, 
  ) {}
  async createModule(createModuleDto: CreateModuleDto): Promise<ModuleDocument> {
    const { courseId, ...moduleData } = createModuleDto; // Extract the courseId from the DTO

    const newModule = new this.moduleModel(moduleData);
    const savedModule = await newModule.save();

    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    course.modules.push(savedModule._id);
    await course.save();
    return savedModule;
  }
  async addMediaToModule(
    moduleid: mongoose.Schema.Types.ObjectId,
    filePath: string,
    contentType: string,
  ): Promise<ModuleDocument> {
    // Retrieve the module by its ID
    const module = await this.moduleModel.findById(moduleid);
  
    if (!module) {
      throw new Error('Module not found');
    }
  
    // Add the file to the module's hierarchy
    module.resources.push({
      contentType: contentType, // Dynamic content type based on the uploaded file
      resource: filePath,
    });
  
    // Save the updated module
    await module.save();
    return module;
  }
  async getModulesForStudents(courseId: mongoose.Schema.Types.ObjectId, studentId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]> {
    const student = await this.userModel.findById(studentId);  // Fetch the student's data
    if (!student) {
      throw new Error('Student not found');
    }

    const studentLevel = student.level;  // Get the student's performance level

    // Filter the modules based on student level
    return this.moduleModel.find({
      courseId,
      isOutdated: false,
      difficulty_level: { $in: this.getAccessibleLevels(studentLevel) },
    }).exec();
  }

  // Helper method to determine the accessible module levels based on student level
  private getAccessibleLevels(level: string): string[] {
    switch (level) {
      case 'Beginner':
        return ['Beginner', 'Intermediate'];  // Beginner can access Beginner and Intermediate modules
      case 'Intermediate':
        return ['Beginner', 'Intermediate', 'Advanced']; // Intermediate can access all levels
      case 'Advanced':
        return ['Beginner', 'Intermediate', 'Advanced']; // Advanced can access all levels
      default:
        return ['Beginner'];  // Default to Beginner if no level is found
    }
  }
  
  async getModulesForInstructors(courseId: mongoose.Schema.Types.ObjectId): Promise<ModuleDocument[]> {
    return this.moduleModel.find({ courseId }).exec(); // Returns all modules, both outdated and non-outdated
  }
  

  async updateModule(
    moduleId: mongoose.Schema.Types.ObjectId,
    updateModuleDto: UpdateModuleDto,
  ): Promise<ModuleDocument> {
    // Find the current module
    const module = await this.moduleModel.findById(moduleId);
  
    if (!module) {
      throw new Error('Module not found');
    }

    module.isOutdated = true;
    await module.save();
  
    const newModule = new this.moduleModel({
      ...updateModuleDto,
      updatedAt: new Date(),
    });
  
    return newModule.save();
  }
  
}
