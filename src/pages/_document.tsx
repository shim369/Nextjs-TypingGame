import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="description" content="Pokemon Typing Game by PokeAPI" />
				<meta name="google-site-verification" content="n9PDU346DViaXjImHRDlZeCU0X0w95-TYQwpbWoTD9A" />
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
