/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Allow local network devices to connect in dev mode
  //allowedDevOrigins: ['10.54.158.144:3000', '10.54.158.144:8080'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
