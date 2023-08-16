/** @type {import('next').NextConfig} */

module.exports = {
	reactStrictMode: true,

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
