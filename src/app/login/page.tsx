import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginContent from "./LoginContent";

export default async function LoginPage() {
  const session = await auth();

  // Redirect if already authenticated
  if (session?.user) {
    redirect("/");
  }

  return <LoginContent />;
}
