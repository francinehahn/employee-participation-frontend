import { useState } from "react"
import { useForm } from "../../hooks/useForm"
import { Loading } from "../loading/loading"
import styles from "./editEmployeeStatus.module.scss"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"

export function EditEmployeeStatus ({setShowEditEmployeeStatusForm, allEmployees, token, reload, setReload}) {
    const [form, onChange, clearInputs] = useForm({employeeName: "", newStatus: ""})
    const [isLoading, setIsLoading] = useState(false)
    const [axiosError, setAxiosError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    
    const handleEditStatus = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setAxiosError("")
        setSuccessMessage("")

        axios.patch(`${baseUrl}users/employees/edit`, form, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setIsLoading(false)
            setSuccessMessage("Status editado com sucesso!")
            clearInputs()
            setReload(reload)
        }).catch(error => {
            setIsLoading(false)
            setAxiosError(error.response.data)
        })
    }

    return (
        <div className={styles.container}>
            <div>
                <button onClick={() => {
                    setShowEditEmployeeStatusForm(false)
                    setAxiosError("")
                    setSuccessMessage("")
                }}>x</button>
            </div>

            <form onSubmit={handleEditStatus}>
                <div>
                    <label htmlFor="employeeName">Selecione o funcionário e edite o seu status:</label>
                    <select name="employeeName" onChange={onChange} required>
                        <option value="">Selecione</option>
                        {allEmployees.map(employee => {
                            return <option key={employee.employee_name} value={employee.employee_name}>{employee.employee_name}</option>
                        })}
                    </select>
                </div>

                <div>
                    <label htmlFor="newStatus">Nome do projeto</label>
                    <select name="newStatus" onChange={onChange} required>
                        <option value="">Selecione</option>
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                    </select>
                </div>

                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                {axiosError && <p className={styles.errorMessage}>{axiosError}</p>}

                <button>{isLoading? <Loading insideButton={true}/> : 'Enviar'}</button>
            </form>
        </div>    
    )
}