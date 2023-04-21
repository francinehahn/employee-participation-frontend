import {BsTrash3} from "react-icons/bs"
import styles from "./collaboratorsList.module.scss"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"

export function CollaboratorsList ({project, collaborators, token, reload, setReload}) {
    console.log({project, collaborators, token, reload, setReload})
    const handleDeleteCollaborator = (employeeName) => {
        if (employeeName === "Outros") {
            return
        }

        const body = {
            projectName: project,
            collaborator: employeeName
        }

        if (confirm("Você tem certeza que deseja deletar esse colaborador?")) {
            axios.patch(`${baseUrl}users/projects/delete-collaborator`, body, {
                headers: {
                    Authorization: token
                }
            }).then(() => {
                alert("Colaborador deletado com sucesso!")
                setReload(!reload)
            })
            .catch(error => alert(error.response.data))
        }
    }

    const renderCollaborators = collaborators.map(item => {
        return <li key={item.employee_name}>{item.employee_name} - {item.participation}% <BsTrash3 onClick={() => handleDeleteCollaborator(item.employee_name)}/></li>
    })

    return (
        <ul className={styles.container}>
            {renderCollaborators}
        </ul>
    )
}