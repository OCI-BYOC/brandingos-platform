import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import LandingPage from "./_landing/LandingPage"

export default async function HomePage() {
  const user = await currentUser()
  if (user) redirect("/dashboard")
  return <LandingPage />
}
