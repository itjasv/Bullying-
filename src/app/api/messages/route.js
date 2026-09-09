import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { messageSchema } from "@/lib/utils/validators";

export async function POST(request) {
  try {
    const body = await request.json();

    const result = messageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const { content, report_id } = result.data;
    const adminClient = createAdminClient();

    // Check report exists and is not archived
    const { data: report } = await adminClient
      .from("reports")
      .select("id, is_archived, is_deleted")
      .eq("id", report_id)
      .single();

    if (!report || report.is_deleted) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.is_archived) {
      return NextResponse.json(
        { error: "This case is closed. No further messages can be sent." },
        { status: 403 }
      );
    }

    const { data: message, error } = await adminClient
      .from("messages")
      .insert({
        report_id,
        sender_role: "reporter",
        sender_name: "Reporter",
        content,
      })
      .select("id, sender_role, sender_name, content, created_at")
      .single();

    if (error) {
      console.error("Message insert error:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("Message error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
