"use client";
import UserProfile from "@/app/components/userprofile";

export default function InstructorDashboard() {
  return (
    <div className="mt-8">
      <UserProfile
        roleBasedContent={
          <div>
            <h2 className="text-xl font-semibold">Instructor Dashboard</h2>
          </div>
        }
      />
    </div>
  );
}
