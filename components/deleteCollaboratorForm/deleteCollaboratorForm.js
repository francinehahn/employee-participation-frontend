import { useState } from "react"
import styles from "./deleteCollaboratorForm.module.scss"
import { useForm } from "../../hooks/useForm"
import { Loading } from "../loading/loading"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"

export function DeleteCollaboratorForm ({token, project, collaborators, setShowDeleteCollaborator, reload, setReload}) {
    const [form, onChange] = useForm({collaborator: ""})
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [invalidCollaboratorMessage, setInvalidCollaboratorMessage] = useState("")
    const [axiosError, setAxiosError] = useState("")
    
    const handleDeleteCollaborator = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setAxiosError("")
        setSuccessMessage("")

        if (form.collaborator === "Outros") {
            setIsLoading(false)
            setInvalidCollaboratorMessage("Selecione um colaborador válido.")
            return
        }

        const body = {
            projectName: project,
            collaborator: form.collaborator
        }

        axios.patch(`${baseUrl}users/projects/delete-collaborator`, body, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setIsLoading(false)
            setSuccessMessage("Colaborador deletado com sucesso!")
            setReload(!reload)
        }).catch(error => {
            setIsLoading(false)
            setAxiosError(error.response.data)
        })
    }

    return (
        <div className={styles.container}>
            <div>
                <button onClick={() => {
                    setShowDeleteCollaborator(false)
                    setSuccessMessage("")
                    setAxiosError("")
                }}>x</button>
            </div>

            <div>
                <h4>Selecione o colaborador que deseja deletar:</h4>

                <form onSubmit={handleDeleteCollaborator}>
                    <div>
                        <label htmlFor="collaborator">Nome do colaborador</label>
                        <select name="collaborator" value={form.collaborator} onChange={onChange} required>
                            <option value="">Selecione</option>
                            {collaborators.map(item => {
                                return <option key={item.employee_name} value={item.employee_name}>{item.employee_name}</option>
                            })}
                        </select>
                    </div>
                    
                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                    {invalidCollaboratorMessage && <p className={styles.errorMessage}>{invalidCollaboratorMessage}</p>}
                    {axiosError && <p className={styles.errorMessage}>{axiosError}</p>}

                    <button>{isLoading? <Loading insideButton={true}/> : 'Deletar'}</button>
                </form>
            </div>
        </div>
    )
}