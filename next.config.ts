import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  /** Playwright uses 127.0.0.1; Next 16 blocks some dev asset requests without this. */
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
