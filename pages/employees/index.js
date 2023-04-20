import { useState } from "react"
import { useRequestData } from "../../hooks/useRequestData"
import Head from "next/head"
import { Header } from "../../components/header/header"
import { Footer } from "../../components/footer/footer"
import nookies from "nookies"
import { baseUrl } from "../../constants/baseUrl"
import styles from "./employees.module.scss"
import dynamic from "next/dynamic"
import { Loading } from "../../components/loading/loading"

const BarChartWithNoSSR = dynamic(
    () => import("../../components/employeeChart/employeeChart"),
    { ssr: false }
)

const RankingWithNoSSR = dynamic(
    () => import("../../components/ranking/ranking"),
    { ssr: false }
)

export default function Employees ({token}) {
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    const [selectedEmployee, setSelectedEmployee] = useState("")
    const [status, setStatus] = useState("")

    const [dataRanking, isLoadingRanking, errorRanking] = useRequestData(`${baseUrl}users/projects/avg-participation`, token.token)
    const [allEmployees, isLoadingAllEmployees, setIsLoadingAllEmployees, errorAllEmployees] = useRequestData(`${baseUrl}users/employees?search=${status}`, token.token)
    const [dataEmployee, isLoadingEmployee, setIsLoadingEmployee, errorEmployee] = useRequestData(`${baseUrl}users/employees/info/${selectedEmployee.replace(" ", "-")}`, token.token) 
    
    const renderEmployees = allEmployees && allEmployees.map(item => {
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
                        <label htmlFor="status">Filtrar:</label>
                        <select name="status" onChange={e => {
                            setStatus(e.target.value)
                            setIsLoadingAllEmployees(true)
                        }}>
                            <option value="">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </span>
                    
                    {isLoadingAllEmployees && <Loading insideButton={false}/>}
                    {!isLoadingAllEmployees && !allEmployees && errorAllEmployees && <p>{errorAllEmployees}</p>}

                    {!isLoadingAllEmployees && allEmployees && (
                        <form onChange={e => {
                            setSelectedEmployee(e.target.value)
                            setIsLoadingEmployee(true)
                        }}>
                            <div>
                                <input type="radio" name="employee" id="ranking" value="" defaultChecked/>
                                <label htmlFor="ranking">Mostrar ranking</label>
                            </div>
                            {renderEmployees}
                        </form>
                    )}
                </section>

                <section>
                    {selectedEmployee !== "" && isLoadingEmployee && <Loading insideButton={false}/>}
                    {selectedEmployee !== "" && !isLoadingEmployee && !dataEmployee && errorEmployee && <p>{errorEmployee}</p>}
                    {selectedEmployee !== "" && !isLoadingEmployee && !errorEmployee && dataEmployee && (
                        <BarChartWithNoSSR data={dataEmployee} employee={selectedEmployee}/>
                    )}

                    {selectedEmployee === "" && isLoadingRanking && <Loading insideButton={false}/>}
                    {selectedEmployee === "" && !isLoadingRanking && dataRanking && (
                        <RankingWithNoSSR data={dataRanking}/>
                    )}
                    {selectedEmployee === "" && !isLoadingRanking && errorRanking && <p>{errorRanking}</p>}
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