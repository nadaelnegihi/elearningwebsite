"use client";

import React, { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";

const ForumSearchPage = () => {
  const [query, setQuery] = useState<string>(""); // Search query
  const [results, setResults] = useState<any[]>([]); // Search results
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      const response = await axiosInstance.get(`/forums/threads/search?query=${encodeURIComponent(query)}`);
      setResults(response.data); // Update search results
    } catch (error: any) {
      console.error("Error searching forums:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to search forums.");
    }
  };

  const handleResultClick = (forumId: string) => {
    router.push(`/forums/${forumId}`); // Navigate to the selected forum
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Forums</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter search term..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Search
        </button>
      </div>

      {/* Display Search Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Search Results</h2>
          <ul className="space-y-4">
            {results.map((result) => (
              <li
                key={result.id}
                className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => handleResultClick(result.id)}
              >
                <h3 className="font-bold">{result.title}</h3>
                <p>{result.content}</p>
                <p className="text-sm text-gray-500">
                  By {result.creator} on {new Date(result.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ForumSearchPage;
