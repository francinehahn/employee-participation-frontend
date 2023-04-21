import { useState } from "react"
import axios from "axios"
import nookies from "nookies"
import Head from "next/head"
import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import { baseUrl } from "../../constants/baseUrl"
import { RegisterCollaboratorForm } from "../../components/registerCollaboratorForm/registerCollaboratorForm"
import { CollaboratorsList } from "../../components/collaboratorsList/collaboratorsList"
import dynamic from 'next/dynamic'
import { getTotalParticipation } from "../../utils/getTotalParticipation"
import styles from "./projects.module.scss"
import {FiEdit} from "react-icons/fi"
import { Loading } from "../../components/loading/loading"
import { useRequestData } from "../../hooks/useRequestData"

const PieChartWithNoSSR = dynamic(
    () => import("../../components/pieChart/pieChart"),
    { ssr: false }
)

const BarChartWithNoSSR = dynamic(
    () => import("../../components/barChart/barChart"),
    { ssr: false }
)


export default function Projects ({token}) {
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    const [reload, setReload] = useState(false)
    const [user] = useRequestData(`${baseUrl}users/account`, token.token, reload)

    const [project, setProject] = useState("")
    const [chartType, setChartType] = useState("pieChart")

    const [showEditProjectInfo, setShowEditProjectInfo] = useState(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [newStartDate, setNewStartDate] = useState("")
    const [newEndDate, setNewEndDate] = useState("")
    const [isLoadingEditProject, setIsLoadingEditProject] = useState(false)
    const [successEditProject, setSuccessEditProject] = useState("")
    const [axiosErrorEditProject, setAxiosErrorEditProject] = useState("")
    const [missingInfoEditProject, setMissingInfoEditProject] = useState("")

    //get all project names to use in the select tag
    const allProjects = user && user.projects.map(item => {
        return <option key={item.project_name} value={item.project_name}>{item.project_name}</option>
    })

    //info of the selected project
    const selectedProject = user && project && user.projects.filter(item => item.project_name === project)[0]

    //get collaborators of the selected project
    const collaborators = user && project && getTotalParticipation(selectedProject.collaborators)

    //http request to edit project info
    const handleEditProjectInfo = (e) => {
        e.preventDefault()
        setIsLoadingEditProject(true)
        setSuccessEditProject("")
        setAxiosErrorEditProject("")
        setMissingInfoEditProject("")
        setNewProjectName("")
        setNewStartDate("")
        setNewEndDate("")

        if (!newProjectName && !newStartDate && !newEndDate) {
            setMissingInfoEditProject("Nenhuma informação para ser alterada.")
            setIsLoadingEditProject(false)
            return
        }

        const body = {
            currentProjectName: project,
            newProjectName,
            startDate: newStartDate.split("-").reverse().join("/"),
            endDate: newEndDate.split("-").reverse().join("/")
        }

        axios.patch(`${baseUrl}users/projects/edit`, body, {
            headers: {
                Authorization: token.token
            }
        }).then(() => {
            setIsLoadingEditProject(false)
            setSuccessEditProject("Informações editadas com sucesso!")
            setReload(!reload)
        }).catch(error => {
            setIsLoadingEditProject(false)
            setAxiosErrorEditProject(error.response.data)
        })
    }

    return (
        <>
            <Head>
                <title>Projetos | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div className={styles.container}>
                <section>
                    <div>
                        <h3>Bem vindo(a), {user && user.user_name}!</h3>

                        <span>
                            <label htmlFor="project">Selecione o projeto:</label>
                            <select name="project" onChange={e => setProject(e.target.value)}>
                                <option value="">Selecione</option>
                                {allProjects}
                            </select>
                        </span>
                    </div>

                    {project && <RegisterCollaboratorForm user={user} project={project} token={token.token} reload={reload} setReload={setReload}/>}
                </section>

                {project !== "" && (
                    <section>
                        <div>
                            <span>
                                <h2>{selectedProject.project_name}</h2>
                                <FiEdit onClick={() => setShowEditProjectInfo(true)}/>
                            </span>
                            <p>Data de início: {selectedProject.start_date}</p>
                            <p>Data de término: {selectedProject.end_date}</p>
                            <h3>Colaboradores - participação</h3>
                            <CollaboratorsList collaborators={collaborators}/>
                        </div>
                        
                        <div>
                            <span>
                                <label htmlFor="chartType">Tipo de gráfico</label>
                                <select name="chartType" onChange={e => setChartType(e.target.value)} defaultValue={"pieChart"}>
                                    <option value="pieChart">Pizza</option>
                                    <option value="barChart">Barras</option>
                                </select>
                            </span>

                            {chartType === "pieChart" && <PieChartWithNoSSR collaborators={collaborators}/>}
                            {chartType === "barChart" && <BarChartWithNoSSR collaborators={collaborators}/>}
                        </div>
                    </section>
                )}

                {showEditProjectInfo && (
                    <div className={styles.editProject}>
                        <div>
                            <button onClick={() => {
                                setShowEditProjectInfo(false)
                                setSuccessEditProject("")
                                setAxiosErrorEditProject("")
                                setMissingInfoEditProject("")
                                setNewProjectName("")
                                setNewStartDate("")
                                setNewEndDate("")
                            }}>x</button>
                        </div>

                        <div>
                            <h4>Edite apenas as informações desejadas:</h4>

                            <form onSubmit={handleEditProjectInfo}>
                                <div>
                                    <label htmlFor="projectName">Nome do projeto</label>
                                    <input type="text" name="projectName" placeholder={project} value={newProjectName} onChange={e => setNewProjectName(e.target.value)}/>
                                </div>

                                <div>
                                    <label htmlFor="startDate">Data de início</label>
                                    <input type="date" name="startDate" value={newStartDate} onChange={e => setNewStartDate(e.target.value)}/>
                                </div>

                                <div>
                                    <label htmlFor="endDate">Data de início</label>
                                    <input type="date" name="endDate" value={newEndDate} onChange={e => setNewEndDate(e.target.value)}/>
                                </div>

                                {successEditProject && <p className={styles.successMessage}>{successEditProject}</p>}
                                {axiosErrorEditProject && <p className={styles.errorMessage}>{axiosErrorEditProject}</p>}
                                {missingInfoEditProject && <p className={styles.errorMessage}>{missingInfoEditProject}</p>}

                                <button>{isLoadingEditProject? <Loading insideButton={true}/> : 'Enviar'}</button>
                            </form>
                        </div>
                    </div>
                )}
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
        props: {token}
    }
}