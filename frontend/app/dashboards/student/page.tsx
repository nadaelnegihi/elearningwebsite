"use client";
import Sidebar from "@/app/components/sidebar";
import UserProfile from "@/app/components/userprofile";
import SearchBar from "@/app/components/searchbar";// Import the SearchBar component

export default function StudentDashboard() {
  return (
    <div className="relative flex bg-gray-900 text-white h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-6">
        {/* SearchBar */}
        <SearchBar />

        {/* UserProfile */}
        <div className="mt-8"> {/* Add margin to move UserProfile down */}
          <UserProfile
            roleBasedContent={
              <div>
                <h2 className="text-xl font-semibold">Student Dashboard</h2>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
