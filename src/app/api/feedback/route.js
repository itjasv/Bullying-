import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIP } from "@/lib/utils/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIP(request);
    const { limited } = rateLimit(`feedback:${ip}`, { windowMs: 86400000, max: 5 });
    if (limited) {
      return NextResponse.json({ error: "Feedback limit reached. Try again tomorrow." }, { status: 429 });
    }

    const body = await request.json();
    if (body._hp_field) return NextResponse.json({ success: true }, { status: 201 });

    const { rating, category, comment } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("feedback").insert({
      rating: Math.round(rating),
      category: category?.slice(0, 50) || null,
      comment: comment?.slice(0, 2000) || null,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Thank you for your feedback" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
