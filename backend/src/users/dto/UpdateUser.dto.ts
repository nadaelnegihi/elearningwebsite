import { Course } from "src/courses/models/courses.schema";


  export class UpdateUserDto {
    readonly name?: string;
    readonly email?: string;
    readonly password?: string;
  }
  