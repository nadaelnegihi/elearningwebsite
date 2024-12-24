"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export default function UploadMediaPage() {
  const { moduleId, courseId } = useParams(); // Module ID and Course ID from URL
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !contentType || !title) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("contentType", contentType);
    formData.append("title", title);

    try {
      setLoading(true);
      await axiosInstance.post(`/modules/upload/${moduleId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Media uploaded successfully!");
      router.push(`/courses/${courseId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload media.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleFileUpload} className="bg-gray-800 p-6 rounded shadow-lg text-white w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Upload Media</h1>
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
          <label className="block mb-2">Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700"
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 rounded bg-gray-700"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 rounded hover:bg-blue-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}
