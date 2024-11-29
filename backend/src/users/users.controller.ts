
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards,Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User,UserDocument } from './models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('users')
export class UsersController {
      constructor(private usersService: UsersService) {}
    
      @UseGuards(AuthGuard) // Ensure the user is authenticated
      @Get('profile')
      async getProfile(@Req() req: any) {
        const userId = req.user._id; // Extract `userid` from the JWT
        return this.usersService.findById(userId);
      }
      @UseGuards(AuthGuard) 
      @Put('profile')
      async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user._id; // Extract `userid` from the JWT
        return this.usersService.updateUser(userId, updateUserDto);
      }
      @UseGuards(AuthGuard) // Ensure the user is authenticated
      @Get('courses')
      async getUserCourses(@Req() req: any) {
        const userId = req.user._id; // Extract `userid` from the JWT
        return this.usersService.getUserCourses(userId);
      }

      @UseGuards(AuthGuard, authorizationGuard)
      @Roles(Role.Instructor)
      @Get('search-students')
      async searchStudents(
        @Query('query') query: string,
      ): Promise<UserDocument[]> {
        return this.usersService.searchStudents(query);
      }

      @UseGuards(AuthGuard, authorizationGuard)
      @Roles(Role.Student)
      @Get('instructors-search')
      async searchInstructors(
        @Query('query') query: string,
      ): Promise<UserDocument[]> {
        return this.usersService.searchInstructors(query);
      }
    }
    





