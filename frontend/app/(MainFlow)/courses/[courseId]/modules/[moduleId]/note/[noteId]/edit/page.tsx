"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export default function EditNotePage() {
  const { courseId, moduleId, noteId } = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [autosaveTimeout, setAutosaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axiosInstance.get(`/notes/${noteId}`);
        setContent(response.data.content);
      } catch (error) {
        console.error("Failed to fetch note:", error);
        alert("Failed to load note.");
        router.push(`/courses/${courseId}`);
      }
    };

    fetchNote();
  }, [noteId, router, courseId]);

  const autosave = async (updatedContent: string) => {
    try {
      await axiosInstance.put(`/notes/${noteId}`, { content: updatedContent });
    } catch (error) {
      console.error("Autosave failed:", error);
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);

    // Clear the existing timeout to prevent multiple save requests
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }

    // Set a new timeout to autosave after 1 second of inactivity
    setAutosaveTimeout(setTimeout(() => autosave(value), 1000));
  };

  const handleSaveAndRedirect = async () => {
    try {
      await axiosInstance.put(`/notes/${noteId}`, { content });
      alert("Note updated successfully!");
      router.push(`/courses/${courseId}`); // Redirect to CourseDetailsPage
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Note</h1>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // Ensure black text
          placeholder="Edit your note..."
        />
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleSaveAndRedirect}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
