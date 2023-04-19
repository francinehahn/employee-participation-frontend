import styles from "./collaboratorsList.module.scss"

export function CollaboratorsList ({projectInfo}) {
    const renderCollaborators = projectInfo.collaborators.map(item => {
        return <li key={item.employee_name}>{item.employee_name} - {item.participation}%</li>
    })

    return (
        <ul className={styles.container}>
            {renderCollaborators}
        </ul>
    )
}