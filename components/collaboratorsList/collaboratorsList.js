import {BsTrash3} from "react-icons/bs"
import styles from "./collaboratorsList.module.scss"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"
import Swal from "sweetalert2"

export function CollaboratorsList ({project, collaborators, token, reload, setReload}) {
    const handleDeleteCollaborator = (employeeName) => {
        if (employeeName === "Outros") {
            return
        }

        const body = {
            projectName: project,
            collaborator: employeeName
        }

        Swal.fire({
            title: 'Você tem certeza que deseja deletar esse colaborador?',
            showDenyButton: true,
            confirmButtonText: 'Deletar',
            denyButtonText: 'Cancelar',
        }).then(result => {
            if (result.isConfirmed) {
                axios.patch(`${baseUrl}users/projects/delete-collaborator`, body, {
                    headers: {
                        Authorization: token
                    }
                }).then(() => {
                    Swal.fire("Colaborador deletado com sucesso!")
                    setReload(!reload)
                }).catch(error => Swal.fire(error.response.data))
            }
        })        
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