import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
      <script src="https://cdn.belvo.io/belvo-widget-1-stable.js" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />

      </body>
    </Html>
  )
}