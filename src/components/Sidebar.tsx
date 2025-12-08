// src/components/Sidebar.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCommentDots } from 'react-icons/fa'; // Example icon for active chat
// import { BiLogOut } from 'react-icons/bi';      // Icon for logout
import LogoutButton from "@/components/LogoutButton";

export default function Sidebar() {
    return (
        // Sidebar Container: Fixed width, full height, subtle grey background, and a separator line
        <div className="flex flex-col h-screen w-64 bg-gray-50 p-4 border-r border-gray-200 shadow-md">
            
            {/* Branding/Title (Top Section) */}
            <Link href="/" className="flex flex-col items-center mb-8 text-2xl font-extrabold text-blue-800 transition duration-150 hover:text-blue-600">
                {/* Logo: Referenced from public/logo.png */}
                <Image
                  src="/logo.png"
                  alt="LegalAI Logo"
                  width={145} // Slightly larger logo
                  height={145}
                  priority 
                />
                <span className="mt-2">AgreyaBot</span>
            </Link>

            {/* Navigation Links (Main Area) */}
            <nav className="space-y-2">
                {/* Active Link Styling */}
                <Link href="/" className="flex items-center p-3 text-blue-700 bg-blue-100 font-semibold rounded-lg transition duration-150">
                    <FaRegCommentDots size={20} className="mr-3" />
                    Chat Assistant
                </Link>
                {/* You can add other links here */}
            </nav>

            {/* Logout (Pushed to the bottom using mt-auto) */}
            <div className="mt-auto pt-4 border-t border-gray-200 w-full"> 
                {/* Render the LogoutButton, passing the styling prop */}
                <LogoutButton isSidebar={true} /> 
            </div>
        </div>
    );
}