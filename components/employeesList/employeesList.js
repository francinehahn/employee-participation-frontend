import axios from "axios"
import { BsTrash3 } from "react-icons/bs"
import { baseUrl } from "../../constants/baseUrl"
import styles from "./employeesList.module.scss"

export function EmployeesList ({item, token, reload, setReload}) {
    const handleDeleteEmployee = (name) => {
        const body = {
            employeeName: name
        }

        if (confirm("Você tem certeza que deseja deletar esse funcionário da sua conta?")) {
            axios.patch(`${baseUrl}users/employees/delete`, body, {
                headers: {
                    Authorization: token
                }
            }).then(() => {
                alert("Funcionário deletado com sucesso!")
                setReload(!reload)
            }).catch(error => {
                alert(error.response.data)
            })
        }
    }

    return (
        <div className={styles.container}>
            <input type="radio" name="employee" id={item.employee_name} value={item.employee_name}/>
            <label htmlFor={item.employee_name}>{item.employee_name}</label>
            <BsTrash3 onClick={() => handleDeleteEmployee(item.employee_name)}/>
            <br></br>
        </div>
    )
}