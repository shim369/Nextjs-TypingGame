/** @type {import('next').NextConfig} */

module.exports = {
    reactStrictMode: true,
    
    images: {
        domains: ['pokeapi.co'],
    },
    
    async headers() {
        return [
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, must-revalidate',
                    },
                ],
            },
        ];
    },
};
