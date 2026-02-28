import nextConfig from 'eslint-config-next';

const config = Array.isArray(nextConfig) ? nextConfig : [nextConfig];
const eslintConfig = [
  { ignores: ['lib/generated/prisma/**'] },
  ...config,
];

export default eslintConfig;
