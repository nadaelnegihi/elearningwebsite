"use client";

import Sidebar from "@/app/components/sidebar";
import UserProfile from "@/app/components/userprofile";
import SearchBar from "@/app/components/searchbar";
import ViewAllUsersButton from "@/app/components/allusersbutton";

export default function AdminDashboard() {
  return (
    <div className="relative flex bg-gray-900 text-white h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-6">
        {/* SearchBar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* UserProfile and View All Users Button */}
        <div className="flex items-center mt-8">
          {/* UserProfile */}
          <div className="flex items-center">
            <UserProfile
              roleBasedContent={
                <div>
                  <h2 className="text-xl font-semibold">Admin Dashboard</h2>
                </div>
              }
            />
          </div>

          {/* View All Users Button */}
          <div className="ml-6">
            <ViewAllUsersButton href="/users/allusers" />
          </div>
        </div>
      </div>
    </div>
  );
}
