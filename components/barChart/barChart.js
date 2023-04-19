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