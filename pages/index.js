import Head from 'next/head'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import nookies from "nookies"

export default function Home({token}) {
  let isLoggedIn
  token.token? isLoggedIn = true : isLoggedIn = false

  return (
    <div>
      <Head>
        <title>Home | Employee Participation</title>
        <meta name="description" content="O melhor site de avaliação de funcionários"/>
        <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={isLoggedIn}/>

      <h1>Home page</h1>

      <Footer/>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  const token = nookies.get(ctx)

  return {
      props: {token}
  }
}
