import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardShell from "./_components/DashboardShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  return (
    <DashboardShell
      user={{
        firstName: user.firstName ?? "",
        email: user.emailAddresses[0]?.emailAddress ?? "",
        imageUrl: user.imageUrl,
      }}
    >
      {children}
    </DashboardShell>
  )
}
