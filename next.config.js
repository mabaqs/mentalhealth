/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/mentalhealth' : '',
  assetPrefix: isGithubPages ? '/mentalhealth/' : '',
};

module.exports = nextConfig;
