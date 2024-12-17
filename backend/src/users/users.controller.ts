
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Query, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserDocument } from './models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import mongoose from 'mongoose';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(AuthGuard, authorizationGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user.userid; // Extract `userid` from the JWT
    return this.usersService.findById(userId);
  }
  @UseGuards(AuthGuard, authorizationGuard)
  @Put('profile')
  @Roles(Role.Instructor, Role.Student)
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user._id; // Extract `userid` from the JWT
    return this.usersService.updateUser(userId, updateUserDto);
  }
  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student, Role.Instructor)
  @Get('courses')
  async getUserCourses(@Req() req: any) {
    const userId = req.user._id; // Extract `userid` from the JWT
    return this.usersService.getUserCourses(userId);
  }

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Get('search-students')
  async searchStudents(
    @Query('query') query: string,
  ): Promise<UserDocument[]> {
    return this.usersService.searchStudents(query);
  }

  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student, Role.Admin)
  @Get('instructors-search')
  async searchInstructors(
    @Query('query') query: string,
  ): Promise<UserDocument[]> {
    return this.usersService.searchInstructors(query);
  }
  
  @UseGuards(AuthGuard, authorizationGuard)
  @Roles(Role.Student)
  @Post('instructor/:instructorId/rate')
  async rateInstructor(
    @Param('instructorId') instructorId: mongoose.Types.ObjectId,
    @Body('rating') rating: number,
  ): Promise<{ message: string }> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    await this.usersService.rateInstructor(instructorId, rating);
    return { message: 'Instructor rated successfully' };
  }
  @UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Admin)
@Get('admin/manage')
async getAllUsers(): Promise<UserDocument[]> {
  return this.usersService.findAll();
}
@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Admin)
@Delete('admin/delete/:id')
async deleteUser(@Param('id') userId: mongoose.Schema.Types.ObjectId): Promise<{ message: string }> {
  await this.usersService.deleteUser(userId);
  return { message: 'User deleted successfully' };
}
@UseGuards(AuthGuard, authorizationGuard)
@Roles(Role.Student)
@Post('enroll/:courseId')
async enrollInCourse(
  @Req() req: any,
  @Param('courseId') courseId: mongoose.Types.ObjectId,
): Promise<{ message: string }> {
  const userId = req.user._id; // Extract _id from JWT payload
  console.log('User ID:', userId); // Log the user ID for debugging
  await this.usersService.enrollInCourse(userId, courseId);
  return { message: 'Enrolled in course successfully' };
}

}






