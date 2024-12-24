"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export default function AddNotePage() {
  const { courseId, moduleId } = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [autosaveTimeout, setAutosaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const autosave = async (updatedContent: string) => {
    try {
      await axiosInstance.post("/notes", {
        moduleId,
        content: updatedContent,
      });
    } catch (error) {
      console.error("Failed to autosave note:", error);
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
      await axiosInstance.post("/notes", {
        moduleId,
        content,
      });
      alert("Note added successfully!");
      router.push(`/courses/${courseId}`); // Redirect to CourseDetailsPage
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to add note. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Add Note</h1>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Write your note here..."
        />
        <div className="mt-4">
          <button
            onClick={handleSaveAndRedirect}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Save and Finish
          </button>
        </div>
      </div>
    </div>
  );
}
