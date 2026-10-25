const REQUIRED_PRODUCTION_VARIABLES = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  'RAZORPAY_WEBHOOK_SECRET',
  'ADMIN_EMAILS',
  'APP_SECRET',
  'NEXT_PUBLIC_SITE_URL',
] as const;

function isPlaceholder(value: string): boolean {
  return /placeholder|replace_with|your[-_]/i.test(value);
}

export function getProductionEnvironmentIssues(
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const issues: string[] = [];

  for (const key of REQUIRED_PRODUCTION_VARIABLES) {
    const value = env[key]?.trim();
    if (!value) {
      issues.push(`${key} is missing`);
    } else if (isPlaceholder(value)) {
      issues.push(`${key} still contains a placeholder value`);
    }
  }

  if (env.APP_SECRET && env.APP_SECRET.length < 32) {
    issues.push('APP_SECRET must contain at least 32 characters');
  }

  if (env.EMAIL_PROVIDER && env.EMAIL_PROVIDER !== 'resend') {
    issues.push('EMAIL_PROVIDER must be set to "resend" in production');
  }

  if (env.EMAIL_PROVIDER === 'resend') {
    for (const key of ['RESEND_API_KEY', 'EMAIL_FROM'] as const) {
      const value = env[key]?.trim();
      if (!value) issues.push(`${key} is missing`);
      else if (isPlaceholder(value)) issues.push(`${key} still contains a placeholder value`);
    }
  }

  const upstashUrl = env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!!upstashUrl !== !!upstashToken) {
    issues.push('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together');
  }

  for (const key of ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'UPSTASH_REDIS_REST_URL'] as const) {
    const value = env[key];
    if (value) {
      try {
        const url = new URL(value);
        if (url.protocol !== 'https:') issues.push(`${key} must use HTTPS in production`);
      } catch {
        issues.push(`${key} must be a valid absolute URL`);
      }
    }
  }

  return issues;
}

export function assertProductionEnvironment(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV !== 'production') return;

  const issues = getProductionEnvironmentIssues(env);
  if (issues.length > 0) {
    throw new Error(`Invalid production environment:\n- ${issues.join('\n- ')}`);
  }
}
