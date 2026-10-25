import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(80),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  phone: z.string().trim().optional().or(z.literal('')),
  college_or_org: z.string().trim().optional().or(z.literal('')),
});

export const registrationSchema = z.object({
  name: z.string().trim().min(3, 'Team name must have at least 3 characters').max(60),
  track_id: z.string().min(1, 'Please select a competition track'),
  college_or_org: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required').max(60),
  state: z.string().trim().min(2, 'State is required').max(60),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
  leader_name: z.string().trim().min(2, 'Leader name must have at least 2 characters').max(80),
  leader_email: z.string().trim().toLowerCase().email('Invalid leader email address'),
  leader_phone: z.string().trim().min(10, 'Valid 10-digit phone number is required').max(15),
  members: z.array(teamMemberSchema).max(5, 'Maximum 5 additional members allowed (Total team size: 1-6)'),
  acceptedPolicies: z.literal(true, {
    error: 'You must accept the official rules, privacy policy, and terms.',
  }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const isSafePublicHttpUrl = (val: string | undefined | null): boolean => {
  if (!val || val === '') return true;
  try {
    const parsed = new URL(val);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const hostname = parsed.hostname.toLowerCase();
    // Block loopback, link-local, private IP ranges, and internal metadata services
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '169.254.169.254' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const submissionSchema = z.object({
  title: z.string().trim().min(3, 'Project title must have at least 3 characters').max(100),
  track_id: z.string().min(1, 'Track is required'),
  problem_statement: z.string().trim().min(20, 'Please articulate the problem in at least 20 characters').max(3000),
  solution_overview: z.string().trim().min(30, 'Please describe your solution in at least 30 characters').max(5000),
  description: z.string().trim().min(30, 'Please provide an in-depth project description').max(8000),
  tech_stack: z
    .array(z.string().trim().max(50))
    .min(1, 'Please specify at least one core technology')
    .max(20, 'Maximum 20 technologies allowed'),
  github_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (url) => !url || (isSafePublicHttpUrl(url) && /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(url)),
      'Must be a valid public GitHub repository URL (e.g. https://github.com/owner/repo)'
    ),
  live_demo_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(isSafePublicHttpUrl, 'Must be a valid public HTTP or HTTPS URL'),
  demo_video_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(isSafePublicHttpUrl, 'Must be a valid public HTTP or HTTPS URL'),
  presentation_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(isSafePublicHttpUrl, 'Must be a valid public HTTP or HTTPS URL'),
  member_contributions: z.string().trim().max(2000).optional().or(z.literal('')),
  ai_tool_disclosure: z.string().trim().max(2000).optional().or(z.literal('')),
  isDraft: z.boolean().default(false),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;

export const judgingScoreSchema = z.object({
  assignmentId: z.string().min(1),
  scores: z
    .array(
      z.object({
        criterionId: z.string().max(100),
        score: z.number().min(0).max(10),
      })
    )
    .max(50, 'Maximum 50 scoring criteria allowed'),
  feedback: z.string().max(3000).optional().or(z.literal('')),
  internalNotes: z.string().max(3000).optional().or(z.literal('')),
  isLocked: z.boolean().default(false),
});
