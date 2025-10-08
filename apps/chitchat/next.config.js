/** @type {import('next').NextConfig} */
const nextConfig = {
// ✅ Allow local network devices to connect in dev mode
  experimental: {
	  allowedDevOrigins: ['http://192.168.1.8:3000', 'http://192.168.1.8:8080'], // Your LAN IP here
  },

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
