// src/components/LogoutButton.tsx
"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton({ isSidebar = false }: { isSidebar?: boolean }) {
  // Define the base classes and the sidebar-specific overrides
  const baseClasses = "flex items-center gap-2 transition";
  
  const sidebarClasses = isSidebar
    ? "w-full p-3 font-medium hover:bg-red-100 hover:text-red-600 rounded-lg text-gray-600"
    : "text-gray-600 hover:text-red-600"; // Original minimalist style

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      // Combine base and specific classes
      className={`${baseClasses} ${sidebarClasses}`}
      title="Logout"
    >
      {/* Ensure the icon is visible and formatted consistently */}
      <LogOut className="w-5 h-5 mr-1" /> 
      
      {/* Always show text when in sidebar, otherwise follow original logic */}
      <span className={isSidebar ? "inline" : "hidden sm:inline"}>
        Logout
      </span>
    </button>
  );
}
