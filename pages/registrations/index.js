import Head from "next/head"
import { Header } from "../../components/header/header"
import { Footer } from "../../components/footer/footer"
import nookies from "nookies"
import { useState } from "react"
import axios from "axios"
import { Loading } from "../../components/loading/loading"
import { baseUrl } from "../../constants/baseUrl"
import styles from "./registration.module.scss"

export default function Registrations ({token}) {
    const [employeeName, setEmployeeName] = useState("")
    const [status, setStatus] = useState("")
    const [employeeNameError, setEmployeeNameError] = useState("")
    const [axiosEmployeeError, setAxiosEmployeeError] = useState("")
    const [employeeSuccessMessage, setEmployeeSuccessMessage] = useState("")
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(false)

    const [projectName, setProjectName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [projectNameError, setProjectNameError] = useState("")
    const [axiosProjectError, setAxiosProjectError] = useState("")
    const [projectSuccessMessage, setProjectSuccessMessage] = useState("")
    const [isLoadingProject, setIsLoadingProject] = useState("")

    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    const handleEmployeeRegistration = (e) => {
        e.preventDefault()
        setIsLoadingEmployee(true)
        setEmployeeNameError("")
        setAxiosEmployeeError("")
        setEmployeeSuccessMessage("")

        if (employeeName === "" || employeeName.length < 10 || !employeeName.includes(" ")) {
            setEmployeeNameError("Informe nome completo do funcionário.")
            setIsLoadingEmployee(false)
            return
        }

        const body = {
            employeeName,
            status
        }

        axios.patch(`${baseUrl}users/employees/register`, body, {
            headers: {
                Authorization: token.token
            }
        }).then(() => {
            setIsLoadingEmployee(false)
            setEmployeeSuccessMessage("Funcionário cadastrado com sucesso!")
        }).catch(error => {
            setIsLoadingEmployee(false)
            setAxiosEmployeeError(error.response.data)
        })
    }

    const handleProjectRegistration = (e) => {
        e.preventDefault()
        setIsLoadingProject(true)
        setProjectNameError("")
        setAxiosProjectError("")
        setProjectSuccessMessage("")

        if (projectName === "" || projectName.length < 3) {
            setEmployeeNameError("Informe o nome do projeto com pelo menos 3 caracteres.")
            setIsLoadingProject(false)
            return
        }

        const body = {
            projectName,
            startDate: startDate.split("-").reverse().join("/"),
            endDate: endDate.split("-").reverse().join("/")
        }

        console.log(body)

        axios.patch(`${baseUrl}users/projects/register`, body, {
            headers: {
                Authorization: token.token
            }
        }).then(() => {
            setIsLoadingProject(false)
            setProjectSuccessMessage("Projeto cadastrado com sucesso!")
        }).catch(error => {
            setIsLoadingProject(false)
            setAxiosProjectError(error.response.data)
        })
    }

    return (
        <>
            <Head>
                <title>Cadastros | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div className={styles.container}>
                <section className={styles.form}>
                    <h2>Cadastre um novo projeto:</h2>
                    <form onSubmit={handleProjectRegistration}>
                        <div>
                            <label htmlFor="projectName">Nome completo</label>
                            <input type={'text'} placeholder="Sistema bancário" name="projectName" value={projectName} onChange={e => setProjectName(e.target.value)}/>
                            <p className={styles.error}>{projectNameError}</p>
                        </div>

                        <div>
                            <label htmlFor="startDate">Data de início</label>
                            <input type={'date'} name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required/>
                        </div>

                        <div>
                            <label htmlFor="endDate">Data de término</label>
                            <input type={'date'} name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required/>
                        </div>

                        {axiosProjectError && <p className={styles.error}>{axiosProjectError}</p>}
                        {projectSuccessMessage && <p className={styles.successMessage}>{projectSuccessMessage}</p>}
                        
                        <button>{isLoadingProject? <Loading insideButton={true}/> : "Cadastrar"}</button>
                    </form>
                </section>

                <section className={styles.form}>
                    <h2>Cadastre um novo funcionário:</h2>
                    <form onSubmit={handleEmployeeRegistration}>
                        <div>
                            <label htmlFor="employeeName">Nome completo</label>
                            <input type={'text'} placeholder="Maria Silva" name="employeeName" value={employeeName} onChange={e => setEmployeeName(e.target.value)}/>
                            <p className={styles.error}>{employeeNameError}</p>
                        </div>

                        <div>
                            <label htmlFor="status">Status (funcionário ou ex-funcionário)</label>
                            <select name="status" onChange={e => setStatus(e.target.value)} required>
                                <option value="">Selecione</option>
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>

                        {axiosEmployeeError && <p className={styles.error}>{axiosEmployeeError}</p>}
                        {employeeSuccessMessage && <p className={styles.successMessage}>{employeeSuccessMessage}</p>}
                        
                        <button>{isLoadingEmployee? <Loading insideButton={true}/> : "Cadastrar"}</button>
                    </form>
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