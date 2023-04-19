import Chart from "react-apexcharts"

export default function PieChart ({projectInfo}) {
    let totalParticipation = 0

    projectInfo.collaborators.forEach(item => {
      totalParticipation += item.participation  
    })

    if (totalParticipation < 100) {
        const participationLeft = 100 - totalParticipation
        projectInfo.collaborators.push({employee_name: "Outros", participation: participationLeft})
    }

    const collaborators = projectInfo.collaborators.map(item => item.employee_name)
    const participation = projectInfo.collaborators.map(item => item.participation)

    
    return (
        <Chart
            type="pie"
            series={participation}
            options={{
                labels: collaborators,
                dataLabels: {
                    formatter(val, opts) {
                      const name = opts.w.globals.labels[opts.seriesIndex]
                      return [name, val.toFixed(1) + '%']
                    },
                    dropShadow: {
                        enabled: true,
                        left: 1,
                        top: 1,
                        opacity: .7
                    },
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }
                },
                legend: {
                    show: false
                }
            }}
            width={430}
        />
    )
}