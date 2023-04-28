import { useState } from "react"
import styles from "./registerCollaboratorForm.module.scss"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"
import { Loading } from "../loading/loading"
import { useForm } from "../../hooks/useForm"
import Swal from "sweetalert2"

export function RegisterCollaboratorForm ({user, project, token, reload, setReload}) {
    const [form, onChange] = useForm({employeeName: "", participation: ""})
    const [isLoading, setIsLoading] = useState(false)

    const allEmployees = user.employees.map(item => {
        return <option key={item.employee_name} value={item.employee_name}>{item.employee_name} - {item.status}</option>
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (form.participation === "") {
            Swal.fire("Insira o valor da participação.")
            setIsLoading(false)
            return
        }

        const body = {
            projectName: project,
            ...form
        }

        axios.patch(`${baseUrl}users/projects/add-collaborator`, body, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setIsLoading(false)
            setReload(!reload)
            Swal.fire("Colaborador adicionado com sucesso!")
        }).catch(err => {
            setIsLoading(false)
            Swal.fire(err.response.data)
        })
    }
    
    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <span>
                <label htmlFor="employeeName">Cadastre um colaborador:</label>
                <select name="employeeName" onChange={onChange} required>
                    <option value="">Selecione</option>
                    {allEmployees}
                </select>
            </span>

            <span>
                <span>
                    <label htmlFor="participation">Participação (%):</label>
                    <input type="number" placeholder="25" name="participation" value={form.participation} onChange={onChange}/>
                </span>

                <button>{isLoading? <span className={styles.button}><Loading insideButton={true}/></span> : '+'}</button>
            </span>
        </form>
    )
}