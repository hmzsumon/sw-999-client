// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	sassOptions: {
		additionalData: `$var: red;`,
	},
	async rewrites() {
		return [
			{
				source: '/api/v1/:path*',
				destination:
					'https://spain-win99-9184ebe694ed.herokuapp.com/api/v1/:path*',
			},
		];
	},
};

export default nextConfig;
