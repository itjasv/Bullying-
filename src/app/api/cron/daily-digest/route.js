import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyDailyDigest } from "@/lib/email";

/**
 * CRON: Send daily digest email to super admins.
 * Summarizes new reports, pending reviews, critical cases, and resolutions.
 * Run daily at 06:00 UTC (11:30 AM IST).
 */
export async function POST() {
  try {
    const supabase = createAdminClient();
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // New reports in last 24h
    const { count: newReports } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday.toISOString())
      .eq("is_deleted", false);

    // Pending review
    const { count: pendingReview } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .in("status", ["submitted", "received"])
      .eq("is_deleted", false);

    // Critical
    const { count: critical } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("severity", "critical")
      .not("status", "in", "(resolved,closed,dismissed)")
      .eq("is_deleted", false);

    // Resolved in last 24h
    const { count: resolved } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved")
      .gte("updated_at", yesterday.toISOString())
      .eq("is_deleted", false);

    const stats = {
      newReports: newReports || 0,
      pendingReview: pendingReview || 0,
      critical: critical || 0,
      resolved: resolved || 0,
    };

    await notifyDailyDigest(stats);

    return NextResponse.json({ sent: true, stats });
  } catch (error) {
    return NextResponse.json({ error: "Digest failed: " + error.message }, { status: 500 });
  }
}
