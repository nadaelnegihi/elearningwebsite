"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";

export default function CreateCoursePage() {
  const router = useRouter();
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty_level: "Beginner",
    keywords: "", // Keywords as a comma-separated string
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Handle Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      // Convert keywords string to an array
      const payload = {
        ...newCourse,
        keywords: newCourse.keywords.split(",").map((keyword) => keyword.trim()), // Convert to array
      };

      await axiosInstance.post("/courses", payload);
      router.push("/courses/allcoursesinstructor"); // Redirect back to courses page
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to create course");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Add a New Course</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <form onSubmit={handleCreateCourse}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newCourse.title}
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
              value={newCourse.description}
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
              value={newCourse.category}
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
              value={newCourse.difficulty_level}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="keywords" className="block text-sm font-medium mb-1">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={newCourse.keywords}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter keywords separated by commas"
            />
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
              {formLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
