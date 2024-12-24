"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export interface CourseDetails {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  created_by: string;
}

interface Resource {
  _id: string;
  name: string;
}

interface Module {
  _id: string;
  title: string;
  difficulty_level: string;
  isOutdated: boolean;
  createdAt: string;
  updatedAt: string;
  resources: Resource[];
  averageRating?: number;
  quizzes?: Quiz[]; // Add quizzes property to module
}

interface Quiz {
  _id: string;
  title: string;
}

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [courseRating, setCourseRating] = useState<number | null>(null); // Track course rating

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    const fetchModulesWithQuizzes = async () => {
      if (!courseId || !role || role === "admin") return;
      try {
        const endpoint =
          role === "student"
            ? `/modules/course/${courseId}/student`
            : `/modules/course/${courseId}/instructor`;

        const response = await axiosInstance.get(endpoint);

        const modulesWithQuizzes = await Promise.all(
          response.data.map(async (module: Module) => {
            try {
              const quizzesResponse = await axiosInstance.get(`/quizzes/${module._id}`);
              return { ...module, quizzes: quizzesResponse.data.quizzes || [] };
            } catch (error) {
              console.error(`Failed to fetch quizzes for module ${module._id}:`, error);
              return { ...module, quizzes: [] }; // Default to no quizzes if the endpoint fails
            }
          })
        );

        const sortedModules = modulesWithQuizzes.sort(
          (a: Module, b: Module) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setModules(sortedModules);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
    fetchUserRole();
    fetchModulesWithQuizzes();
  }, [courseId, role, router]);

  const handleEnroll = async () => {
    if (!courseId) return;
    setEnrollLoading(true);
    try {
      await axiosInstance.post(`/users/enroll/${courseId}`);
      setEnrolled(true); // Mark as enrolled if successful
      alert("Successfully enrolled in the course!");
    } catch (error: any) {
      // Display a user-friendly message
      const errorMessage =
        error.response?.data?.message || "Failed to enroll. Please try again.";
      alert(errorMessage);
    } finally {
      setEnrollLoading(false);
    }
  };
  const handleRateCourse = async (rating: number) => {
    if (!courseId) return;
    try {
      await axiosInstance.post(`/courses/${courseId}/rate`, { rating });
      setCourseRating(rating); // Update local rating state
      alert("Course rated successfully!");
    } catch (error) {
      console.error("Failed to rate course:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const handleTakeQuiz = (moduleId: string, quizId: string) => {
    router.push(`/courses/${courseId}/modules/${moduleId}/quiz/${quizId}`);
  };
  

  const handleDownloadResource = async (moduleId: string, resourceId: string, fileName: string) => {
    try {
      const response = await axiosInstance.get(
        `/modules/${moduleId}/resources/${resourceId}/download`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handleRateModule = async (moduleId: string, rating: number) => {
    try {
      await axiosInstance.post(`/modules/${moduleId}/rate`, { rating });
      setRatings((prevRatings) => ({ ...prevRatings, [moduleId]: rating })); // Update the rating locally
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Failed to rate module:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const navigateToUpdateModule = (moduleId: string) => {
    router.push(`/courses/${courseId}/modules/${moduleId}/update`);
  };

  const navigateToUploadMedia = (moduleId: string) => {
    router.push(`/courses/${courseId}/modules/${moduleId}/upload`);
  };

  const navigateToCreateQuestion = (moduleId: string) => {
    router.push(`/courses/${courseId}/modules/${moduleId}/createquestion`);
  };

  const navigateToCreateQuiz = (moduleId: string) => {
    router.push(`/courses/${courseId}/modules/${moduleId}/createquiz`);
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

        {/* Enroll Button */}
        {role === "student" && !enrolled && (
          <button
            onClick={handleEnroll}
            disabled={enrollLoading}
            className={`mt-4 px-6 py-2 rounded-md ${
              enrollLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            {enrollLoading ? "Enrolling..." : "Enroll in Course"}
          </button>
        )}

{role === "student" && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Rate this Course:
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRateCourse(star)}
                  className={`text-lg ${
                    courseRating && courseRating >= star
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-yellow-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.length > 0 ? (
              modules.map((module) => (
                <div
                  key={module._id}
                  className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {module.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Level: {module.difficulty_level}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Created At: {new Date(module.createdAt).toLocaleString()}
                  </p>

                  {/* Quizzes Section */}
                  {module.quizzes && module.quizzes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Quizzes:</h4>
                      <ul>
                      {module.quizzes.map((quiz) => (
  <li key={quiz._id} className="flex justify-between items-center mt-2">
    <span className="text-gray-800 dark:text-gray-200">
      {quiz.title || `Quiz`}
    </span>
    {role === "student" && (
      <button
        onClick={() => handleTakeQuiz(module._id, quiz._id)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
      >
        Take Quiz
      </button>
    )}
  </li>
))}

                      </ul>
                    </div>
                  )}

                  {/* Resources Section */}
                  {role === "student" && (
                    <div className="mt-4">
                      {module.resources.map((resource) => (
  <div key={resource._id} className="flex justify-between items-center mt-2">
    <button
      onClick={() =>
        handleDownloadResource(module._id, resource._id, resource.name)
      }
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
    >
      Download Content
    </button>
  </div>
))}
                      <div className="mt-4">
                        <span className="text-gray-800 dark:text-gray-200">Rate this module:</span>
                        <div className="flex items-center space-x-2 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateModule(module._id, star)}
                              className={`text-lg ${
                                ratings[module._id] >= star
                                  ? "text-yellow-400"
                                  : "text-gray-400 hover:text-yellow-400"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instructor Section */}
                  {role === "instructor" && (
                    <div className="mt-4 flex flex-col space-y-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => navigateToUpdateModule(module._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition"
                        >
                          Update Module
                        </button>
                        <button
                          onClick={() => navigateToUploadMedia(module._id)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition"
                        >
                          Upload Media
                        </button>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => navigateToCreateQuestion(module._id)}
                          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-400 transition"
                        >
                          Create Question
                        </button>
                        <button
                          onClick={() => navigateToCreateQuiz(module._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition"
                        >
                          Create Quiz
                        </button>
                      </div>
                    </div>
                  )}
                  {role === "student" && (
  <div className="mt-4 flex space-x-4">
    <button
      onClick={() => router.push(`/courses/${courseId}/modules/${module._id}/add-note`)}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
    >
      Add Note
    </button>
    <button
      onClick={() => router.push(`/courses/${courseId}/modules/${module._id}/note`)}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
    >
      View Notes
    </button>
  </div>
)}

                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No modules available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
