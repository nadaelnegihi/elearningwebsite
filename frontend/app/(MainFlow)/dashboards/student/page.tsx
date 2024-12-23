"use client";
import UserProfile from "@/app/components/userprofile";

export default function StudentDashboard() {
  return (
    <div className="mt-8"> {/* Add margin to move UserProfile down */}
      <UserProfile
        roleBasedContent={
          <div>
            <h2 className="text-xl font-semibold">Student Dashboard</h2>
          </div>
        }
      />
    </div>
  );
}
