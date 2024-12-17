'use server';

import { login } from '@/app/lib/api';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { LoginActionResponse } from '@/app/lib/types';
// Define the return type explicitly


export default async function loginAction(
  prevState: any,
  formData: FormData
): Promise<LoginActionResponse> {
  const cookieStore = await cookies();

  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Call the login API function
    const response = await login(email, password);
    const { token, user } = response;

    // Set token as an HTTP-only cookie
    cookieStore.set('token', token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600, // 1 hour expiration
    });

    // Return success message and user data
    return { message: 'Login successful!', user };
  } catch (error: any) {
    console.error('Login error:', error.message || 'Unexpected error');
    return { message: error.message || 'Login failed. Please try again.' };
  }
}
