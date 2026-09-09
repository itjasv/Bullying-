import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * CRON: Clean up soft-deleted reports older than 90 days.
 * Permanently removes report data and associated evidence, messages, status history.
 * Run weekly.
 */
export async function POST() {
  try {
    const supabase = createAdminClient();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    // Find soft-deleted reports older than 90 days
    const { data: reports } = await supabase
      .from("reports")
      .select("id")
      .eq("is_deleted", true)
      .lt("updated_at", cutoff.toISOString());

    if (!reports || reports.length === 0) {
      return NextResponse.json({ cleaned: 0, message: "No soft-deleted reports to clean" });
    }

    const ids = reports.map((r) => r.id);

    // Delete related data
    await supabase.from("evidence").delete().in("report_id", ids);
    await supabase.from("messages").delete().in("report_id", ids);
    await supabase.from("status_history").delete().in("report_id", ids);
    await supabase.from("admin_notes").delete().in("report_id", ids);

    // Delete reports
    await supabase.from("reports").delete().in("id", ids);

    return NextResponse.json({
      cleaned: reports.length,
      message: `Permanently deleted ${reports.length} soft-deleted reports`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Cleanup failed: " + error.message }, { status: 500 });
  }
}
