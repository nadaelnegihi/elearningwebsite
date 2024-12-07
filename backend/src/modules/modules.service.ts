import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Module, ModuleDocument } from './models/modules.schema';
import { Resource,ResourceDocument } from './models/resourses.schema';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { Course, CourseDocument } from '../courses/models/courses.schema';
import { User,UserDocument } from 'src/users/models/users.schema';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
import { ObjectId, Types } from 'mongoose';
import { Progress,ProgressDocument } from 'src/progress/models/progress.schema';
@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private moduleModel: mongoose.Model<ModuleDocument>,
    @InjectModel(Resource.name) private resourceModel: mongoose.Model<ResourceDocument>,
    @InjectModel(Course.name) private courseModel: mongoose.Model<CourseDocument>, 
    @InjectModel(User.name) private userModel: mongoose.Model<UserDocument>, 
    @InjectModel(Progress.name) private progressModel: mongoose.Model<ProgressDocument>, 
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
    moduleId: mongoose.Types.ObjectId,
    filePath: string,
    contentType: string,
    title: string, // Add title for the resource
  ): Promise<ModuleDocument> {
    // Retrieve the module by its ID
    const module = await this.moduleModel.findById(moduleId);
  
    if (!module) {
      throw new Error('Module not found');
    }
  
    // Create a new resource document
    const newResource = new this.resourceModel({
      title, // Resource title
      contentType, // Resource type (video, pdf, etc.)
      resourcePath: filePath, // File path or URL
      moduleId, // Link the resource to the module
      completed: false, // Initial completed flag
    });
  
    const savedResource = await newResource.save(); 
    module.resources.push(savedResource._id );
    await module.save(); 
  
    return module;
  }
  
  async getResourcePath(resourceId: mongoose.Schema.Types.ObjectId): Promise<string | null> {
    // Fetch the resource by its ID
    const resource = await this.resourceModel.findById(resourceId).exec();
  
    if (!resource) {
      throw new Error('Resource not found.');
    }
  
    return resource.resourcePath; // Assuming this contains the file path
  }
  
  
  async markResourceAsComplete(
    resourceId: mongoose.Schema.Types.ObjectId,
    studentId: mongoose.Types.ObjectId,
  ): Promise<void> {
    // Fetch the resource by its ID
    const resource = await this.resourceModel.findById(resourceId).exec();
  
    if (!resource) {
      throw new Error('Resource not found.');
    }
  
    // Mark the resource as completed
    if (!resource.completed) {
      resource.completed = true;
      await resource.save();
    }
  
    // Fetch the student's progress for the related course
    const progress = await this.progressModel.findOne({
      courseId: resource.moduleId, // Assuming moduleId is the course reference
      userId: studentId,
    });
  
    // If no progress record exists, create one
    if (!progress) {
      const newProgress = new this.progressModel({
        courseId: resource.moduleId,
        userId: studentId,
        completedModules: [resourceId],
        completionPercentage: 0,
        lastAccessed: new Date(),
      });
      await newProgress.save();
    } else {
      // Add the resource ID to the completedModules array if not already present
      if (!progress.completedModules.includes(resourceId)) {
        progress.completedModules.push(resourceId);
  
        // Update the completion percentage
        const totalModules = await this.moduleModel.countDocuments({
          courseId: progress.courseId,
        });
  
        progress.completionPercentage =
          (progress.completedModules.length / totalModules) * 100;
  
        // Update last accessed date
        progress.lastAccessed = new Date();
  
        await progress.save();
      }
    }
  }
  
  async getModulesForStudents(
    courseId: mongoose.Schema.Types.ObjectId,
    studentId: mongoose.Schema.Types.ObjectId,
  ): Promise<ModuleDocument[]> {
    const student = await this.userModel.findById(studentId); // Fetch the student's data
    if (!student) {
      throw new Error('Student not found');
    }
  
    const studentLevel = student.level; // Get the student's performance level
  
    // Filter the modules based on student level
    const modules = await this.moduleModel
      .find({
        courseId,
        isOutdated: false,
        difficulty_level: { $in: this.getAccessibleLevels(studentLevel) },
      })
      .populate({
        path: 'resources', // Populate the related resources
        options: { sort: { date: 1 } }, // Sort resources by date
      })
      .exec();
  
    return modules;
  }
  

  // Helper method to determine the accessible module levels based on student level
  private getAccessibleLevels(level: string): string[] {
    switch (level) {
      case 'Beginner':
        return ['Beginner', 'Intermediate']; // Beginner can access Beginner and Intermediate modules
      case 'Intermediate':
        return ['Beginner', 'Intermediate', 'Advanced']; // Intermediate can access all levels
      case 'Advanced':
        return ['Beginner', 'Intermediate', 'Advanced']; // Advanced can access all levels
      default:
        return ['Beginner']; // Default to Beginner if no level is found
    }
  }
  
  async getModulesForInstructors(
    courseId: mongoose.Schema.Types.ObjectId,
  ): Promise<ModuleDocument[]> {
    const modules = await this.moduleModel
      .find({ courseId })
      .populate({
        path: 'resources', // Populate the related resources
        options: { sort: { date: 1 } }, // Sort resources by date
      })
      .exec();
  
    return modules;
  }
  
  async updateModule(
    moduleId: mongoose.Types.ObjectId, // Use consistent ObjectId type
    updateModuleDto: UpdateModuleDto,
  ): Promise<ModuleDocument> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate('resources') // Populate the related resources
      .exec();
  
    if (!module) {
      throw new Error('Module not found');
    }
  
    // Fetch detailed resources for the version snapshot
    const resourcesDetails = await this.resourceModel
      .find({ moduleId: moduleId })
      .exec();
  
    // Save the current state of the module into `versions`
    module.versions.push({
      title: module.title,
      content: module.content,
      resources: resourcesDetails.map(resource => ({
        contentType: resource.contentType,
        resource: resource.resourcePath,
        date: resource.createdAt,
      })),
      updatedAt: module.updatedAt || new Date(),
    });
  
    // Mark the existing module as outdated
    module.isOutdated = true;
    await module.save();
  
    // Create a new module version with updated content
    const updatedModule = new this.moduleModel({
      ...module.toObject(), // Copy fields from the old module
      ...updateModuleDto, // Apply updates
      isOutdated: false, // Mark the new version as active
      updatedAt: new Date(), // Update timestamp
      _id: undefined, // Reset ID for the new version
      versions: module.versions, // Preserve previous versions
      resources: module.resources.map(res => res._id), // Maintain references
    });
  
    return updatedModule.save();
  }
  
  async getModuleById(moduleId: mongoose.Types.ObjectId): Promise<ModuleDocument> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate({
        path: 'resources', // Populate related resources
        options: { sort: { date: 1 } }, // Sort resources by date
      })
      .exec();
  
    if (!module) {
      throw new Error('Module not found');
    }
  
    return module;
  }
  async rateModule(
    moduleId: mongoose.Types.ObjectId,
    rating: number,
  ): Promise<void> {
    const module = await this.moduleModel.findById(moduleId);
  
    if (!module) {
      throw new Error('Module not found');
    }
  
    module.ratings.push(rating);
    await module.save();
  }
  
  
}