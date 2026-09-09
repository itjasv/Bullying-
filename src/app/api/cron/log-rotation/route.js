import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * CRON: Rotate admin logs older than 6 months.
 * Deletes old log entries to prevent unbounded table growth.
 * Run monthly.
 */
export async function POST() {
  try {
    const supabase = createAdminClient();
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);

    const { data, error } = await supabase
      .from("admin_logs")
      .delete()
      .lt("created_at", cutoff.toISOString())
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      rotated: data?.length || 0,
      message: `Rotated ${data?.length || 0} log entries older than 6 months`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Log rotation failed: " + error.message }, { status: 500 });
  }
}
