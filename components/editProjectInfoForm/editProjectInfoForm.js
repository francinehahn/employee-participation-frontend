import { useState } from "react"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"
import { useForm } from "../../hooks/useForm"
import { Loading } from "../loading/loading"
import styles from "./editProjectInfoForm.module.scss"


export function EditProjectInfoForm ({token, project, setShowEditProjectInfo, reload, setReload}) {
    const [form, onChange, clearInputs] = useForm({newProjectName: "", startDate: "", endDate: ""})
    const [isLoading, setIsLoading] = useState(false)
    const [successEditProject, setSuccessEditProject] = useState("")
    const [axiosErrorEditProject, setAxiosErrorEditProject] = useState("")
    const [missingInfoEditProject, setMissingInfoEditProject] = useState("")
    
    const handleEditProjectInfo = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessEditProject("")
        setAxiosErrorEditProject("")
        setMissingInfoEditProject("")

        if (!form.newProjectName && !form.startDate && !form.endDate) {
            setMissingInfoEditProject("Nenhuma informação para ser alterada.")
            setIsLoading(false)
            return
        }

        const body = {
            currentProjectName: project,
            newProjectName: form.newProjectName,
            startDate: form.startDate.split("-").reverse().join("/"),
            endDate: form.endDate.split("-").reverse().join("/")
        }

        axios.patch(`${baseUrl}users/projects/edit`, body, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setIsLoading(false)
            setSuccessEditProject("Informações editadas com sucesso!")
            clearInputs()
            setReload(!reload)
        }).catch(error => {
            setIsLoading(false)
            setAxiosErrorEditProject(error.response.data)
        })
    }

    return (
        <div className={styles.container}>
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
                        <label htmlFor="newProjectName">Nome do projeto</label>
                        <input type="text" name="newProjectName" placeholder={project} value={form.newProjectName} onChange={onChange}/>
                    </div>

                    <div>
                        <label htmlFor="startDate">Data de início</label>
                        <input type="date" name="startDate" value={form.startDate} onChange={onChange}/>
                    </div>

                    <div>
                        <label htmlFor="endDate">Data de início</label>
                        <input type="date" name="endDate" value={form.newEndDate} onChange={onChange}/>
                    </div>

                    {successEditProject && <p className={styles.successMessage}>{successEditProject}</p>}
                    {axiosErrorEditProject && <p className={styles.errorMessage}>{axiosErrorEditProject}</p>}
                    {missingInfoEditProject && <p className={styles.errorMessage}>{missingInfoEditProject}</p>}

                    <button>{isLoading? <Loading insideButton={true}/> : 'Enviar'}</button>
                </form>
            </div>
        </div>
    )
}