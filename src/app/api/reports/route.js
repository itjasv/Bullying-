import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { reportSubmissionSchema } from "@/lib/utils/validators";
import { generateReportId } from "@/lib/utils/generateReportId";
import { hashPassphrase } from "@/lib/utils/hashPassphrase";
import { notifyNewReport } from "@/lib/email";
import { rateLimit, getClientIP } from "@/lib/utils/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIP(request);
    const { limited } = rateLimit(`report:${ip}`, { windowMs: 3600000, max: 5 });
    if (limited) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const body = await request.json();

    // Honeypot check
    if (body._hp_field) {
      return NextResponse.json({ report_id: "RPT-0000-000000000000" }, { status: 201 });
    }

    // Validate input
    const result = reportSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Get current user (may be anonymous)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Generate unique report ID
    const reportId = generateReportId();

    // Hash the security passphrase
    const hashedPassphrase = await hashPassphrase(data.passphrase);

    // Use admin client for insert (bypasses RLS for anonymous users)
    const adminClient = createAdminClient();

    // Check idempotency — reject duplicates
    const { data: existing } = await adminClient
      .from("reports")
      .select("report_id")
      .eq("idempotency_key", data.idempotency_key)
      .single();

    if (existing) {
      return NextResponse.json(
        { report_id: existing.report_id, duplicate: true },
        { status: 200 }
      );
    }

    // Insert the report
    const { data: report, error: reportError } = await adminClient
      .from("reports")
      .insert({
        report_id: reportId,
        user_id: user?.id || null,
        submitted_by: user?.id || null,
        idempotency_key: data.idempotency_key,
        security_passphrase: hashedPassphrase,
        type: data.type,
        severity: data.severity,
        status: "submitted",
        description: data.description,
        location: data.location || null,
        involved_parties: data.involved_parties || null,
        witness_info: data.witness_info || null,
        incident_date: data.incident_date || null,
        is_anonymous: data.is_anonymous,
      })
      .select("id, report_id")
      .single();

    if (reportError) {
      console.error("Report insert error:", reportError);
      return NextResponse.json(
        { error: "Failed to submit report" },
        { status: 500 }
      );
    }

    // Insert initial status history
    await adminClient.from("status_history").insert({
      report_id: report.id,
      changed_by: user?.id || null,
      old_status: null,
      new_status: "submitted",
      note: "Report submitted",
    });

    // Notify admins (non-blocking, fails silently)
    notifyNewReport(report.report_id, data.type, data.severity).catch(() => {});

    return NextResponse.json(
      { report_id: report.report_id, id: report.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Report submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
