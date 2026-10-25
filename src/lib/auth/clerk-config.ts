/**
 * Production Clerk keys on Vercel use the app's Frontend API proxy. Vercel
 * enables that proxy automatically in production, while localhost needs to
 * opt into the same route explicitly so Clerk does not request the provider
 * hostname directly.
 */
export function getClerkProxyUrl(
  nodeEnv: string | undefined,
  publishableKey: string | undefined,
): string | undefined {
  if (nodeEnv !== 'production' && publishableKey?.startsWith('pk_live_')) {
    return '/__clerk';
  }

  return undefined;
}
