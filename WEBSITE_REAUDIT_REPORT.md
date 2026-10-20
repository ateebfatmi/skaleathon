# Skaleathon Website Re-audit Report

Date: 21 October 2026

## Outcome

All critical and high-risk findings from the re-audit have been remediated in code. The production dependency audit reports zero known runtime vulnerabilities, the production build succeeds, and representative public flows were verified in a local browser.

## Remediation summary

| Area | Status | Improvement |
| --- | --- | --- |
| Development login impersonation | Resolved | The endpoint is unavailable in production and disabled by default; enabling it now requires an explicit local flag. Admin access requires an explicit allowlist. |
| Session signing | Resolved | Removed the shared fallback secret, enforced a 32-character production secret, added expiration, and used constant-time signature checks. |
| Registration identity spoofing | Resolved | Registration requires authentication and the submitted leader email must match the verified session email. |
| Authentication middleware bypass | Resolved | Removed authorization based only on the presence of a custom cookie and migrated middleware to the Next.js proxy convention. |
| Payment signature verification | Resolved | Missing secrets fail closed, sandbox behavior requires an explicit local-only flag, and comparisons are timing safe. |
| Forged payment webhooks | Resolved | Webhooks require a valid secret and signature, validate amount/currency/gateway status, and retain idempotency protection. |
| Client-controlled legacy payments | Resolved | Legacy order and verification endpoints return `410 Gone`; checkout redirects to the canonical registration flow. |
| Payment SDK exposure | Resolved | Razorpay is loaded only when payment checkout is requested rather than on every page. |
| Database split-brain fallback | Resolved | Production database errors now fail closed and local JSON persistence is disabled in production. |
| Request abuse | Improved | Added throttling to registration, payment order/verification/webhooks, certificate verification/issuance, submissions, judging, and the optional development login. |
| Dependency vulnerabilities | Resolved | Upgraded Next.js to 16.4.2, React to 19.2.3, and jsPDF to 4.2.1. `npm audit --omit=dev` reports zero vulnerabilities. |
| Missing homepage content | Resolved | Restored the complete about, tracks, prizes, stages, timeline, rules, FAQ, and organizer experience. |
| Public leaderboard redirect | Resolved | `/leaderboard` now renders public standings content directly. |
| Stale event constants | Resolved | Public and active dashboard surfaces now use event configuration or neutral copy instead of hard-coded year, fee, prize, team-size, and certificate values. |
| Accessibility | Improved | Added form associations and accessible names, FAQ disclosure state/regions, a FAQ page heading, reduced-motion support, safer external links, and removed nested main landmarks. |
| SEO | Improved | Added page-specific metadata, removed sign-in from the sitemap, and added the public leaderboard. |
| Browser security | Improved | Added CSP, HSTS in production, referrer/permissions policies, framing protection, MIME sniffing protection, and disabled the obsolete X-XSS-Protection mode. |
| Landing-page and navigation performance | Improved | Reduced homepage-specific production JavaScript from about 92 KB to 44 KB (approximately 52%), restored the starfield as lightweight composited CSS, deduplicated repeated public event/track reads, prefetched navbar destinations, added immediate route-loading feedback, and deduplicated/parallelized dashboard session and team reads. |
| Test coverage | Improved | Added session tamper/expiry tests and webhook fail-closed/HMAC tests, expanding the suite from 12 to 17 passing tests. |

## Verification evidence

- `npm audit --omit=dev`: **0 vulnerabilities**
- `npm test`: **17/17 tests passed** across 5 test files
- `npm run lint`: **passed with no findings**
- `npm run build`: **passed**, including TypeScript and all 33 generated pages
- Homepage-specific production JavaScript: **92 KB → 44 KB** (approximately **52% smaller**)
- Total optimized static build output: **2.1 MB → 2.0 MB**
- Local homepage readiness check: **HTTP 200**, approximately **0.31 s** total on the first development request
- Warm public navbar destinations: approximately **32–38 ms** locally after compilation
- Authenticated dashboard navigation: approximately **1.49 s → 0.31 s** locally after request deduplication and parallelization
- Browser smoke test: `/`, `/register`, and `/leaderboard` returned HTTP 200 and rendered correctly
- Brave interaction check: homepage sections rendered correctly and the FAQ disclosure remained functional after the performance changes
- Signed-out registration: verified that registration data entry is blocked until the leader signs in

## Deployment requirements

The hardened code intentionally refuses insecure production fallbacks. Before deployment, configure:

- `APP_SECRET` with a unique random value of at least 32 characters
- `ADMIN_EMAILS` with the intended administrator allowlist
- `RAZORPAY_WEBHOOK_SECRET` from the Razorpay dashboard
- production Razorpay key ID and secret
- production Clerk keys instead of development keys
- Supabase service-role credentials and the required schema

Keep `ENABLE_DEV_LOGIN=false` and `ENABLE_PAYMENT_SANDBOX=false` in production.

For horizontally scaled or serverless production, replace the in-memory rate-limit store with a shared Redis, database, or edge rate-limit service so limits apply across instances.

## Recommended next assurance step

Add a CI browser suite covering Clerk sign-in, team registration, a mocked Razorpay payment, keyboard navigation, and automated accessibility checks. The current browser verification was performed manually against the local application.
