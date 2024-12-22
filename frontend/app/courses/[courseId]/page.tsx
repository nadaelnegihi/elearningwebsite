"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  created_by: string;
}

interface Module {
  id: string;
  title: string;
  difficulty_level: string;
  resources: { name: string; url: string }[];
}

export default function CourseDetailsPage() {
  const { courseId } = useParams(); // Get the dynamic route parameter
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [role, setRole] = useState<string | null>(null); // Store user role
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false); // Track enrollment status
  const [enrollLoading, setEnrollLoading] = useState(false); // Track enroll button loading state

  useEffect(() => {
    // Fetch course details
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        router.push("/404");
      }
    };

    // Fetch user role
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    // Fetch modules
    const fetchModules = async () => {
      if (!courseId || !role) return;
      try {
        const endpoint =
          role === "student"
            ? `/courses/course/${courseId}/student`
            : `/courses/course/${courseId}/instructor`;
        const response = await axiosInstance.get(endpoint);
        setModules(response.data);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
    fetchUserRole();
    fetchModules();
  }, [courseId, role, router]);

  // Handle Enrollment
  const handleEnroll = async () => {
    if (!courseId) return;
    setEnrollLoading(true);
    try {
      await axiosInstance.post(`/users/enroll/${courseId}`);
      setEnrolled(true);
    } catch (error) {
      console.error("Failed to enroll in course:", error);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading || !course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">{course.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Category:</strong> {course.category}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Instructor:</strong> {course.created_by}
        </p>

        {/* Enroll Button for Students Only */}
        {role === "student" && (
          <div className="mt-6">
            {!enrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className={`px-6 py-2 text-white rounded-md ${
                  enrollLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {enrollLoading ? "Enrolling..." : "Enroll in Course"}
              </button>
            ) : (
              <p className="text-green-600 font-bold">You are enrolled in this course!</p>
            )}
          </div>
        )}

        {/* Modules Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Modules</h2>
          {modules.length > 0 ? (
            <ul className="list-disc list-inside">
              {modules.map((module) => (
                <li key={module.id} className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>{module.title}</strong> - Level: {module.difficulty_level}
                  {module.resources.length > 0 && (
                    <ul className="list-inside list-square ml-4 mt-2">
                      {module.resources.map((resource, index) => (
                        <li key={index}>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            {resource.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No modules available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
