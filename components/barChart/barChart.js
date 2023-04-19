import Chart from "react-apexcharts"

export default function BarChart ({collaborators}) {
    const employees = collaborators.map(item => item.employee_name)
    const participation = collaborators.map(item => item.participation)

    return (
        <Chart
            type="bar"
            series={[{name: "Gráfico de barras", data: participation}]}
            options={{
                xaxis: {
                    categories: employees,
                    title: {text: "Funcionários"}
                },
                yaxis: {
                    categories: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    title: {text: "Participação %"}
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