import { useState } from "react"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"
import { useForm } from "../../hooks/useForm"
import { Loading } from "../loading/loading"
import styles from "./editParticipation.module.scss"


export function EditParticipation ({token, project, selectedProject, setShowEditParticipation, reload, setReload}) {
    const [form, onChange, clearInputs] = useForm({employeeName: "", participation: ""})
    const [isLoading, setIsLoading] = useState(false)
    const [successParticipation, setSuccessParticipation] = useState("")
    const [axiosErrorParticipation, setAxiosErrorParticipation] = useState("")
    const [missingInfoParticipation, setMissingInfoParticipation] = useState("")
    const [invalidEmployeeName, setInvalidEmployeeName] = useState("")

    const handleEditParticipation = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessParticipation("")
        setAxiosErrorParticipation("")
        setMissingInfoParticipation("")
        setInvalidEmployeeName("")

        if (form.employeeName === "" || form.employeeName === "Outros") {
            setInvalidEmployeeName("Selecione um colaborador.")
            setIsLoading(false)
            return
        }
        if (!form.participation) {
            setMissingInfoParticipation("Informe a nova participação.")
            setIsLoading(false)
            return
        }

        const body = {
            projectName: project,
            employeeName: form.employeeName,
            participation: form.participation
        }

        axios.patch(`${baseUrl}users/projects/edit-collaborator`, body, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setIsLoading(false)
            setSuccessParticipation("Participação editada com sucesso!")
            clearInputs()
            setReload(!reload)
        }).catch(error => {
            setIsLoading(false)
            setAxiosErrorParticipation(error.response.data)
        })
    }

    return (
        <div className={styles.container}>
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
                    <div>
                        <label htmlFor="employeeName">Selecione o colaborador</label>
                        <select name="employeeName" onChange={onChange}>
                            <option value="">Selecione</option>
                            {selectedProject.collaborators.map(item => {
                                return <option key={item.employee_name} value={item.employee_name}>{item.employee_name}</option>
                            })}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="participation">Participação</label>
                        <input type="number" name="participation" placeholder="15" value={form.participation} onChange={onChange}/>
                    </div>

                    {successParticipation && <p className={styles.successMessage}>{successParticipation}</p>}
                    {axiosErrorParticipation && <p className={styles.errorMessage}>{axiosErrorParticipation}</p>}
                    {missingInfoParticipation && <p className={styles.errorMessage}>{missingInfoParticipation}</p>}
                    {invalidEmployeeName && <p className={styles.errorMessage}>{invalidEmployeeName}</p>}

                    <button>{isLoading? <Loading insideButton={true}/> : 'Enviar'}</button>
                </form>
            </div>
        </div>    
    )
}