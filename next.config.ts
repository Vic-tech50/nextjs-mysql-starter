import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  // set devIndicators: false
  // devIndicators: true,
   cacheComponents: true,
};

export default withFlowbiteReact(nextConfig);