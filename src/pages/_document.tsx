import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="description" content="Poke Typing Game by PokeAPI" />
				<meta name="google-site-verification" content="n9PDU346DViaXjImHRDlZeCU0X0w95-TYQwpbWoTD9A" />
				<link rel="preload" href="https://fonts.gstatic.com/s/josefinsans/v26/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_N_XbMZhKSbpUVzEEQ.woff" as="font" type="font/woff" crossOrigin="anonymous" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&display=swap" rel="stylesheet" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
