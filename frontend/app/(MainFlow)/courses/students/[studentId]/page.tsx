"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";

interface Course {
  _id: string;
  title: string;
  description: string; // Added description field
  status: string; // enrolled or completed
}

export default function StudentCoursesPage() {
  const router = useRouter();
  const params = useParams();
  const { studentId } = params;

  const [studentName, setStudentName] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        const response = await axiosInstance.get(`/users/${studentId}/courses`);
        const { studentName, courses } = response.data;
  
        setStudentName(studentName);
  
        // Separate courses into enrolled and completed
        setEnrolledCourses(
          courses
            .filter((item: any) => item.status === "enrolled")
            .map((item: any) => ({
              ...item.course, // Extract the `course` details
              status: item.status, // Include the status for display
            }))
        );
  
        setCompletedCourses(
          courses
            .filter((item: any) => item.status === "completed")
            .map((item: any) => ({
              ...item.course, // Extract the `course` details
              status: item.status, // Include the status for display
            }))
        );
      } catch (error: any) {
        console.error("Error fetching student courses:", error.response?.data || error.message);
        setError("Failed to fetch student courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    if (studentId) {
      fetchStudentCourses();
    }
  }, [studentId]);
  
  const navigateToCourseDetails = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        {studentName ? `${studentName}'s Courses` : "Student Courses"}
      </h1>

      <div className="space-y-12">
        {/* Enrolled Courses Section */}
        <div>
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-6">Enrolled Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course: Course) => (
                <div
                  key={course._id}
                  onClick={() => navigateToCourseDetails(course._id)}
                  className="block bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-700"
                >
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{course.description}</p>
                  <p className="text-sm text-gray-400">Status: Enrolled</p>
                </div>
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
                <div
                  key={course._id}
                  onClick={() => navigateToCourseDetails(course._id)}
                  className="block bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-700"
                >
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{course.description}</p>
                  <p className="text-sm text-gray-400">Status: Completed</p>
                </div>
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