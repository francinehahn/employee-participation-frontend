import { useState } from "react"
import { Loading } from "../loading/loading"
import axios from "axios"
import { useForm } from "../../hooks/useForm"
import styles from "./deleteEmployeeForm.module.scss"
import { baseUrl } from "../../constants/baseUrl"

export function DeleteEmployeeForm ({setShowDeleteEmployeeForm, allEmployees, token, reload, setReload}) {
    const [form, onChange] = useForm({employeeName: ""})
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [axiosError, setAxiosError] = useState("")

    const handleDeleteEmployee = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessMessage("")
        setAxiosError("")

        axios.patch(`${baseUrl}users/employees/delete`, form, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setIsLoading(false)
            setSuccessMessage("Funcionário deletado com sucesso!")
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
                    setShowDeleteEmployeeForm(false)
                    setSuccessMessage("")
                    setAxiosError("")
                }}>x</button>
            </div>

            <div>
                <h4>Selecione o funcionário que deseja deletar:</h4>

                <form onSubmit={handleDeleteEmployee}>
                    <div>
                        <label htmlFor="employeeName">Nome do funcionário</label>
                        <select name="employeeName" value={form.employeeName} onChange={onChange} required>
                            <option value="">Selecione</option>
                            {allEmployees.map(item => {
                                return <option key={item.employee_name} value={item.employee_name}>{item.employee_name}</option>
                            })}
                        </select>
                    </div>
                    
                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                    {axiosError && <p className={styles.errorMessage}>{axiosError}</p>}

                    <button>{isLoading? <Loading insideButton={true}/> : 'Deletar'}</button>
                </form>
            </div>
        </div>
    )
}