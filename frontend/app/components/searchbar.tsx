"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!query) return;
    setIsLoading(true);
    // Redirect to the search results page with the query as a parameter
    router.push(`/search/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 shadow-md fixed top-0 left-[72px] right-0 z-10">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search for courses, students, or instructors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
