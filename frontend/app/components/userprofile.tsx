import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { JSX } from "react";

interface UserProfileProps {
  roleBasedContent: JSX.Element;
}

export default function UserProfile({ roleBasedContent }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="absolute top-24 left-20 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-10"
      style={{ marginLeft: "4rem" }} // Ensure proper spacing from the left
    >
      <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
        Welcome, {user?.name}!
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Role: {user?.role}
      </p>
      <div>{roleBasedContent}</div>
    </div>
  );
}
