import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * CRON: Auto-archive reports 7 days after reaching terminal status.
 * Marks reports as archived and disables messaging.
 * Protected by CRON_SECRET in middleware.
 */
export async function POST() {
  try {
    const supabase = createAdminClient();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    // Find terminal-status reports older than 7 days that aren't archived
    const { data: reports, error } = await supabase
      .from("reports")
      .select("id, report_id, status")
      .in("status", ["resolved", "closed", "dismissed"])
      .eq("is_archived", false)
      .lt("updated_at", cutoff.toISOString());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!reports || reports.length === 0) {
      return NextResponse.json({ archived: 0, message: "No reports to archive" });
    }

    const ids = reports.map((r) => r.id);

    const { error: updateError } = await supabase
      .from("reports")
      .update({
        is_archived: true,
        archived_at: new Date().toISOString(),
      })
      .in("id", ids);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      archived: reports.length,
      report_ids: reports.map((r) => r.report_id),
      message: `Archived ${reports.length} reports`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Archive failed: " + error.message }, { status: 500 });
  }
}
