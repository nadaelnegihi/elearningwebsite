"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";
import { JSX } from "react";

interface UserProfileProps {
  roleBasedContent: JSX.Element;
}

export default function UserProfile({ roleBasedContent }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUser(response.data);
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        setError(error.response?.data?.message || "Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete("/users/self");
      alert("Your account has been deleted successfully.");
      router.push("/auth/login"); // Redirect to login page after account deletion
    } catch (error: any) {
      console.error("Error deleting account:", error);
      alert(error.response?.data?.message || "Failed to delete your account.");
    }
  };

  const handleEditProfile = () => {
    router.push("/users/updateuser"); // Redirect to edit user page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="absolute top-24 left-20 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-10"
      style={{ marginLeft: "4rem" }}
    >
      <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
        Welcome, {user?.name}!
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Role: {user?.role}
      </p>

      {/* Update Profile Button */}
      <button
        onClick={handleEditProfile}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Edit Profile
      </button>

      {/* Delete Account Button */}
      <button
        onClick={() => setShowDeleteConfirmation(true)}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ml-2"
      >
        Delete Account
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div>{roleBasedContent}</div>
    </div>
  );
}
