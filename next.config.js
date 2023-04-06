/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // OG画像URLのためにクライアントサイドへの露出が必要
  },
};

module.exports = nextConfig;
