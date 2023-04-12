import Head from "next/head"


//https://www.youtube.com/watch?v=RaweREhpBX8 - refresh token
export default function Dashboard ({}) {
    return (
        <>
            <Head>
                <title>Dashboard | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h2>Dashboard</h2>
        </>
    )
}

export async function getServerSideProps (ctx) {
    const token = ctx.req.cookies.token

    if (!token) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}