import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIP } from "@/lib/utils/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIP(request);
    const { limited } = rateLimit(`contact:${ip}`, { windowMs: 3600000, max: 3 });
    if (limited) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    if (body._hp_field) return NextResponse.json({ success: true }, { status: 201 });

    const { name, email, subject, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 200),
      subject: subject?.trim().slice(0, 200) || null,
      message: message.trim().slice(0, 5000),
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message received. We will get back to you." });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
