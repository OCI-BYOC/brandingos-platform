import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import JobsClient from "./_components/JobsClient"

export default async function JobsPage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")
  return <JobsClient />
}
