import styles from "./collaboratorsList.module.scss"

export function CollaboratorsList ({projectInfo}) {
    let totalParticipation = 0
    const renderCollaborators = projectInfo.collaborators.map(item => {
        totalParticipation += item.participation
        return <li key={item.employee_name}>{item.employee_name} - {item.participation}%</li>
    })

    return (
        <ul className={styles.container}>
            {renderCollaborators}
            <li>Outros - {100 - totalParticipation}%</li>
        </ul>
    )
}