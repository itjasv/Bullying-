import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * CRON: Purge evidence files 30 days after case resolution.
 * Deletes files from storage and marks evidence records as purged.
 * Protected by CRON_SECRET in middleware.
 */
export async function POST() {
  try {
    const supabase = createAdminClient();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    // Find resolved/closed/dismissed reports older than 30 days with unpurged evidence
    const { data: reports } = await supabase
      .from("reports")
      .select("id")
      .in("status", ["resolved", "closed", "dismissed"])
      .lt("updated_at", cutoff.toISOString())
      .is("evidence_purged_at", null);

    if (!reports || reports.length === 0) {
      return NextResponse.json({ purged: 0, message: "No evidence to purge" });
    }

    let totalPurged = 0;

    for (const report of reports) {
      // Get evidence files for this report
      const { data: evidence } = await supabase
        .from("evidence")
        .select("id, file_url")
        .eq("report_id", report.id)
        .eq("is_purged", false);

      if (evidence && evidence.length > 0) {
        // Delete files from storage
        const filePaths = evidence.map((e) => e.file_url);
        await supabase.storage.from("evidence").remove(filePaths);

        // Mark evidence as purged
        const evidenceIds = evidence.map((e) => e.id);
        await supabase
          .from("evidence")
          .update({ is_purged: true, purged_at: new Date().toISOString() })
          .in("id", evidenceIds);

        totalPurged += evidence.length;
      }

      // Mark report as evidence purged
      await supabase
        .from("reports")
        .update({ evidence_purged_at: new Date().toISOString() })
        .eq("id", report.id);
    }

    return NextResponse.json({
      purged: totalPurged,
      reports_processed: reports.length,
      message: `Purged ${totalPurged} evidence files from ${reports.length} reports`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Purge failed: " + error.message }, { status: 500 });
  }
}
