import Chart from "react-apexcharts"

export default function Ranking ({data}) {
    const employees = data.map(item => item.employee_name)
    const participation = data.map(item => item.avg_participation)
    let height

    if (data.length < 10) {
        height = 400
    } else if (data.length >= 10 && data.length < 20) {
        height = 500
    } else if (data.length >= 20) {
        height = 600
    }

    return (
        <>
            <h3>Média de participação de cada funcionário</h3>

            <Chart
                type="bar"
                series={[{name: "Gráfico de barras", data: participation}]}
                options={{
                    plotOptions: {
                        bar: {
                          horizontal: true
                        }
                    },
                    xaxis: {
                        categories: employees,
                        title: {text: "Participação %"}
                    },
                    yaxis: {
                        title: {text: "Funcionários"}
                    },
                    fill: {
                        colors: ['#FFCF00']
                    },
                    dataLabels: {
                        enabled: false,
                        style: {
                            colors: ['#373737']
                        }
                    }
                }}
                width={650}
                height={height}
            />
        </>
    )
}