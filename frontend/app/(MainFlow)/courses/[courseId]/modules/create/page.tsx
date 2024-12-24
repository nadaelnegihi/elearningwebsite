"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export default function CreateModulePage() {
  const { courseId } = useParams(); // Retrieve courseId from the URL
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setFormError("Course ID is missing. Please try again.");
    }
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !content || !difficultyLevel || !courseId) {
      setFormError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(`/modules`, {
        courseId,
        title,
        content,
        difficulty_level: difficultyLevel,
      });
      alert("Module created successfully!");
      router.push(`/courses/${courseId}`); // Redirect back to course details page
    } catch (error) {
      setFormError("Failed to create module. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Create Module</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter module title"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              placeholder="Enter module content"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="difficulty_level" className="block text-sm font-medium mb-1">
              Difficulty Level
            </label>
            <select
              id="difficulty_level"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
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
              disabled={loading}
              className={`px-6 py-2 rounded-md ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {loading ? "Creating..." : "Create Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
