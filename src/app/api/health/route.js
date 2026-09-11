import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Health Check & Keep-Alive Endpoint
 * Pings Supabase to prevent free-tier auto-pause after 7 days of inactivity.
 * Public GET endpoint - safe for external uptime monitors and GitHub Actions.
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    // If Supabase credentials are configured, execute a lightweight query to touch the DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("reports").select("id").limit(1);

      if (error) {
        return NextResponse.json(
          {
            status: "degraded",
            app: "RagRaksha",
            supabase: "error",
            error: error.message,
            timestamp,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      status: "ok",
      app: "RagRaksha",
      supabase: "active",
      timestamp,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        app: "RagRaksha",
        message: error.message,
        timestamp,
      },
      { status: 500 }
    );
  }
}
