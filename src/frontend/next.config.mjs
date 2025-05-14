/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Add this line to enable static export
  // Optional: if you have images from external domains, configure them here
  // images: {
  //   unoptimized: true, // if using next export, you might need this for next/image
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'example.com',
  //     },
  //   ],
  // },
};

export default nextConfig;
