import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackReportSchema } from "@/lib/utils/validators";
import { verifyPassphrase } from "@/lib/utils/hashPassphrase";
import { rateLimit, getClientIP } from "@/lib/utils/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIP(request);
    const { limited } = rateLimit(`track:${ip}`, { windowMs: 3600000, max: 5 });
    if (limited) {
      return NextResponse.json({ error: "Too many attempts. Please try again in one hour." }, { status: 429 });
    }

    const body = await request.json();

    // Validate input
    const result = trackReportSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Please provide a valid Report ID and passphrase" },
        { status: 400 }
      );
    }

    const { report_id, passphrase } = result.data;

    const adminClient = createAdminClient();

    // Find report by ID
    const { data: report, error } = await adminClient
      .from("reports")
      .select(`
        id,
        report_id,
        type,
        severity,
        status,
        description,
        location,
        incident_date,
        is_anonymous,
        is_archived,
        is_withdrawn,
        is_flagged,
        estimated_resolution,
        evidence_purged_at,
        security_passphrase,
        created_at,
        updated_at
      `)
      .eq("report_id", report_id)
      .eq("is_deleted", false)
      .single();

    if (error || !report) {
      return NextResponse.json(
        { error: "Invalid Report ID or passphrase" },
        { status: 404 }
      );
    }

    // Verify passphrase
    const isValid = await verifyPassphrase(passphrase, report.security_passphrase);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Report ID or passphrase" },
        { status: 404 }
      );
    }

    // Fetch status history
    const { data: statusHistory } = await adminClient
      .from("status_history")
      .select("id, old_status, new_status, note, changed_at")
      .eq("report_id", report.id)
      .order("changed_at", { ascending: true });

    // Fetch public admin notes
    const { data: publicNotes } = await adminClient
      .from("admin_notes")
      .select("id, content, created_at")
      .eq("report_id", report.id)
      .eq("visibility", "public")
      .order("created_at", { ascending: true });

    // Fetch messages
    const { data: messages } = await adminClient
      .from("messages")
      .select("id, sender_role, sender_name, content, is_read, created_at")
      .eq("report_id", report.id)
      .order("created_at", { ascending: true });

    // Remove security_passphrase from response
    const { security_passphrase: _, ...safeReport } = report;

    return NextResponse.json({
      report: safeReport,
      status_history: statusHistory || [],
      public_notes: publicNotes || [],
      messages: messages || [],
    });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
