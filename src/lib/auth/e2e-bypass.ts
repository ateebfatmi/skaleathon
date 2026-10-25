export function shouldBypassAuthentication(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.NODE_ENV !== 'production' && env.E2E_AUTH_BYPASS === '1';
}
