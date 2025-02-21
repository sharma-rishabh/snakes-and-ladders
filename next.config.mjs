/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? "/snakes-and-ladders/" : "",
  basePath: isProd ? "/snakes-and-ladders" : "",
  output: "export",
};

export default nextConfig;
