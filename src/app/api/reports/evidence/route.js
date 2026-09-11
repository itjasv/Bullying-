import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MAX_SIZES = {
  image: 5 * 1024 * 1024,   // 5 MB
  video: 25 * 1024 * 1024,  // 25 MB
  audio: 10 * 1024 * 1024,  // 10 MB
};

function getMediaType(mimeType) {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "image";
}

/**
 * POST /api/reports/evidence
 * Accepts multipart/form-data with `report_id` and one or more `files`.
 * Uploads to Supabase Storage bucket `evidence` and creates rows in `evidence` table.
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const reportId = formData.get("report_id");
    const files = formData.getAll("files");

    if (!reportId) {
      return NextResponse.json({ error: "Missing report_id" }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: "Maximum 5 evidence files allowed" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verify report exists
    const { data: report, error: reportErr } = await supabase
      .from("reports")
      .select("id, report_id")
      .eq("id", reportId)
      .single();

    if (reportErr || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const uploaded = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const mediaType = getMediaType(file.type);
      const maxSize = MAX_SIZES[mediaType] || MAX_SIZES.image;

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `${file.name} exceeds max size of ${maxSize / (1024 * 1024)}MB for ${mediaType}` },
          { status: 400 }
        );
      }

      // Safe filename: <report_id>/<timestamp>_<random>.<ext>
      const originalName = file.name || "evidence";
      const ext = originalName.includes(".") ? originalName.split(".").pop().toLowerCase() : "dat";
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const storagePath = `${report.report_id}/${Date.now()}_${randomSuffix}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("evidence")
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return NextResponse.json(
          { error: `Failed to upload ${file.name}: ${uploadError.message}` },
          { status: 500 }
        );
      }

      // Insert into evidence table
      const { data: evRow, error: insertError } = await supabase
        .from("evidence")
        .insert({
          report_id: report.id,
          file_url: storagePath,
          file_name: storagePath.split("/").pop(),
          file_type: file.type || "application/octet-stream",
          media_type: mediaType,
          file_size_bytes: file.size,
          original_file_name: originalName,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Evidence row insert error:", insertError);
      } else {
        uploaded.push(evRow);
      }
    }

    return NextResponse.json({
      success: true,
      uploadedCount: uploaded.length,
      evidence: uploaded,
    });
  } catch (error) {
    console.error("Evidence upload route error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
