'use server';

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  LoginRequest,
  LoginActionResponse,
  SignupRequest,
  ApiResponse,
  LoginResponseData,
  SignupResponseData,
  UpdateCourseDto,
  CreateModuleDto,
  UpdateModuleDto,
  CreateCourseDto,
  UpdateUserDto,
} from '@/app/lib/types'; // Adjust path based on your folder structure

// Create base Axios instance
const api = axios.create({
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

/* USERS */

// Get user profile - GET /users/profile
export const getProfile = async (): Promise<any> => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error: any) {
    console.error('Profile fetch error:', error); // Log the entire error object
    throw error.response?.data || { message: error.message || "Unknown error" };
  }
};



// Update user profile - PUT /users/profile
export const updateProfile = async (
  updateUserDto: UpdateUserDto
): Promise<any> => {
  const response = await api.put('/users/profile', updateUserDto);
  return response.data;
};

// Get user courses - GET /users/courses
export const getUserCourses = async (): Promise<any> => {
  const response = await api.get('/users/courses');
  return response.data;
};

// Search students - GET /users/search-students
export const searchStudents = async (query: string): Promise<any> => {
  const response = await api.get(`/users/search-students?query=${query}`);
  return response.data;
};

// Search instructors - GET /users/instructors-search
export const searchInstructors = async (query: string): Promise<any> => {
  const response = await api.get(`/users/instructors-search?query=${query}`);
  return response.data;
};

// Rate instructor - POST /users/instructor/:instructorId/rate
export const rateInstructor = async (
  instructorId: string,
  rating: number
): Promise<{ message: string }> => {
  const response = await api.post(`/users/instructor/${instructorId}/rate`, {
    rating,
  });
  return response.data;
};

// Admin: Get all users - GET /users/admin/manage
export const getAllUsers = async (): Promise<any> => {
  const response = await api.get('/users/admin/manage');
  return response.data;
};

// Admin: Delete user - DELETE /users/admin/delete/:id
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/users/admin/delete/${id}`);
  return response.data;
};

// Delete own account - DELETE /users/self
export const deleteSelf = async (): Promise<{ message: string }> => {
  const response = await api.delete('/users/self');
  return response.data;
};

// Enroll in course - POST /users/enroll/:courseId
export const enrollInCourse = async (
  courseId: string
): Promise<{ message: string }> => {
  const response = await api.post(`/users/enroll/${courseId}`);
  return response.data;
};

// Get student courses by instructor - GET /users/:studentId/courses
export const getStudentCoursesByInstructor = async (
  studentId: string
): Promise<any> => {
  const response = await api.get(`/users/${studentId}/courses`);
  return response.data;
};

/* QUESTIONS */

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

export default api;
