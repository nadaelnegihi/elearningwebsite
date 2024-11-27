
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/users.schema';
import { UpdateUserDto } from './dto/UpdateUser.dto';
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
        const userId = req.user.userid; // Extract `userid` from the JWT
        return this.usersService.findById(userId);
      }
      @UseGuards(AuthGuard)
      @Put(':id')
    async updateStudent(@Param('id') id:string,@Body()studentData: UpdateUserDto) {
        const updatedStudent = await this.usersService.update(id, studentData);
        return updatedStudent;       
    }
    }
    





