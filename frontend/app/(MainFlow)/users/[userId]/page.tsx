"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  ratings?: number[];
}

export default function UserDetailsPage() {
  const { userId } = useParams(); // Extract the userId from the dynamic route
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // Role of the logged-in user
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user details and logged-in user role
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        router.push("/404"); // Redirect to 404 if the user is not found
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    fetchUserDetails();
    fetchUserRole();
  }, [userId, router]);

  const handleRating = async (rating: number) => {
    if (!user || !user.id || user.role !== "Instructor") return;
    setIsSubmitting(true);

    try {
      await axiosInstance.post(`/users/instructor/${user.id}/rate`, { rating });
      alert("Instructor rated successfully!");
    } catch (error) {
      console.error("Failed to rate instructor:", error);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">{user.name}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Email: {user.email}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Role: {user.role}</p>

        {/* Show rating only for instructors and logged-in students */}
        {user.role === "Instructor" && userRole === "Student" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Rate Instructor</h2>
            <div className="flex items-center space-x-2">
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      onClick={() => handleRating(star)}
      disabled={isSubmitting}
      className={`text-2xl ${
        (rating ?? 0) >= star ? "text-yellow-400" : "text-gray-400"
      } hover:text-yellow-400 transition`}
    >
      ★
    </button>
  ))}
</div>

            {isSubmitting && <p className="text-gray-500 mt-2">Submitting your rating...</p>}
          </div>
        )}

        {/* Average rating display */}
        {user.ratings && user.ratings.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg text-gray-700 dark:text-gray-300">
              Average Rating:{" "}
              {(
                user.ratings.reduce((acc, rating) => acc + rating, 0) / user.ratings.length
              ).toFixed(1)}
              /5
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
