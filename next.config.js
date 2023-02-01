loadEnv(process.env.APP_ENV);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

/**
 * @param {string} appEnv
 */
function loadEnv(appEnv = 'local') {
  const env = {
    ...require(`./env/env.${appEnv}`),
    NEXT_PUBLIC_APP_ENV: appEnv,
  };

  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value;
  });

  process.env['BASE_URL'] = `http${appEnv === 'local' ? '' : 's'}://${
    process.env.NEXT_PUBLIC_VERCEL_URL ?? 'localhost:3000'
  }`;
}
