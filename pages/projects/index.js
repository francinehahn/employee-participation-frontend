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
import { Loading } from "../../components/loading/loading"
import { useRequestData } from "../../hooks/useRequestData"
import {FiEdit} from "react-icons/fi"
import {BsTrash3} from "react-icons/bs"
import { useForm } from "../../hooks/useForm"

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
    const [user, isLoadingUser] = useRequestData(`${baseUrl}users/account`, token.token, reload)

    const [project, setProject] = useState("")
    const [chartType, setChartType] = useState("pieChart")

    const [showEditProjectInfo, setShowEditProjectInfo] = useState(false)
    const [editProjectForm, editProjectOnChange, editProjectClearInputs] = useForm({newProjectName: "", startDate: "", endDate: ""})
    const [isLoadingEditProject, setIsLoadingEditProject] = useState(false)
    const [successEditProject, setSuccessEditProject] = useState("")
    const [axiosErrorEditProject, setAxiosErrorEditProject] = useState("")
    const [missingInfoEditProject, setMissingInfoEditProject] = useState("")

    const [showEditParticipation, setShowEditParticipation] = useState(false)
    const [editParticipationForm, editParticipationOnChange, editParticipationClearInputs] = useForm({employeeName: "", participation: ""})
    const [isLoadingParticipation, setIsLoadingParticipation] = useState(false)
    const [successParticipation, setSuccessParticipation] = useState("")
    const [axiosErrorParticipation, setAxiosErrorParticipation] = useState("")
    const [missingInfoParticipation, setMissingInfoParticipation] = useState("")
    const [invalidEmployeeName, setInvalidEmployeeName] = useState("")

    //get all project names to use in the select tag
    const allProjects = user && user.projects.map(item => {
        return <option key={item.project_name} value={item.project_name}>{item.project_name}</option>
    })

    //info of the selected project
    const selectedProject = user && project && user.projects.filter(item => item.project_name === project)[0]
    
    //get collaborators of the selected project
    const collaborators = selectedProject && getTotalParticipation(selectedProject.collaborators)

    //http request to edit project info
    const handleEditProjectInfo = (e) => {
        e.preventDefault()
        setIsLoadingEditProject(true)
        setSuccessEditProject("")
        setAxiosErrorEditProject("")
        setMissingInfoEditProject("")

        if (!editProjectForm.newProjectName && !editProjectForm.startDate && !editProjectForm.endDate) {
            setMissingInfoEditProject("Nenhuma informação para ser alterada.")
            setIsLoadingEditProject(false)
            return
        }

        const body = {
            currentProjectName: project,
            newProjectName: editProjectForm.newProjectName,
            startDate: editProjectForm.startDate.split("-").reverse().join("/"),
            endDate: editProjectForm.endDate.split("-").reverse().join("/")
        }

        axios.patch(`${baseUrl}users/projects/edit`, body, {
            headers: {
                Authorization: token.token
            }
        }).then(() => {
            setIsLoadingEditProject(false)
            setSuccessEditProject("Informações editadas com sucesso!")
            editProjectClearInputs()
            setReload(!reload)
        }).catch(error => {
            setIsLoadingEditProject(false)
            setAxiosErrorEditProject(error.response.data)
        })
    }

    //http request to delete the project
    const handleDeleteProject = () => {
        const body = {
            projectName: project
        }
        
        if (confirm("Você tem certeza que deseja deletar esse projeto?")) {
            axios.patch(`${baseUrl}users/projects`, body, {
                headers: {
                    Authorization: token.token
                }
            }).then(() => {
                alert("Projeto deletado!")
                setReload(!reload)
                setProject("")
            }).catch(error => {
                alert(error.response.data)
            })
        }
    }

    //http request to edit collaborator participation
    const handleEditParticipation = (e) => {
        e.preventDefault()
        setIsLoadingParticipation(true)
        setSuccessParticipation("")
        setAxiosErrorParticipation("")
        setMissingInfoParticipation("")
        setInvalidEmployeeName("")

        if (editParticipationForm.employeeName === "" || editParticipationForm.employeeName === "Outros") {
            setInvalidEmployeeName("Selecione um colaborador.")
            setIsLoadingParticipation(false)
            return
        }
        if (!editParticipationForm.participation) {
            setMissingInfoParticipation("Informe a nova participação.")
            setIsLoadingParticipation(false)
            return
        }

        const body = {
            projectName: project,
            employeeName: editParticipationForm.employeeName,
            participation: editParticipationForm.participation
        }

        axios.patch(`${baseUrl}users/projects/edit-collaborator`, body, {
            headers: {
                Authorization: token.token
            }
        }).then(() => {
            setIsLoadingParticipation(false)
            setSuccessParticipation("Participação editada com sucesso!")
            editParticipationClearInputs()
            setReload(!reload)
        }).catch(error => {
            setIsLoadingParticipation(false)
            setAxiosErrorParticipation(error.response.data)
            editParticipationClearInputs()
        })
    }

    return (
        <>
            <Head>
                <title>Projetos | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/icon.png" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div className={styles.container}>
                {isLoadingUser && <div className={styles.button}><Loading insideButton={false}/></div>}

                {!isLoadingUser && user && (
                    <>
                        <section>
                            <div>
                                <h3>Bem vindo(a), {user.user_name}!</h3>

                                <span>
                                    <label htmlFor="project">Selecione o projeto:</label>
                                    <select name="project" onChange={e => setProject(e.target.value)}>
                                        <option value="">Selecione</option>
                                        {allProjects}
                                    </select>
                                </span>
                            </div>

                            {selectedProject && <RegisterCollaboratorForm user={user} project={project} token={token.token} reload={reload} setReload={setReload}/>}
                        </section>

                        {selectedProject && (
                            <section>
                                <div>
                                    <span>
                                        <h2>{selectedProject.project_name}</h2>
                                        <FiEdit onClick={() => setShowEditProjectInfo(true)}/>
                                        <BsTrash3 onClick={handleDeleteProject}/>
                                    </span>
                                    <p>Data de início: {selectedProject.start_date}</p>
                                    <p>Data de término: {selectedProject.end_date}</p>

                                    <span>
                                        <h3>Colaboradores - participação %</h3>
                                        <FiEdit onClick={() => setShowEditParticipation(true)}/>
                                    </span>
                                    
                                    <CollaboratorsList project={project} collaborators={collaborators} token={token.token} reload={reload} setReload={setReload}/>
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
                    </>
                )}

                {showEditProjectInfo && (
                    <div className={styles.editProject}>
                        <div>
                            <button onClick={() => {
                                setShowEditProjectInfo(false)
                                setSuccessEditProject("")
                                setAxiosErrorEditProject("")
                                setMissingInfoEditProject("")
                            }}>x</button>
                        </div>

                        <div>
                            <h4>Edite apenas as informações desejadas:</h4>

                            <form onSubmit={handleEditProjectInfo}>
                                <div>
                                    <label htmlFor="projectName">Nome do projeto</label>
                                    <input type="text" name="projectName" placeholder={project} value={editProjectForm.newProjectName} onChange={editProjectOnChange}/>
                                </div>

                                <div>
                                    <label htmlFor="startDate">Data de início</label>
                                    <input type="date" name="startDate" value={editProjectForm.newStartDate} onChange={editProjectOnChange}/>
                                </div>

                                <div>
                                    <label htmlFor="endDate">Data de início</label>
                                    <input type="date" name="endDate" value={editProjectForm.newEndDate} onChange={editProjectOnChange}/>
                                </div>

                                {successEditProject && <p className={styles.successMessage}>{successEditProject}</p>}
                                {axiosErrorEditProject && <p className={styles.errorMessage}>{axiosErrorEditProject}</p>}
                                {missingInfoEditProject && <p className={styles.errorMessage}>{missingInfoEditProject}</p>}

                                <button>{isLoadingEditProject? <Loading insideButton={true}/> : 'Enviar'}</button>
                            </form>
                        </div>
                    </div>
                )}

                {showEditParticipation && (
                    <div className={styles.editProject}>
                        <div>
                            <button onClick={() => {
                                setShowEditParticipation(false)
                                setSuccessParticipation("")
                                setAxiosErrorParticipation("")
                                setMissingInfoParticipation("")
                                setInvalidEmployeeName("")
                            }}>x</button>
                        </div>

                        <div>
                            <h4>Selecione o colaborador e edite a participação:</h4>

                            <form onSubmit={handleEditParticipation}>
                                <select htmlFor="employeeName" name="employeeName" onChange={editParticipationOnChange}>
                                    <option value="">Selecione</option>
                                    {selectedProject.collaborators.map(item => {
                                        return <option key={item.employee_name} value={item.employee_name}>{item.employee_name}</option>
                                    })}
                                </select>

                                <div>
                                    <label htmlFor="participation">Nome do projeto</label>
                                    <input type="number" name="participation" placeholder="15" value={editParticipationForm.participation} onChange={editParticipationOnChange}/>
                                </div>

                                {successParticipation && <p className={styles.successMessage}>{successParticipation}</p>}
                                {axiosErrorParticipation && <p className={styles.errorMessage}>{axiosErrorParticipation}</p>}
                                {missingInfoParticipation && <p className={styles.errorMessage}>{missingInfoParticipation}</p>}
                                {invalidEmployeeName && <p className={styles.errorMessage}>{invalidEmployeeName}</p>}

                                <button>{isLoadingParticipation? <Loading insideButton={true}/> : 'Enviar'}</button>
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