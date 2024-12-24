"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export default function UpdateModulePage() {
  const { moduleId, courseId } = useParams(); // Module ID and Course ID from URL
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await axiosInstance.get(`/modules/${moduleId}`);
        const module = response.data;
        setTitle(module.title);
        setContent(module.content);
        setDifficultyLevel(module.difficulty_level);
      } catch (err) {
        console.error("Failed to fetch module:", err);
        setError("Failed to load module details.");
      }
    };

    fetchModule();
  }, [moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axiosInstance.put(`/modules/update/${moduleId}`, {
        title,
        content,
        difficulty_level: difficultyLevel,
      });
      alert("Module updated successfully!");
      router.push(`/courses/${courseId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update module.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-lg text-white w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Update Module</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Difficulty Level</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 rounded hover:bg-blue-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Updating..." : "Update Module"}
          </button>
        </div>
      </form>
    </div>
  );
}
