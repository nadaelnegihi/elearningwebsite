"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserDetailsPage() {
  const { userId } = useParams(); // Extract the userId from the dynamic route
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        router.push("/404"); // Redirect to 404 if the user is not found
      }
    };

    fetchUserDetails();
  }, [userId, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
