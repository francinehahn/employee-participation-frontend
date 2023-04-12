import { Footer } from "../components/footer/footer"
import { Header } from "../components/header/header"


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </>
  )
}

export default MyApp
