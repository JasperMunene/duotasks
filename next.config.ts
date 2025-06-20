import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        domains: [
            'images.pexels.com',
            'res.cloudinary.com',
            'images.unsplash.com',
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:5000/:path*', // Proxy to Backend
            },
        ];
    },
};

export default nextConfig;
