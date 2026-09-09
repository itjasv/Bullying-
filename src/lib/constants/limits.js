/**
 * Rate limits, file limits, and retention periods.
 * Central source of truth for all configurable limits.
 */

// ==================== Rate Limits ====================
export const RATE_LIMITS = {
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
  reportSubmission: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
  },
  tracking: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    lockoutMs: 60 * 60 * 1000, // 1 hour lockout after exceeding
  },
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },
  feedback: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 5,
  },
  message: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  },
};

// ==================== File Limits ====================
export const FILE_LIMITS = {
  maxFilesPerReport: 3,
  maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
  maxFileSizeMB: 5,
  allowedTypes: ["image/png", "image/jpeg", "image/webp"],
  compressionMaxDimension: 1920,
  compressionQuality: 0.85,
};

// ==================== Text Limits ====================
export const TEXT_LIMITS = {
  descriptionMin: 50,
  descriptionMax: 5000,
  messageMax: 2000,
  feedbackMax: 2000,
  noteMax: 5000,
  passphraseMin: 6,
  passphraseMax: 100,
  subjectMax: 200,
  contactMessageMax: 2000,
};

// ==================== Retention Periods ====================
export const RETENTION = {
  autoArchiveDays: 7, // Days after terminal status before auto-archive
  evidencePurgeDays: 30, // Days after archive before evidence files are deleted
  softDeleteDays: 30, // Days before soft-deleted reports are permanently removed
  localDraftTTLDays: 7, // Days before localStorage drafts expire
  anonymousSessionDays: 90, // Days before orphaned anonymous sessions are cleaned
  adminLogMonths: 12, // Months before admin logs are archived
  contactResolvedMonths: 6, // Months before resolved contacts are auto-deleted
};

// ==================== Pagination ====================
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
};

// ==================== Session ====================
export const SESSION = {
  adminInactivityTimeoutMs: 30 * 60 * 1000, // 30 minutes
};

// ==================== Email ====================
export const EMAIL = {
  digestWindowMs: 10 * 60 * 1000, // 10 minutes
  digestThreshold: 5, // Reports within window to trigger digest
  maxRetries: 2,
  retryDelays: [5000, 30000], // 5s, 30s
};

// ==================== Storage Thresholds ====================
export const STORAGE = {
  warningPercent: 80,
  blockPercent: 95,
};
