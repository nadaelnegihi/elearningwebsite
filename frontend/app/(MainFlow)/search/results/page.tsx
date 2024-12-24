"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";

interface SearchResult {
  id: string;
  name: string;
  email?: string; // Optional field for students/instructors
  role?: string; // Optional field for users
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Use Next.js router
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUserRole(response.data.role);
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);

      try {
        const requests = [];

        if (userRole === "student") {
          requests.push(
            axiosInstance.get("/courses/search", { params: { query } })
          );
          requests.push(
            axiosInstance.get("/users/instructors-search", { params: { query } })
          );
        } else if (userRole === "instructor") {
          requests.push(
            axiosInstance.get("/courses/search", { params: { query } })
          );
          requests.push(
            axiosInstance.get("/users/search-students", { params: { query } })
          );
        } else if (userRole === "admin") {
          requests.push(
            axiosInstance.get("/courses/search", { params: { query } })
          );
          requests.push(
            axiosInstance.get("/users/search-students", { params: { query } })
          );
          requests.push(
            axiosInstance.get("/users/instructors-search", { params: { query } })
          );
        }

        const responses = await Promise.all(
          requests.map((req) =>
            req.catch((err) => {
              console.error("Request failed:", err.message);
              return null; // Return null for failed requests
            })
          )
        );

        const courses =
          responses[0]?.data?.map((course: any) => ({
            id: course._id,
            name: course.title,
            role: "Course",
          })) || [];

        const students =
          responses.length > 1 && userRole !== "student"
            ? responses[1]?.data?.map((student: any) => ({
                id: student._id,
                name: student.name,
                email: student.email,
                role: "Student",
              }))
            : [];

        const instructors =
          responses.length > 1 && userRole === "student"
            ? responses[1]?.data?.map((instructor: any) => ({
                id: instructor._id,
                name: instructor.name,
                email: instructor.email,
                role: "Instructor",
              }))
            : responses.length > 2
            ? responses[2]?.data?.map((instructor: any) => ({
                id: instructor._id,
                name: instructor.name,
                email: instructor.email,
                role: "Instructor",
              }))
            : [];

        setResults([...courses, ...students, ...instructors]);
      } catch (error: any) {
        console.error("Unexpected error fetching results:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, userRole]);

  // Handle view courses for students
  const handleViewCourses = (studentId: string) => {
    router.push(`/courses/students/${studentId}`);
  };

  // Navigate to details page
  const handleResultClick = (id: string, role: string) => {
    if (role === "Course") {
      router.push(`/courses/${id}`);
    } else if (role === "Instructor" || role === "Student") {
      router.push(`/users/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Search Results for "{query}"
        </h1>

        {isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        )}

        {results.length > 0 && (
          <ul className="bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-[80vh] overflow-y-auto">
            {results.map((result) => (
              <li
                key={result.id}
                className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">{result.name}</span>
                    {result.email && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        ({result.email})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      {result.role}
                    </span>
                    {result.role === "Student" && (
                      <button
                        onClick={() => handleViewCourses(result.id)}
                        className="text-blue-500 hover:underline"
                      >
                        View Courses
                      </button>
                    )}
                    {result.role === "Instructor" && (
                      <button
                        onClick={() => handleResultClick(result.id, result.role!)}
                        className="text-blue-500 hover:underline"
                      >
                        View Profile
                      </button>
                    )}
                    {result.role === "Course" && (
                      <button
                        onClick={() => handleResultClick(result.id, result.role!)}
                        className="text-blue-500 hover:underline"
                      >
                        View Course
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && results.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
}
