import Head from "next/head"
import { Header } from "../../components/header"
import nookies from "nookies"

export default function Signup ({token}) {
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    return (
        <>
            <Head>
                <title>Signup | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <h2>Signup</h2>
        </>
    )
}

export async function getServerSideProps (ctx) {
    const token = nookies.get(ctx)
  
    return {
        props: {token}
    }
}