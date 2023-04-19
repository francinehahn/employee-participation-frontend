export function getTotalParticipation (collaborators) {
    let totalParticipation = 0

    collaborators.forEach(item => {
      totalParticipation += item.participation  
    })

    if (totalParticipation < 100) {
        const participationLeft = 100 - totalParticipation
        collaborators.push({employee_name: "Outros", participation: participationLeft})
    }

    return collaborators
}