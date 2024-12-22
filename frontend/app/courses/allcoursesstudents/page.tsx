"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  status: string; // enrolled or completed
}

interface APIResponseItem {
  course: Course;
  status: string;
}

export default function AllCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/users/courses");
        const courses = response.data.courses.map((item: APIResponseItem) => ({
          ...item.course,
          status: item.status,
        }));

        // Separate courses into enrolled and completed
        setEnrolledCourses(courses.filter((course: Course) => course.status === "enrolled"));
        setCompletedCourses(courses.filter((course: Course) => course.status === "completed"));
      } catch (error: any) {
        console.error("Error fetching courses:", error.response?.data || error.message);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center">All Courses</h1>

      <div className="space-y-12">
        {/* Enrolled Courses Section */}
        <div>
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-6">Enrolled Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course: Course) => (
                <Link
                  key={course._id}
                  href={`/courses/${course._id}`}
                  className="block bg-gray-800 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
                >
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-400">Status: Enrolled</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">No enrolled courses.</p>
            )}
          </div>
        </div>

        {/* Completed Courses Section */}
        <div>
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-6">Completed Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.length > 0 ? (
              completedCourses.map((course: Course) => (
                <Link
                  key={course._id}
                  href={`/courses/${course._id}`}
                  className="block bg-gray-800 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
                >
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-400">Status: Completed</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">No completed courses.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
