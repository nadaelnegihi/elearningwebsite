import { Course } from "src/courses/models/courses.schema";
import { Role } from '../decorators/roles.decorator';

export class RegisterRequestDto {
   
    name: string;
    email:string;
    password:string;
    role: Role;
  }