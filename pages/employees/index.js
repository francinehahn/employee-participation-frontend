import Head from "next/head"
import axios from "axios"
import { Header } from "../../components/header/header"
import { Footer } from "../../components/footer/footer"
import nookies from "nookies"
import { useEffect, useState } from "react"
import { baseUrl } from "../../constants/baseUrl"
import styles from "./employees.module.scss"
import dynamic from "next/dynamic"

const BarChartWithNoSSR = dynamic(
    () => import("../../components/employeeChart/employeeChart"),
    { ssr: false }
)

export default function Employees ({token}) {
    const [search, setSearch] = useState("")
    const [isLoadingAllEmployees, setIsLoadingAllEmployees] = useState(false)
    const [employees, setEmployees] = useState("")
    const [selectedEmployee, setSelectedEmployee] = useState("ranking")
    const [dataEmployee, setDataEmployee] = useState("")
    const [errorEmployee, setErrorEmployee] = useState("")
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(false)
    
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    useEffect(() => {
        setIsLoadingAllEmployees(true)
        setEmployees("")

        axios.get(`${baseUrl}users/employees?search=${search}`, {
            headers: {
                Authorization: token.token
            }
        }).then(response => {
            setIsLoadingAllEmployees(false)
            setEmployees(response.data)
        }).catch(error => {
            setIsLoadingAllEmployees(false)
            alert(error.response.data)
        })
    }, [search, token.token])

    
    useEffect(() => {
        setIsLoadingEmployee(true)
        setDataEmployee("")
        setErrorEmployee("")

        if (selectedEmployee !== "ranking") {
            axios.get(`${baseUrl}users/employees/${selectedEmployee.replace(" ", "-")}`, {
                headers: {
                    Authorization: token.token
                }
            }).then(response => {
                setIsLoadingEmployee(false)
                setDataEmployee(response.data)
            }).catch(error => {
                setIsLoadingEmployee(false)
                setErrorEmployee(error.response.data)
            })
        }
        
    }, [selectedEmployee, token.token])

    const renderEmployees = employees && employees.map(item => {
        return (
            <div key={item.employee_name}>
                <input type="radio" name="employee" id={item.employee_name} value={item.employee_name}/>
                <label htmlFor={item.employee_name}>{item.employee_name}</label>
                <br></br>
            </div>
        )
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

            <div className={styles.container}>
                <section>
                    <span>
                        <label htmlFor="search">Filtrar:</label>
                        <select name="search" onChange={e => setSearch(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </span>
                    
                    {isLoadingAllEmployees && <p>Carregando...</p>}

                    {!isLoadingAllEmployees && employees && (
                        <form onChange={e => setSelectedEmployee(e.target.value)}>
                            <div>
                                <input type="radio" name="employee" id="ranking" value="ranking" defaultChecked/>
                                <label htmlFor="ranking">Mostrar ranking</label>
                            </div>
                            {renderEmployees}
                        </form>
                    )}
                </section>

                <section>
                    {selectedEmployee !== "ranking" && isLoadingEmployee && <p>Carregando...</p>}

                    {selectedEmployee !== "ranking" && !isLoadingEmployee && dataEmployee && (
                        <BarChartWithNoSSR employee={selectedEmployee} data={dataEmployee}/>
                    )}

                    {selectedEmployee !== "ranking" && !isLoadingEmployee && !dataEmployee && errorEmployee && <p>{errorEmployee}</p>}

                    {selectedEmployee === "ranking" && (
                        <p>Mostrar ranking!</p>
                    )}
                </section>
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