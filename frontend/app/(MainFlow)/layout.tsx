import { UserDataProvider } from "../__context";
import SearchBar from "../components/searchbar";
import Sidebar from "../components/sidebar";
import { getRole } from "@/app/lib/functions";

export default async function MainFlowLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const role = await getRole()

    return (
        <UserDataProvider role={role}>
            <div className="relative flex bg-gray-900 text-white h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <div className="flex-grow p-6 pl-16 pt-16">
                    {/* SearchBar */}
                    <SearchBar />

                    {children}
                </div>
            </div>
        </UserDataProvider>
    );
}
