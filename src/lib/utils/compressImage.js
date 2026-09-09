import imageCompression from "browser-image-compression";

/**
 * Compress an image file client-side before upload.
 * Resizes to max 1920px dimension and converts to WebP.
 *
 * @param {File} file - The original image file
 * @returns {Promise<File>} The compressed WebP file
 * @throws {Error} If compressed file is still over 5MB
 */
export async function compressImage(file) {
  const options = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  };

  const compressedBlob = await imageCompression(file, options);

  // Safety check: reject if still over 5MB after compression
  if (compressedBlob.size > 5 * 1024 * 1024) {
    throw new Error("Image too large even after optimization. Please use a smaller image.");
  }

  // Convert blob to File with proper name and type
  const compressedName = file.name.replace(/\.[^/.]+$/, ".webp");
  return new File([compressedBlob], compressedName, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

/**
 * Validate file type before compression.
 * @param {File} file
 * @returns {boolean}
 */
export function isValidImageType(file) {
  const allowed = ["image/png", "image/jpeg", "image/webp"];
  return allowed.includes(file.type);
}

/**
 * Maximum number of evidence files per report.
 */
export const MAX_EVIDENCE_FILES = 3;

/**
 * Maximum file size in bytes (5MB).
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
