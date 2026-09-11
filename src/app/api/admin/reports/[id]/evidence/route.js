import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
    }

    // Verify authenticated admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Verify role in database
    const { data: userData } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || !["admin", "super_admin"].includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Resolve report UUID (id might be public report_id like RPT-... or UUID)
    let reportUUID = id;
    if (id.startsWith("RPT-")) {
      const { data: rep } = await adminClient
        .from("reports")
        .select("id")
        .eq("report_id", id)
        .single();
      if (rep) reportUUID = rep.id;
    }

    // Fetch evidence records
    const { data: evidenceList, error: evError } = await adminClient
      .from("evidence")
      .select("*")
      .eq("report_id", reportUUID)
      .order("uploaded_at", { ascending: true });

    if (evError) {
      return NextResponse.json({ error: evError.message }, { status: 500 });
    }

    // Generate signed URLs for active evidence
    const evidenceWithUrls = await Promise.all(
      (evidenceList || []).map(async (item) => {
        if (item.is_purged) {
          return { ...item, signed_url: null, purged: true };
        }

        const { data: signedData, error: signError } = await adminClient.storage
          .from("evidence")
          .createSignedUrl(item.file_url, 3600); // 1 hour access

        return {
          ...item,
          signed_url: signError ? null : signedData?.signedUrl,
        };
      })
    );

    return NextResponse.json({ evidence: evidenceWithUrls });
  } catch (error) {
    console.error("Fetch evidence error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
