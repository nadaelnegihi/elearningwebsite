// constants.ts

// Role Enum
export enum Role {
    Student = 'student',
    Instructor = 'instructor',
    Admin = 'admin',
  }
  
  // Roles Array (For UI dropdowns or other uses)
  export const ROLES = [
    { label: 'Student', value: Role.Student },
    { label: 'Instructor', value: Role.Instructor },
    { label: 'Admin', value: Role.Admin },
  ];
  