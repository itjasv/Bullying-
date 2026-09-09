import { z } from "zod";

// ==================== Report Form Schemas ====================

export const incidentTypeSchema = z.object({
  type: z.enum(["verbal", "physical", "cyber", "social", "sexual", "other"], {
    required_error: "Please select an incident type",
  }),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Please select a severity level",
  }),
});

export const incidentDetailsSchema = z.object({
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be under 5000 characters"),
  location: z.string().max(500).optional().or(z.literal("")),
  incident_date: z.string().optional().or(z.literal("")),
  involved_parties: z.string().max(1000).optional().or(z.literal("")),
  witness_info: z.string().max(1000).optional().or(z.literal("")),
});

export const securitySchema = z.object({
  passphrase: z
    .string()
    .min(6, "Passphrase must be at least 6 characters")
    .max(100, "Passphrase must be under 100 characters"),
  confirm_passphrase: z.string(),
}).refine((data) => data.passphrase === data.confirm_passphrase, {
  message: "Passphrases do not match",
  path: ["confirm_passphrase"],
});

// Full report submission schema (server-side validation)
export const reportSubmissionSchema = z.object({
  type: z.enum(["verbal", "physical", "cyber", "social", "sexual", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().min(50).max(5000),
  location: z.string().max(500).optional().or(z.literal("")),
  incident_date: z.string().optional().or(z.literal("")),
  involved_parties: z.string().max(1000).optional().or(z.literal("")),
  witness_info: z.string().max(1000).optional().or(z.literal("")),
  passphrase: z.string().min(6).max(100),
  is_anonymous: z.boolean().default(true),
  idempotency_key: z.string().uuid("Invalid submission key"),
});

// ==================== Tracking Schema ====================

export const trackReportSchema = z.object({
  report_id: z
    .string()
    .min(1, "Report ID is required")
    .transform((val) => val.trim()),
  passphrase: z.string().min(1, "Passphrase is required"),
});

// ==================== Contact Form Schema ====================

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  honeypot: z.string().max(0, "Invalid submission").optional(),
});

// ==================== Feedback Schema ====================

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  category: z
    .enum(["ui_ux", "report_process", "speed", "communication", "other"])
    .optional(),
  message: z.string().max(2000, "Feedback must be under 2000 characters").optional(),
  honeypot: z.string().max(0, "Invalid submission").optional(),
});

// ==================== Message Schema ====================

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be under 2000 characters"),
  report_id: z.string().uuid(),
});

// ==================== Admin: Status Update Schema ====================

export const statusUpdateSchema = z.object({
  status: z.enum([
    "submitted",
    "received",
    "under_review",
    "investigation",
    "action_taken",
    "resolved",
    "closed",
    "dismissed",
  ]),
  note: z
    .string()
    .min(5, "Note must be at least 5 characters explaining the status change")
    .max(2000),
});

// ==================== Admin: Note Schema ====================

export const adminNoteSchema = z.object({
  content: z
    .string()
    .min(1, "Note cannot be empty")
    .max(5000, "Note must be under 5000 characters"),
  visibility: z.enum(["internal", "public"]).default("internal"),
});
