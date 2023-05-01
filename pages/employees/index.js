import { useState } from "react"
import { useRequestData } from "../../hooks/useRequestData"
import Head from "next/head"
import { Header } from "../../components/header/header"
import { Footer } from "../../components/footer/footer"
import nookies from "nookies"
import { baseUrl } from "../../constants/baseUrl"
import dynamic from "next/dynamic"
import { Loading } from "../../components/loading/loading"
import { EmployeesList } from "../../components/employeesList/employeesList"
import { EditEmployeeStatusForm } from "../../components/editEmployeeStatusForm/editEmployeeStatusForm"
import { DeleteEmployeeForm } from "../../components/deleteEmployeeForm/deleteEmployeeForm"
import {FiEdit} from "react-icons/fi"
import {BsTrash3} from "react-icons/bs"
import styles from "./employees.module.scss"

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
    const [reload, setReload] = useState(false)
    const [showEditEmployeeStatusForm, setShowEditEmployeeStatusForm] = useState(false)
    const [showDeleteEmployeeForm, setShowDeleteEmployeeForm] = useState(false)

    const [dataRanking, isLoadingRanking, errorRanking] = useRequestData(`${baseUrl}users/projects/avg-participation`, token.token, reload)
    const [allEmployees, isLoadingAllEmployees, setIsLoadingAllEmployees, errorAllEmployees] = useRequestData(`${baseUrl}users/employees?search=${status}`, token.token, reload)
    const [dataEmployee, isLoadingEmployee, setIsLoadingEmployee, errorEmployee] = useRequestData(`${baseUrl}users/employees/info/${selectedEmployee.replaceAll(" ", "-")}`, token.token, reload)
    
    const renderEmployees = allEmployees && allEmployees.map(item => {
        return <EmployeesList key={item.employee_name} item={item}/>
    })

    return (
        <>
            <Head>
                <title>Funcionários | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/icon.png" />
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

                        <FiEdit onClick={() => setShowEditEmployeeStatusForm(true)}/>
                        <BsTrash3 onClick={() => setShowDeleteEmployeeForm(true)}/>
                    </span>
                    
                    {isLoadingAllEmployees && <div className={styles.loading}><Loading insideButton={false}/></div>}
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
                    {selectedEmployee !== "" && isLoadingEmployee && <div className={styles.button}><Loading insideButton={false}/></div>}
                    {selectedEmployee !== "" && !isLoadingEmployee && !dataEmployee && errorEmployee && <p>{errorEmployee}</p>}
                    {selectedEmployee !== "" && !isLoadingEmployee && !errorEmployee && dataEmployee && (
                        <BarChartWithNoSSR data={dataEmployee} employee={selectedEmployee}/>
                    )}

                    {selectedEmployee === "" && isLoadingRanking && <div className={styles.button}><Loading insideButton={false}/></div>}
                    {selectedEmployee === "" && !isLoadingRanking && errorRanking && <p>{errorRanking}</p>}
                    {selectedEmployee === "" && !isLoadingRanking && dataRanking && (
                        <RankingWithNoSSR data={dataRanking}/>
                    )}
                </section>

                {showEditEmployeeStatusForm && 
                    <EditEmployeeStatusForm
                        setShowEditEmployeeStatusForm={setShowEditEmployeeStatusForm}
                        allEmployees={allEmployees}
                        token={token.token}
                        reload={reload}
                        setReload={setReload}
                    />
                }

                {showDeleteEmployeeForm &&
                    <DeleteEmployeeForm 
                        setShowDeleteEmployeeForm = {setShowDeleteEmployeeForm}
                        allEmployees={allEmployees}
                        token={token.token}
                        reload={reload}
                        setReload={setReload}
                    />
                }
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