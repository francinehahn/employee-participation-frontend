import Head from "next/head"
import { Header } from "../../components/header/header"
import { Footer } from "../../components/footer/footer"
import nookies from "nookies"

export default function Registrations ({token}) {
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    return (
        <>
            <Head>
                <title>Cadastros | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div>
                Página de cadastro de novos projetos e novos funcionários.
            </div>

            <Footer/>
        </>
    )
}

export async function getServerSideProps (ctx) {
    const token = nookies.get(ctx)

    if (!token.token) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {
            token
        }
    }
}