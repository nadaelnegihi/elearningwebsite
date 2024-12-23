"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
}

export default function InstructorAllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses on load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/users/courses");
        setCourses(response.data.courses); // Assuming `courses` key holds the list of taught courses
      } catch (err: any) {
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
    return <div className="text-center text-white mt-10">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Courses You Teach</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4"
            >
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {course.description.length > 100
                  ? course.description.slice(0, 100) + "..."
                  : course.description}
              </p>
              <div className="flex justify-between">
                <Link
                  href={`/courses/${course._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
                >
                  View
                </Link>
                <Link
                  href={`/courses/update/${course._id}`}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                >
                  Update
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
          <p className="text-gray-400">You are not teaching any courses at the moment.</p>
        )}
      </div>

      {/* Add Course Button */}
      <div className="flex justify-center">
        <Link
          href="/courses/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-500 transition"
        >
          Add Course
        </Link>
      </div>
    </div>
  );
}
