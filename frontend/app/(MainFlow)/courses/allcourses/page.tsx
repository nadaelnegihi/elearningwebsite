"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
}

export default function AdminAllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/courses");
        const normalizedCourses = response.data.map((course: any) => ({
          _id: course._id,
          title: course.title,
          description: course.description || "No description available",
        }));
        setCourses(normalizedCourses);
      } catch (err: any) {
        console.error("Error fetching admin courses:", err);
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/courses/delete/${courseId}`);
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId)); // Remove course locally
    } catch (error: any) {
      console.error("Error deleting course:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4"
            >
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400">
                {course.description.length > 100
                  ? course.description.slice(0, 100) + "..."
                  : course.description}
              </p>
              <div className="flex justify-between mt-4">
                <Link
                  href={`/courses/${course._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No courses available.</p>
        )}
      </div>
    </div>
  );
}
