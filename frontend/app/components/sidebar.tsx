"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";


interface Course {
  _id: string;
  name: string;
  status?: string; // For students (enrolled/completed)
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false); // Toggle for the "Courses" section
  const [courses, setCourses] = useState<Course[]>([]);
  const [role, setRole] = useState<string | null>(null); // Keep track of the user's role
  const [showSearchModal, setShowSearchModal] = useState(false); // Toggle for search chat modal
  const [conversationId, setConversationId] = useState<string>(""); // For dynamic chat route
  const [showForumSearchModal, setShowForumSearchModal] = useState(false); // Toggle for search forum modal
  const [forumQuery, setForumQuery] = useState<string>(""); // Forum search query
  const [forumResults, setForumResults] = useState<any[]>([]); // Forum search results

  const router = useRouter();

  useEffect(() => {
    // Fetch user role when the component mounts
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/users/profile"); // Adjust this endpoint if needed
        setRole(response.data.role);
      } catch (error: any) {
        console.error("Error fetching user role:", error);
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
        setCourses(response.data.courses);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
      }
    }
  };

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const handleChatsRedirect = () => {
    if (role === "student") {
      router.push("/chats/studentChat");
    } else if (role === "instructor") {
      router.push("/chats/instructorChat");
    } else {
      console.error("Invalid or missing role.");
    }
  };

  const handleSearchChat = () => {
    if (!conversationId) {
      alert("Please enter a Conversation ID");
      return;
    }
    router.push(`/chats/${conversationId}`); // Navigate to the dynamic chat route
    setShowSearchModal(false); // Close the modal after search
  };

  const handleSearchForums = async () => {
    if (!forumQuery.trim()) {
      alert("Please enter a valid search term.");
      return;
    }
  
    try {
      const response = await axiosInstance.get(`/forums/threads/search?query=${encodeURIComponent(forumQuery)}`);
      setForumResults(response.data); // Store search results
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error searching forums - Full Error Object:", error);
        console.error("Error response data:", error.response?.data);
        alert(error.response?.data?.message || "Failed to search forums.");
      } else {
        console.error("Unexpected error - Full Error Object:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  const handleForumClick = (forumId: string) => {
    router.push(`/forums/${forumId}`);
    setShowForumSearchModal(false); // Close modal
  };

  

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
          {isOpen ? "CMS Dashboard" : "CMS"}
        </div>

        {/* Sidebar Links */}
        <ul className="flex-grow space-y-2 mt-4">
          <li>
            <Link href="#" className="flex items-center p-3 hover:bg-gray-700">
              <i className="fas fa-home mr-4"></i>
              {isOpen && <span>Home Page</span>}
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
                {courses.map((course, index) => (
                  <li key={course._id || index}>
                    <Link
                      href={`/courses/${course._id}`}
                      className="block p-2 hover:bg-gray-600 rounded-md"
                    >
                      {course.name}
                      {role === "student" && course.status && (
                        <span className="ml-2 text-sm text-gray-400">
                          ({course.status})
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link href="#" className="flex items-center p-3 hover:bg-gray-700">
              <i className="fas fa-graduation-cap mr-4"></i>
              {isOpen && <span>Academic</span>}
            </Link>
          </li>

          {/* Chats Section */}
          <li>
            <button
              onClick={handleChatsRedirect}
              className="flex items-center w-full text-left p-3 hover:bg-gray-700 focus:outline-none"
            >
              <i className="fas fa-envelope mr-4"></i>
              {isOpen && <span>Chats</span>}
            </button>
          </li>

          {/* Search Chat Section */}
          <li>
            <button
              onClick={() => setShowSearchModal(true)} // Open the modal on click
              className="flex items-center w-full text-left p-3 hover:bg-gray-700 focus:outline-none"
            >
              <i className="fas fa-search mr-4"></i>
              {isOpen && <span>Search Chat</span>}
            </button>
          </li>

          {/* Forums Section */}
          <li>
            <Link href="/forums" className="flex items-center p-3 hover:bg-gray-700">
              <i className="fas fa-comments mr-4"></i>
              {isOpen && <span>Forums</span>}
            </Link>
          </li>

          {/* Search Forums Section */}
          <li>
            <button
              onClick={() => setShowForumSearchModal(true)} // Open the modal on click
              className="flex items-center w-full text-left p-3 hover:bg-gray-700 focus:outline-none"
            >
              <i className="fas fa-search mr-4"></i>
              {isOpen && <span>Search Forums</span>}
            </button>
          </li>
        </ul>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
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
