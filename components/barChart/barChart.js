import Chart from "react-apexcharts"

export default function BarChart ({projectInfo}) {
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
            type="bar"
            series={[{name: "Gráfico de barras", data: participation}]}
            options={{
                xaxis: {
                    categories: collaborators,
                    title: {text: "Funcionários"}
                },
                fill: {
                    colors: ['#FFCF00']
                },
                dataLabels: {
                    formatter: function (val) {
                        return val + "%"
                    },
                    style: {
                        colors: ['#373737']
                    }
                }
            }}
            width={450}
        />
    )
}