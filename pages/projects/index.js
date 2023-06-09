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
import {GrSelect} from "react-icons/gr"
import { EditProjectInfoForm } from "../../components/editProjectInfoForm/editProjectInfoForm"
import { EditParticipationForm } from "../../components/editParticipationForm/editParticipationForm"
import Swal from "sweetalert2"
import { DeleteCollaboratorForm } from "../../components/deleteCollaboratorForm/deleteCollaboratorForm"

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
    const [showEditParticipation, setShowEditParticipation] = useState(false)
    const [showDeleteCollaborator, setShowDeleteCollaborator] = useState(false)

    //get all project names to use in the select tag
    const allProjects = user && user.projects.map(item => {
        return <option key={item.project_name} value={item.project_name}>{item.project_name}</option>
    })

    //info of the selected project
    const selectedProject = user && project && user.projects.filter(item => item.project_name === project)[0]
    
    //get collaborators of the selected project
    const collaborators = selectedProject && getTotalParticipation(selectedProject.collaborators)
    
    //http request to delete the project
    const handleDeleteProject = () => {
        const body = {
            projectName: project
        }
        
        Swal.fire({
            title: 'Você tem certeza que deseja deletar o projeto?',
            showDenyButton: true,
            confirmButtonText: 'Deletar',
            denyButtonText: 'Cancelar',
        }).then(result => {
            if (result.isConfirmed) {
                axios.patch(`${baseUrl}users/projects`, body, {
                    headers: {
                        Authorization: token.token
                    }
                }).then(() => {
                    Swal.fire("Projeto deletado!")
                    setReload(!reload)
                    setProject("")
                }).catch(error => {
                    Swal.fire(error.response.data)
                })
            }
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
                                <h2>Bem vindo(a), {user.user_name}!</h2>

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

                        <section>
                            {selectedProject && (
                                <>
                                <div>
                                    <span>
                                        <h3>{project}</h3>
                                        <FiEdit onClick={() => setShowEditProjectInfo(true)}/>
                                        <BsTrash3 onClick={handleDeleteProject}/>
                                    </span>

                                    <p>Data de início: {selectedProject.start_date}</p>
                                    <p>Data de término: {selectedProject.end_date}</p>

                                    <span>
                                        <h4>Colaboradores - %</h4>
                                        <FiEdit onClick={() => setShowEditParticipation(true)}/>
                                        <BsTrash3 onClick={() => setShowDeleteCollaborator(true)}/>
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
                                </>
                            )}

                            {!selectedProject && (
                                <span className={styles.message}>
                                    <p>Selecione o projeto para visualizar os dados.</p>
                                    <GrSelect/>
                                </span>
                            )}
                        </section>
                    </>
                )}

                {showEditProjectInfo && <EditProjectInfoForm token={token.token} project={project} setShowEditProjectInfo={setShowEditProjectInfo} reload={reload} setReload={setReload}/>}
                {showEditParticipation && <EditParticipationForm token={token.token} project={project} selectedProject={selectedProject} setShowEditParticipation={setShowEditParticipation} reload={reload} setReload={setReload}/>}
                {showDeleteCollaborator && <DeleteCollaboratorForm token={token.token} project={project} collaborators={collaborators} setShowDeleteCollaborator={setShowDeleteCollaborator} reload={reload} setReload={setReload}/>}
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