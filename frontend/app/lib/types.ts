// Interface for Login Request
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginActionResponse {
  message: string;
  token?: string;
  user?: { userid: string; role: string };
}
// Interface for Signup Request
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

// Generic API Response Wrapper
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Interface for Login Response Data
export interface LoginResponseData {
  token: string;
  user: {
    userid: string;
    role: string;
  };
}

// Interface for Signup Response Data
export interface SignupResponseData {
  id: string;
  email: string;
}
export interface UpdateUserDto {
    name?: string;
    email?: string;
  }

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Courses DTOs
export interface CreateCourseDto {
  title: string;
  description: string;
  category: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  keywords?: string[];
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  category?: string;
  difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  keywords?: string[];
  isAvailable?: boolean;
}

// Modules DTOs
export interface CreateModuleDto {
  courseId: string; // Use string for ObjectId in frontend
  title: string;
  content: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UpdateModuleDto {
  title?: string;
  content?: string;
  resources?: { contentType: string; resource: string }[];
  difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ModuleResource {
  title: string;
  contentType: 'video' | 'pdf' | 'image';
  resourcePath: string;
  date: string; // ISO format
}

export interface ModuleDetail {
  id: string;
  title: string;
  content: string;
  resources: ModuleResource[];
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
}
