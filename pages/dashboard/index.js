import Head from "next/head"
import { Footer } from "../../components/footer"
import { Header } from "../../components/header"
import nookies from "nookies"
//import Chart from "react-apexcharts"
import { baseUrl } from "../../constants/baseUrl"


export default function Dashboard ({token, data}) {
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false
    console.log(data)

    return (
        <>
            <Head>
                <title>Dashboard | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <h2>Dashboard</h2>

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

    const response = await fetch(`${baseUrl}users/account`, {
        headers: {
            Authorization: token.token
        }
    })

    const data = await response.json()

    return {
        props: {
            token,
            data
        }
    }
}