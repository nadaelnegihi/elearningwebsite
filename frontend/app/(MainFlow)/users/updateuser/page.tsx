"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";

interface UpdateUserDto {
  name?: string;
  email?: string;
}

export default function EditProfilePage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Track the user's role

  const router = useRouter();

  // Fetch the user's role and prepopulate existing user details
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setRole(response.data.role); // Set the user's role
        setName(response.data.name); // Prepopulate name
        setEmail(response.data.email); // Prepopulate email
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        setError(error.response?.data?.message || "Failed to fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Only include fields that have been updated
      const updateUserDto: UpdateUserDto = {};
      if (name.trim() !== "") {
        updateUserDto.name = name;
      }
      if (email.trim() !== "") {
        updateUserDto.email = email;
      }

      // Send update request
      await axiosInstance.put("/users/profile", updateUserDto);
      alert("Profile updated successfully.");

      // Redirect to the appropriate dashboard based on role
      if (role === "admin") {
        router.push("/dashboards/admin");
      } else if (role === "instructor") {
        router.push("/dashboards/instructor");
      } else if (role === "student") {
        router.push("/dashboards/student");
      } else {
        router.push("/"); // Fallback in case role is undefined
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (role === null && !error) {
    // Show a loading state while fetching the role
    return <div className="p-6 text-white bg-gray-900 min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 rounded ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
