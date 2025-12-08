// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.png" // Use the path from the public folder
          alt="LegalAI Logo"
          width={40}  // Set desired size
          height={40} // Set desired size
          priority // Load eagerly
        />
        <span className="text-xl font-bold">LegalAI Chat</span>
      </Link>
      {/* Add any navigation links or user auth buttons here */}
    </header>
  );
}