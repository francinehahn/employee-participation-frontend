import styles from "./collaboratorsList.module.scss"

export function CollaboratorsList ({collaborators}) {
    const renderCollaborators = collaborators.map(item => {
        return <li key={item.employee_name}>{item.employee_name} - {item.participation}%</li>
    })

    return (
        <ul className={styles.container}>
            {renderCollaborators}
        </ul>
    )
}