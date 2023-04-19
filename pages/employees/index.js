import Head from "next/head"
import axios from "axios"
import { Header } from "../../components/header/header"
import { Footer } from "../../components/footer/footer"
import nookies from "nookies"
import { useEffect, useState } from "react"
import { baseUrl } from "../../constants/baseUrl"

export default function Employees ({token}) {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [employees, setEmployees] = useState("")

    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${baseUrl}users/employees?search=${search}`, {
            headers: {
                Authorization: token.token
            }
        }).then(response => {
            setIsLoading(false)
            setEmployees(response.data)
        }).catch(error => {
            setIsLoading(false)
            alert(error.response.data)
        })
    }, [search, token.token])

    const renderEmployees = employees && employees.map(item => {
        return <li key={item.employee_name}>{item.employee_name}</li>
    })

    return (
        <>
            <Head>
                <title>Funcionários | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div>
                <label htmlFor="search">Filtrar funcionários:</label>
                <select name="search" onChange={e => setSearch(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                </select>

                <ul>
                    {renderEmployees}
                </ul>
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