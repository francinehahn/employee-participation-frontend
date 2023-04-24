import Chart from "react-apexcharts"

export default function EmployeeChart ({data, employee}) {
    const series = []

    data.forEach(element => {
        series.push({x: element.project_name, y: element.participation})
    })

    const projects = data.map(element => element.project_name)
    
    return (                
        <>
            <h3>{employee}</h3>

            <Chart
                type="bar"
                series={[{name: "Gráfico de barras", data: series}]}
                options={{
                    plotOptions: {
                        bar: {
                          horizontal: true
                        }
                    },
                    xaxis: {
                        categories: projects,
                        title: {text: "Participação %"}
                    },
                    yaxis: {
                        title: {text: "Projetos"}
                    },
                    fill: {
                        colors: ['#FFCF00']
                    },
                    dataLabels: {
                        enabled: false,
                        style: {
                            colors: ['#373737']
                        }
                    },
                    responsive: [{
                        breakpoint: undefined,
                        options: {},
                    }]
                }}
                width={550}
            />
        </>
    )
}