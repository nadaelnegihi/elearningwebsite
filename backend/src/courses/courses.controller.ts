import { Body, Controller, Query,Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Role } from 'src/auth/decorators/roles.decorator'; 
import { Roles } from 'src/auth/decorators/roles.decorator'; 
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { CreateCourseDto } from './dto/CreateCourseDto';
import { UpdateCourseDto } from './dto/UpdateCourseDto';
import { Course } from './models/courses.schema';

import mongoose from 'mongoose';
@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor)
@Post()

async createCourse(@Body() createCourseDto: CreateCourseDto, @Req() req: any) {
  const instructorname = req.user.name
  return this.coursesService.createCourse(createCourseDto, instructorname);
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Student,Role.Instructor)
@Get()
async getCourses() {
  return this.coursesService.getAllCourses();
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Student, Role.Instructor) 
@Get(':courseId')
async getCourse(@Param('courseId') courseId:  mongoose.Schema.Types.ObjectId) {
  return this.coursesService.getCourseById(courseId);
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor)
@Put(':courseId')
async updateCourse(
  @Param('courseId') courseId: mongoose.Schema.Types.ObjectId,
  @Body() updateCourseDto: UpdateCourseDto,
) {
  return this.coursesService.updateCourse(courseId, updateCourseDto);
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Instructor) 
@Delete('delete/:courseId')
async deleteCourse(
  @Param('courseId') courseId: mongoose.Schema.Types.ObjectId
): Promise<{ message: string }> {
  await this.coursesService.deleteCourse(courseId);
  return { message: 'Course deleted successfully' };
}

@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Student, Role.Instructor)  
@Get('search')
async searchCourses(
  @Query('title') title: string,
  @Query('category') category: string,
  @Query('created_by') created_by: string
): Promise<Course[]> {
  return this.coursesService.searchCourses({ title, category, created_by });
}


}