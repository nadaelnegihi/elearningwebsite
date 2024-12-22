// components/Layout.tsx
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <nav className="flex-grow">
          <Link href="/dashboard">
            <a className="block p-4 hover:bg-gray-700">Dashboard</a>
          </Link>
          <Link href="/dashboard/courses">
            <a className="block p-4 hover:bg-gray-700">Courses</a>
          </Link>
        </nav>
        <footer className="p-4">Logged in as: User</footer>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 p-8">{children}</main>
    </div>
  );
}
