/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/nombre-del-repo' : '',
  assetPrefix: isGithubPages ? '/nombre-del-repo/' : '',
};

module.exports = nextConfig;
