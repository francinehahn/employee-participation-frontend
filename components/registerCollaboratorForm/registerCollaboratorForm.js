import { useState } from "react"
import styles from "./registerCollaboratorForm.module.scss"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"
import { LoadingButton } from "../loadingButton/loadingButton"

export function RegisterCollaboratorForm ({user, project, token}) {
    const [employee, setEmployee] = useState("")
    const [participation, setParticipation] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const allEmployees = user.employees.map(item => {
        return <option key={item.employee_name} value={item.employee_name}>{item.employee_name} - {item.status}</option>
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (participation === "") {
            alert("Insira o valor da participação.")
        }

        const body = {
            projectName: project,
            employeeName: employee,
            participation
        }

        axios.patch(`${baseUrl}users/projects/add-collaborator`, body, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setIsLoading(false)
            setEmployee("")
            setParticipation("")
            alert("Colaborador adicionado com sucesso!")
        }).catch(err => {
            setIsLoading(false)
            setEmployee("")
            setParticipation("")
            alert(err.response.data)
        })
    }
    
    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <span>
                <label htmlFor="employee">Selecione o funcionário:</label>
                <select name="employee" onChange={e => setEmployee(e.target.value)} required>
                    <option value="">Selecione</option>
                    {allEmployees}
                </select>
            </span>

            <span>
                <label htmlFor="participation">Participação (%):</label>
                <input type="number" placeholder="25%" name="participation" value={participation} onChange={e => setParticipation(e.target.value)}/>
            </span>

            <button>{isLoading? <LoadingButton/> : "Cadastrar"}</button>
        </form>
    )
}