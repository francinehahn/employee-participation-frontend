import { Header } from "../components/header"
import "../styles/global.scss"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
