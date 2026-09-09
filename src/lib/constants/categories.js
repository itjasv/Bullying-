/**
 * Bullying report categories.
 */
export const CATEGORIES = {
  verbal: {
    label: "Verbal Bullying",
    description: "Name-calling, insults, threats, intimidation through words",
    icon: "MessageCircle",
  },
  physical: {
    label: "Physical Bullying",
    description: "Hitting, pushing, kicking, or any form of physical aggression",
    icon: "Shield",
  },
  cyber: {
    label: "Cyberbullying",
    description: "Online harassment, mean messages, sharing private info, social media abuse",
    icon: "Smartphone",
  },
  social: {
    label: "Social / Relational",
    description: "Exclusion, spreading rumors, damaging reputation, manipulation",
    icon: "Users",
  },
  sexual: {
    label: "Sexual Bullying",
    description: "Unwanted sexual comments, gestures, sharing inappropriate content",
    icon: "AlertTriangle",
  },
  other: {
    label: "Other",
    description: "Any other form of bullying not listed above",
    icon: "MoreHorizontal",
  },
};

/**
 * Severity levels.
 */
export const SEVERITIES = {
  low: {
    label: "Low",
    description: "Minor incident, first occurrence, no immediate threat",
    color: "severity-low",
  },
  medium: {
    label: "Medium",
    description: "Recurring behavior, causing distress, needs attention",
    color: "severity-medium",
  },
  high: {
    label: "High",
    description: "Serious incident, safety concern, urgent attention needed",
    color: "severity-high",
  },
  critical: {
    label: "Critical",
    description: "Immediate danger, threat to safety, requires instant action",
    color: "severity-critical",
  },
};

/**
 * Feedback categories.
 */
export const FEEDBACK_CATEGORIES = [
  { value: "ui_ux", label: "UI/UX Design" },
  { value: "report_process", label: "Report Process" },
  { value: "speed", label: "Speed & Performance" },
  { value: "communication", label: "Communication" },
  { value: "other", label: "Other" },
];
