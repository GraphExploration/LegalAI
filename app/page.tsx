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
      <div className="h-full w-full bg-gray-100">


      <main className="h-full">
        <Chat />
      </main>
    </div>
  );
}