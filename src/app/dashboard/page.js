import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard - RagRaksha",
  description: "Manage your reports and account settings.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const { data: userReports } = await supabase
    .from("reports")
    .select("id, report_id, type, severity, status, created_at, updated_at, description")
    .eq("submitted_by", authUser.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(20);

  return <DashboardClient initialUser={userData} initialReports={userReports || []} />;
}
