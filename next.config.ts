const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: getRemotePatterns(),
    formats: ['image/avif', 'image/webp'],
  },
  // Habilitado TypeScript y ESLint para mejor calidad de código
  // eslint: { ignoreDuringBuilds: false },
  // typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
function getRemotePatterns() {
  /** @type {import('next').NextConfig['remotePatterns']} */
  const remotePatterns = [];

  if (SUPABASE_URL) {
    const hostname = new URL(SUPABASE_URL).hostname;

    remotePatterns.push({
      protocol: "https",
      hostname,
    });
  }

  // Add product image domains
  remotePatterns.push({
    protocol: "https",
    hostname: "www.pngkey.com",
  });

  return IS_PRODUCTION
    ? remotePatterns
    : [
        ...remotePatterns,
        {
          protocol: "http",
          hostname: "127.0.0.1",
        },
        {
          protocol: "http",
          hostname: "localhost",
        },
      ];
}
