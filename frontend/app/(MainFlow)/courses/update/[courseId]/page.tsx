"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";

export default function UpdateCoursePage() {
  const { courseId } = useParams(); // Get the course ID from the URL
  const router = useRouter();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty_level: "Beginner",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch the course details on load
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        setCourse(response.data); // Assuming API returns the course details
      } catch (error: any) {
        console.error("Error fetching course details:", error.response?.data || error.message);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      await axiosInstance.put(`/courses/${courseId}`, course); // Assuming this is the correct endpoint
      router.push("/courses/allcoursesinstructor"); // Redirect after successful update
    } catch (error: any) {
      setFormError(error.response?.data?.message || "Failed to update course");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Update Course</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <form onSubmit={handleUpdateCourse}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={course.title}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={course.category}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="difficulty_level" className="block text-sm font-medium mb-1">
              Difficulty Level
            </label>
            <select
              id="difficulty_level"
              name="difficulty_level"
              value={course.difficulty_level}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-500 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className={`px-6 py-2 rounded-md ${
                formLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {formLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
