import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  LoginRequest,
  LoginActionResponse,
  SignupRequest,
  ApiResponse,
  LoginResponseData,
  SignupResponseData,
  UpdateUserDto
} from '@/app/lib/types'; // Adjust path based on your folder structure

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
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
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error: any) {
    console.error('Get profile error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Update User Profile - PUT /users/profile
export const updateUserProfile = async (
  updateData: UpdateUserDto
): Promise<any> => {
  try {
    const response = await api.put('/users/profile', updateData);
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

export default api;
