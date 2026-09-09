import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const ADMIN_PATHS = ["/admin"];
const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/login"];
const CRON_PATHS = ["/api/cron"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // --- CRON endpoint authentication ---
  if (CRON_PATHS.some((p) => pathname.startsWith(p))) {
    const authHeader = request.headers.get("authorization");
    const expected = `Bearer ${process.env.CRON_SECRET}`;
    if (!authHeader || authHeader !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // --- Skip auth checks if Supabase is not configured (local dev) ---
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  // --- Supabase session refresh ---
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Admin route protection ---
  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminPath) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    // Verify admin role from database (not JWT, prevents privilege escalation)
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || !["admin", "super_admin"].includes(userData.role)) {
      const revokedUrl = request.nextUrl.clone();
      revokedUrl.pathname = "/";
      return NextResponse.redirect(revokedUrl);
    }
  }

  // --- Protected route (user dashboard) ---
  const isProtectedPath = PROTECTED_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  if (isProtectedPath && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // --- Redirect logged-in users away from auth pages ---
  const isAuthPath = AUTH_PATHS.some((p) => pathname === p);
  if (isAuthPath && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  // --- Security headers (supplement next.config.mjs) ---
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
