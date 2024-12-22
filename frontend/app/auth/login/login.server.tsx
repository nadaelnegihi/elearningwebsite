'use server'
import axiosInstance from "@/app/lib/axiosInstance";
import { cookies } from "next/headers";

let backend_url = "http://localhost:4000";

export default async function login(prevState: any, formData: FormData) {
  const cookieStore = await cookies();

  try {
    const response = await axiosInstance.post(`${backend_url}/auth/login`, {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    console.log("Response Headers:", response.headers);

    if (response.status !== 201) {
      console.error("Login failed. Response status not 201.");
      return { success: false, message: "Login failed. Please check your credentials." };
    }

    const setCookieHeader = response.headers["set-cookie"]?.[0];
    console.log("Set-Cookie Header:", setCookieHeader);

    if (!setCookieHeader) {
      console.error("Set-Cookie header missing in response.");
      return { success: false, message: "Set-Cookie header is missing in the response." };
    }

    const tokenMatch = setCookieHeader.match(/token=([^;]*)/);
    const maxAgeMatch = setCookieHeader.match(/max-age=([^;]*)/i); // Case-insensitive

    console.log("Token Match:", tokenMatch);
    console.log("Max-Age Match:", maxAgeMatch);

    if (!tokenMatch || !maxAgeMatch) {
      console.error("Failed to parse token or max-age from Set-Cookie header.");
      return { success: false, message: "Failed to parse authentication token or max age." };
    }

    const token = tokenMatch[1];
    const maxAge = parseInt(maxAgeMatch[1]);

    if (!token || isNaN(maxAge)) {
      console.error("Invalid token or max-age value.");
      return { success: false, message: "Invalid token or max age value." };
    }

    console.log("Setting cookie in cookieStore...");
    cookieStore.set("token", token, {
      secure: false, // Use `true` in production with HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge,
    });
    

    console.log("Cookie set successfully.");

    // Decode token to get user role (assuming the role is part of the token payload)
    const tokenPayload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const role = tokenPayload.user.role;

    console.log("User role:", role);

    let redirectTo = "/"; // Default redirection
    if (role === "admin") {
      redirectTo = "/dashboards/admin";
    } else if (role === "instructor") {
      redirectTo = "/dashboards/instructor";
    } else if (role === "student") {
      redirectTo = "/dashboards/student";
    }

    console.log("Redirecting to:", redirectTo);
    return { success: true, redirect: redirectTo }; // Send redirect URL
  } catch (error: any) {
    console.error("Error during login:", {
      message: error.message,
      response: error.response?.data,
    });

    const errorMessage =
      error.response?.data?.message || "An unexpected server error occurred.";
    return { success: false, message: errorMessage };
  }
}
