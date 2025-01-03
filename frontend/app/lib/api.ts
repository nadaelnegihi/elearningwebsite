import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  LoginRequest,
  LoginActionResponse,
  SignupRequest,
  ApiResponse,
  LoginResponseData,
  SignupResponseData,
  UpdateUserDto,
  CreateNoteRequest,
  UpdateNoteRequest,
  NoteResponse,
  NotesListResponse,
} from '@/app/lib/types'; // Adjust path based on your folder structure

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure cookies are sent
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token in Request:', token); // Debugging
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* AUTHENTICATION */

// Login API - POST /auth/login
export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: { userid: string; role: string } }> => {
  try {
    const response: AxiosResponse<any> = await api.post('/auth/login', {
      email,
      password,
    });

    const { user, access_token } = response.data;

    return {
      token: access_token,
      user: user.user,
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Signup API - POST /auth/signup
export const signup = async (
  userData: SignupRequest
): Promise<SignupResponseData> => {
  try {
    const response: AxiosResponse<ApiResponse<SignupResponseData>> =
      await api.post('/auth/signup', userData);

    return response.data.data;
  } catch (error: any) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* USER PROFILE */

// Get User Profile - GET /users/profile
export const getProfile = async (): Promise<any> => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error: any) {
    console.error('Get profile error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Update User Profile - PUT /users/profile
export const updateProfile = async (
  updateUserDto: UpdateUserDto
): Promise<any> => {
  try {
    const response = await api.put('/users/profile', updateUserDto);
    return response.data; // Return updated user data
  } catch (error: any) {
    console.error('Update profile error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* COURSES */

// Get User Courses - GET /users/courses
export const getUserCourses = async (): Promise<any> => {
  try {
    const response = await api.get('/users/courses');
    return response.data;
  } catch (error: any) {
    console.error('Get courses error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Enroll in Course - POST /users/enroll/:courseId
export const enrollInCourse = async (courseId: string): Promise<any> => {
  try {
    const response = await api.post(`/users/enroll/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Enroll course error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* SEARCH */

// Search Students - GET /users/search-students
export const searchStudents = async (query: string): Promise<any> => {
  try {
    const response = await api.get(`/users/search-students?query=${query}`);
    return response.data;
  } catch (error: any) {
    console.error('Search students error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Search Instructors - GET /users/instructors-search
export const searchInstructors = async (query: string): Promise<any> => {
  try {
    const response = await api.get(`/users/instructors-search?query=${query}`);
    return response.data;
  } catch (error: any) {
    console.error('Search instructors error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* ADMIN */

// Get All Users (Admin) - GET /users/admin/manage
export const getAllUsers = async (): Promise<any> => {
  try {
    const response = await api.get('/users/admin/manage');
    return response.data;
  } catch (error: any) {
    console.error('Get all users error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Delete User (Admin) - DELETE /users/admin/delete/:id
export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const response = await api.delete(`/users/admin/delete/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete user error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* RATINGS */

// Rate Instructor - POST /users/instructor/:instructorId/rate
export const rateInstructor = async (
  instructorId: string,
  rating: number
): Promise<any> => {
  try {
    const response = await api.post(`/users/instructor/${instructorId}/rate`, {
      rating,
    });
    return response.data;
  } catch (error: any) {
    console.error('Rate instructor error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* QUESTIONS */

// Create Question - POST /questions
export const createQuestion = async (
  questionData: {
    moduleId: string;
    questionId: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionTypes: 'MCQ' | 'True/False';
  }
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.post('/questions', questionData);
    return response.data;
  } catch (error: any) {
    console.error('Create question error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Update Question - PUT /questions/:questionId
export const updateQuestion = async (
  questionId: string,
  updateData: Partial<any>
): Promise<any> => {
  try {
    const response = await api.put(`/questions/${questionId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Update question error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Delete Question - DELETE /questions/:questionId
export const deleteQuestion = async (questionId: string): Promise<any> => {
  try {
    const response = await api.delete(`/questions/${questionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete question error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* QUIZ */

// Create Quiz - POST /create
export const createQuiz = async (
  quizData: {
    moduleId: string;
    numberOfQuestions: number;
    questionTypes: 'MCQ' | 'True/False' | 'Both';
    studentId: string;
  }
): Promise<any> => {
  try {
    const response = await api.post('/create', quizData);
    return response.data;
  } catch (error: any) {
    console.error('Create quiz error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/* NOTES */

// Get All Notes - GET /notes
export const getNotes = async (): Promise<any> => {
  try {
    const response = await api.get('/notes');
    return response.data;
  } catch (error: any) {
    console.error('Get notes error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Create Note - POST /notes
export const createNote = async (noteData: { title: string; content: string }): Promise<any> => {
  try {
    const response = await api.post('/notes', noteData);
    return response.data;
  } catch (error: any) {
    console.error('Create note error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Update Note - PUT /notes/:id
export const updateNote = async (
  noteId: string,
  updateData: { title?: string; content?: string }
): Promise<any> => {
  try {
    const response = await api.put(`/notes/${noteId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Update note error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Delete Note - DELETE /notes/:id
export const deleteNote = async (noteId: string): Promise<any> => {
  try {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete note error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Progress
export const getCourseCompletionRate = async (courseId: string): Promise<any> => {
  try {
    const response = await api.get(`/progress/course/${courseId}/completion-rate`);
    return response.data;
  } catch (error: any) {
    console.error('get course completion error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const getStudentAverageScore = async (): Promise<any> => {
  try {
    const response = await api.get(`/progress/student/average-score`);
    return response.data;
  } catch (error: any) {
    console.error('get student average score:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const getStudentPerformanceMetric = async (courseId : string): Promise<any> => {
  try {
    const response = await api.get(`/progress/course/${courseId}/performance-metric`);
    return response.data;
  } catch (error: any) {
    console.error('get mtudent merformance metric:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

//intructor
export const getStudentEngagementAnalytics = async (): Promise<any> => {
  try {
    const response = await api.get(`/progress/instructor/engagement`);
    return response.data;
  } catch (error: any) {
    console.error('get student engagement analytics:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};


//intructor
export const getContentEffectivenessAnalytics = async (): Promise<any> => {
  try {
    const response = await api.get(`/progress/instructor/content-effectiveness`);
    return response.data;
  } catch (error: any) {
    console.error('get content effectiveness analytics:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};


//intructor
export const getQuizzesByInstructor = async (): Promise<any> => {
  try {
    const response = await api.get(`/progress/instructor/quiz-results`);
    return response.data;
  } catch (error: any) {
    console.error('get quizzes by instructor:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};


//intructor
export const downloadAnalytics = async (): Promise<any> => {
  try {
    const response = await api.get(`/progress/instructor/download`);
    return response.data;
  } catch (error: any) {
    console.error('get download analytics:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};
export default api;
