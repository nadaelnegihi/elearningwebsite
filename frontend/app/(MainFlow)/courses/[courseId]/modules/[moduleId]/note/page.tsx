"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

interface Note {
  noteId: string;
  content: string;
  lastUpdated: string;
}

export default function NotesPage() {
  const { courseId, moduleId } = useParams();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get(`/notes`);
        setNotes(response.data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleDeleteNote = async (noteId: string) => {
    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      setNotes((prev) => prev.filter((note) => note.noteId !== noteId));
      alert("Note deleted successfully.");
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Your Notes</h1>
        <ul>
          {notes.map((note) => (
            <li
              key={note.noteId}
              className="flex justify-between items-center mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              <div>
                <p className="text-gray-800 dark:text-gray-200">{note.content}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {new Date(note.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}/note/${note.noteId}/edit`)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteNote(note.noteId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
