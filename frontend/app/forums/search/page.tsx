"use client";

import React, { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";

const ForumSearchPage = () => {
  const [query, setQuery] = useState<string>(""); // Search query
  const [results, setResults] = useState<any[]>([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/forums/threads/search?query=${encodeURIComponent(query)}`
      );
      setResults(response.data); // Update search results
    } catch (error: any) {
      console.error("Error searching forums:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to search forums.");
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (forumId: string) => {
    router.push(`/forums/${forumId}`); // Navigate to the selected forum
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Search Forums</h1>

        {/* Search Input */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10">
          <input
            type="text"
            placeholder="Enter search term..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white mb-4"
          />
          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {loading && <p className="text-center text-gray-400">Searching forums...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleResultClick(result.id)}
                >
                  <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {result.content.length > 100
                      ? result.content.slice(0, 100) + "..."
                      : result.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    By {result.creator} on {new Date(result.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && !error && results.length === 0 && query.trim() && (
          <p className="text-center text-gray-400">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default ForumSearchPage;

