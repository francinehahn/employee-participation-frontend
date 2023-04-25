import Head from "next/head"
import nookies from "nookies"
import { useState } from "react"
import { baseUrl } from "../../constants/baseUrl"
import axios from "axios"
import { Header } from "../../components/header/header"
import { Footer } from "../../components/footer/footer"
import { Loading } from "../../components/loading/loading"
import employee from "../../images/register-employee.jpg"
import project from "../../images/register-project.jpg"
import styles from "./registration.module.scss"
import Image from "next/image"
import { useForm } from "../../hooks/useForm"


export default function Registrations ({token}) {
    const [employeeForm, employeeOnChange] = useForm({employeeName: "", status: ""})
    const [employeeNameError, setEmployeeNameError] = useState("")
    const [axiosEmployeeError, setAxiosEmployeeError] = useState("")
    const [employeeSuccessMessage, setEmployeeSuccessMessage] = useState("")
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(false)

    const [projectForm, projectOnChange] = useForm({projectName: "", startDate: "", endDate: ""})
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

        if (employeeForm.employeeName === "" || employeeForm.employeeName.length < 10 || !employeeForm.employeeName.includes(" ")) {
            setEmployeeNameError("Informe nome completo do funcionário.")
            setIsLoadingEmployee(false)
            return
        }

        axios.patch(`${baseUrl}users/employees/register`, employeeForm, {
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

        if (projectForm.projectName === "" || projectForm.projectName.length < 3) {
            setEmployeeNameError("Informe o nome do projeto com pelo menos 3 caracteres.")
            setIsLoadingProject(false)
            return
        }

        axios.patch(`${baseUrl}users/projects/register`, projectForm, {
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
                <link rel="icon" href="/icon.png" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div className={styles.container}>
                <section>
                    <div>
                        <h2>Cadastre um novo funcionário:</h2>
                        <form onSubmit={handleEmployeeRegistration}>
                            <span>
                                <label htmlFor="employeeName">Nome completo</label>
                                <input type={'text'} placeholder="Maria Silva" name="employeeName" value={employeeForm.employeeName} onChange={employeeOnChange}/>
                                <p className={styles.error}>{employeeNameError}</p>
                            </span>

                            <span>
                                <label htmlFor="status">Status (funcionário ou ex-funcionário)</label>
                                <select name="status" onChange={employeeOnChange} required>
                                    <option value="">Selecione</option>
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                            </span>

                            {axiosEmployeeError && <p className={styles.error}>{axiosEmployeeError}</p>}
                            {employeeSuccessMessage && <p className={styles.successMessage}>{employeeSuccessMessage}</p>}
                            
                            <button>{isLoadingEmployee? <Loading insideButton={true}/> : "Cadastrar"}</button>
                        </form>
                    </div>
                </section>

                <section>
                    <div>
                        <h2>Cadastre um novo projeto:</h2>
                        <form onSubmit={handleProjectRegistration}>
                            <span>
                                <label htmlFor="projectName">Nome completo</label>
                                <input type={'text'} placeholder="Sistema bancário" name="projectName" value={projectForm.projectName} onChange={projectOnChange}/>
                                <p className={styles.error}>{projectNameError}</p>
                            </span>

                            <span>
                                <label htmlFor="startDate">Data de início</label>
                                <input type={'date'} name="startDate" value={projectForm.startDate} onChange={projectOnChange} required/>
                            </span>

                            <span>
                                <label htmlFor="endDate">Data de término</label>
                                <input type={'date'} name="endDate" value={projectForm.endDate} onChange={projectOnChange} required/>
                            </span>

                            {axiosProjectError && <p className={styles.error}>{axiosProjectError}</p>}
                            {projectSuccessMessage && <p className={styles.successMessage}>{projectSuccessMessage}</p>}
                            
                            <button>{isLoadingProject? <Loading insideButton={true}/> : "Cadastrar"}</button>
                        </form>
                    </div>
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