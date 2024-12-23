"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUserRole(response.data.role); // Assuming `role` is part of the response
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const toggleCourses = async () => {
    setCoursesOpen((prev) => !prev);

    if (!coursesOpen) {
      try {
        const response = await axiosInstance.get("/users/courses");

        // Ensure all courses are properly mapped
        const validCourses = response.data.courses.map((course: Course) => ({
          _id: course._id,
          title: course.title,
          description: course.description,
        }));

        setCourses(validCourses);
      } catch (error: any) {
        console.error("Error fetching courses:", error.response?.data || error.message);
      }
    }
  };

  const navigateToAllCourses = () => {
    if (userRole === "admin") {
      router.push("/courses/allcourses");
    } else if (userRole === "instructor") {
      router.push("/courses/allcoursesinstructor");
    } else if (userRole === "student") {
      router.push("/courses/allcoursesstudents");
    }
  };

  if (userRole === null) {
    return <div>Loading user data...</div>; // Show a loading state until the role is fetched
  }

  return (
    <div
      className={`h-screen bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } fixed z-50`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          {isOpen ? "Content Management System (CMS)" : "CMS"}
        </div>

        {/* Sidebar Links */}
        <ul className="flex-grow space-y-2 mt-4">
          <li>
            <Link href="#" className="flex items-center p-3 hover:bg-gray-700">
              <i className="fas fa-home mr-4"></i>
              {isOpen && <span>Dashboards</span>}
            </Link>
          </li>

          {/* Courses Section */}
          <li>
            <button
              onClick={toggleCourses}
              className="flex items-center w-full text-left p-3 hover:bg-gray-700 focus:outline-none"
            >
              <i className="fas fa-book mr-4"></i>
              {isOpen && <span>Courses</span>}
              {isOpen && (
                <span className="ml-auto">
                  {coursesOpen ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </span>
              )}
            </button>
            {isOpen && coursesOpen && (
              <ul className="pl-8 mt-2 space-y-1">
                <li>
                  <button
                    onClick={navigateToAllCourses}
                    className="block text-left w-full p-2 hover:bg-gray-600 rounded-md"
                  >
                    All Courses
                  </button>
                </li>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <li key={course._id}>
                      <Link
                        href={`/courses/${course._id}`}
                        className="block p-2 hover:bg-gray-600 rounded-md"
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">No courses available.</p>
                )}
              </ul>
            )}
          </li>

          <li>
            <Link href="#" className="flex items-center p-3 hover:bg-gray-700">
              <i className="fas fa-graduation-cap mr-4"></i>
              {isOpen && <span>Academic</span>}
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center p-3 hover:bg-gray-700">
              <i className="fas fa-comments mr-4"></i>
              {isOpen && <span>Group Chat</span>}
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center p-3 hover:bg-gray-700">
              <i className="fas fa-bell mr-4"></i>
              {isOpen && <span>Notifications</span>}
            </Link>
          </li>
        </ul>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
          >
            {isOpen ? "Logout" : <i className="fas fa-sign-out-alt"></i>}
          </button>
        </div>
      </div>
    </div>
  );
}
