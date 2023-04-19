import { useEffect, useState } from "react"
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

const PieChartWithNoSSR = dynamic(
    () => import("../../components/pieChart/pieChart"),
    { ssr: false }
)

const BarChartWithNoSSR = dynamic(
    () => import("../../components/barChart/barChart"),
    { ssr: false }
)

export default function Projects ({token}) {
    const [project, setProject] = useState("")
    const [user, setUser] = useState("")
    const [chartType, setChartType] = useState("pieChart")
    const [reload, setReload] = useState(false)

    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false
    
    //get user info
    useEffect(() => {
        axios.get(`${baseUrl}users/account`, {
            headers: {
                Authorization: token.token
            }
        }).then(response => setUser(response.data))
        .catch(error => alert(error.response.data))
    }, [reload, token.token])

    //get all project names to use in the select tag
    const allProjects = user && user.projects.map(item => {
        return <option key={item.project_name} value={item.project_name}>{item.project_name}</option>
    })

    //info of the project selected
    const selectedProject = user && project && user.projects.filter(item => item.project_name === project)[0]

    //get collaborators of the project
    const collaborators = user && project && getTotalParticipation(selectedProject.collaborators)

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
                        <h3>Bem vindo(a), {user.user_name}!</h3>

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
                            <h2>{selectedProject.project_name}</h2>
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