"use client";

import Link from "next/link";

interface ViewAllUsersButtonProps {
  href: string;
}

export default function ViewAllUsersButton({ href }: ViewAllUsersButtonProps) {
  return (
    <Link
      href={href}
      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-500 transition"
    >
      View All Users
    </Link>
  );
}
