import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@medcalc/calculators"],
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
