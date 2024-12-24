"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "../__context";

interface Course {
  _id: string;
  title: string;
  description: string;
}

export default function Sidebar() {
  const { role } = useUserContext()
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
        const validCourses = response.data.courses.map((course: Course | { course: Course }) => {
          const c = (course as unknown as { course: Course }).course || course;
          return {
            _id: c._id,
            title: c.title,
            description: c.description,
          };
        });

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
          {isOpen ? `Content Management System (CMS)` : "CMS"}
        </div>

        {/* Sidebar Links */}
        <ul className="flex-grow space-y-2 mt-4">
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

          {userRole === "admin" && (
            <li>
              <Link
                href="/users/allusers"
                className="flex items-center p-3 hover:bg-gray-700"
              >
                <i className="fas fa-users mr-4"></i>
                {isOpen && <span>View Users</span>}
              </Link>
            </li>
          )}

          {(userRole === "instructor" || userRole === "student") && (
            <li>
              <Link
                href="/progress"
                className="flex items-center p-3 hover:bg-gray-700"
              >
                <i className="fas fa-chart-line mr-4"></i>
                {isOpen && <span>Progress</span>}
              </Link>
            </li>
          )}
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

      {/* Modal for Searching Chats */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">Search Chat</h2>
            <input
              type="text"
              placeholder="Enter Conversation ID"
              value={conversationId}
              onChange={(e) => setConversationId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSearchChat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Searching Forums */}
      {showForumSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">Search Forums</h2>
            <input
              type="text"
              placeholder="Enter search term"
              value={forumQuery}
              onChange={(e) => setForumQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForumSearchModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSearchForums}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {forumResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Search Results</h3>
                <ul className="space-y-2">
                  {forumResults.map((result) => (
                    <li
                      key={result.id}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                      onClick={() => handleForumClick(result.id)}
                    >
                      <strong>{result.title}</strong>
                      <p className="text-sm text-gray-500">{result.createdBy?.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}