/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  headers: async () => {
    const scriptEval = process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'";
    const headers = [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "0",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'${scriptEval} https://*.clerk.accounts.dev https://*.clerk.com https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.supabase.co https://api.razorpay.com; frame-src https://*.clerk.accounts.dev https://*.clerk.com https://api.razorpay.com https://checkout.razorpay.com; worker-src 'self' blob:; upgrade-insecure-requests`,
          },
        ],
      },
    ];

    if (process.env.NODE_ENV === 'production') {
      headers[0].headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      });
    }

    return headers;
  },
};

export default nextConfig;
