import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        domains: ['images.pexels.com'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://duotasks-server.onrender.com/:path*', // Proxy to Backend
            },
        ];
    },
};

export default nextConfig;
