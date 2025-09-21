import { z } from 'zod';

// Staff Onboarding Survey Schema
export const staffOnboardingSchema = z.object({
  role: z.string().min(1, "Please select your role"),
  digital_comfort: z.number().min(1, "Please rate your comfort level").max(5),
  current_tools: z.array(z.string()).min(1, "Please select at least one tool"),
  challenges: z.string().optional(),
  training_interests: z.array(z.string()).optional(),
  mobile_usage: z.string().min(1, "Please select your mobile usage frequency"),
  feedback: z.string().optional()
});

// App Feedback Survey Schema
export const appFeedbackSchema = z.object({
  user_type: z.string().min(1, "Please select how you use the app"),
  app_rating: z.number().min(1, "Please rate the app").max(5),
  favorite_features: z.array(z.string()).optional(),
  improvement_areas: z.array(z.string()).optional(),
  missing_features: z.string().optional(),
  technical_issues: z.string().optional(),
  recommendation: z.number().min(0, "Please provide a recommendation score").max(10)
});

// Generic Survey Schema for dynamic forms
export const genericSurveySchema = z.record(z.string(), z.any());

// Schema mapping for different survey categories
export const surveySchemas = {
  staff_onboarding: staffOnboardingSchema,
  app_feedback: appFeedbackSchema,
  community_engagement: genericSurveySchema,
  event_feedback: genericSurveySchema,
  general: genericSurveySchema
} as const;

// Type exports
export type StaffOnboardingForm = z.infer<typeof staffOnboardingSchema>;
export type AppFeedbackForm = z.infer<typeof appFeedbackSchema>;
export type GenericSurveyForm = z.infer<typeof genericSurveySchema>;

// Helper function to get schema for survey category
export function getSchemaForSurvey(category: string) {
  return surveySchemas[category as keyof typeof surveySchemas] || genericSurveySchema;
}

// Validation helper functions
export function validateSurveyResponse(category: string, data: unknown) {
  const schema = getSchemaForSurvey(category);
  return schema.safeParse(data);
}

// Field validation helpers
export const fieldValidators = {
  required: (message: string = "This field is required") => z.string().min(1, message),
  email: (message: string = "Please enter a valid email") => z.string().email(message),
  phone: (message: string = "Please enter a valid phone number") => z.string().regex(/^\+?[\d\s\-\(\)]+$/, message),
  url: (message: string = "Please enter a valid URL") => z.string().url(message),
  minLength: (min: number, message?: string) => z.string().min(min, message || `Must be at least ${min} characters`),
  maxLength: (max: number, message?: string) => z.string().max(max, message || `Must be no more than ${max} characters`),
  numberRange: (min: number, max: number, message?: string) => z.number().min(min).max(max, message || `Must be between ${min} and ${max}`),
  arrayMin: (min: number, message?: string) => z.array(z.string()).min(min, message || `Please select at least ${min} option${min > 1 ? 's' : ''}`)
};

// Custom validation messages
export const validationMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  url: "Please enter a valid URL",
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  numberRange: (min: number, max: number) => `Must be between ${min} and ${max}`,
  arrayMin: (min: number) => `Please select at least ${min} option${min > 1 ? 's' : ''}`,
  invalidFormat: "Invalid format",
  tooShort: "Too short",
  tooLong: "Too long",
  tooSmall: "Value too small",
  tooLarge: "Value too large"
};
