import { BelvoProvider } from '../context/belvo'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <BelvoProvider>
        <Component {...pageProps} />
      </BelvoProvider>
    </>
  )
}

export default MyApp
