import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";
import LogoutButton from "@/components/LogoutButton";


export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Not logged in → redirect to login page
    redirect("/login");
  }

  // Logged in → show chat UI
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 text-center font-semibold text-gray-800">
        ⚖️ LegalAI Chat Assistant
      </header>
      <LogoutButton />

      <main className="max-w-3xl mx-auto py-6">
        <Chat />
      </main>
    </div>
  );
}