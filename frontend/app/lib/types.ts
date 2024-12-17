// Interface for Login Request
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginActionResponse {
    message: string;
    user?: {
      userid: string;
      role: string;
    };
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