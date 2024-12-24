"use client";

import UserProfile from "@/app/components/userprofile";
import SearchBar from "@/app/components/searchbar";

export default function AdminDashboard() {
  return (
    <div className="relative flex bg-gray-900 text-white h-screen">
      {/* Main content */}
      <div className="flex-grow p-6">
        {/* SearchBar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* UserProfile */}
        <div className="flex items-center mt-8">
          <div className="flex items-center">
            <UserProfile
              roleBasedContent={
                <div>
                  <h2 className="text-xl font-semibold">Admin Dashboard</h2>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}