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
  // Interface for Note
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for Create Note Request
export interface CreateNoteRequest {
  title: string;
  content: string;
}

// Interface for Update Note Request
export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

// Interface for Note Response
export interface NoteResponse {
  message: string;
  data: Note;
}

// Interface for Notes List Response
export interface NotesListResponse {
  message: string;
  data: Note[];
}
