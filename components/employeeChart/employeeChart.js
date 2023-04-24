import Chart from "react-apexcharts"

export default function EmployeeChart ({data, employee}) {
    const series = []

    let height
    if (data.length < 5) {
        height = 300
    } else if (data.length >= 5 && data.length < 10) {
        height = 400
    } else if (data.length >= 10 && data.length < 20) {
        height = 500
    } else if (data.length >= 20 && data.length < 30) {
        height = 600
    } else if (data.length >= 30) {
        height = 900
    }

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
                width={650}
                height={height}
            />
        </>
    )
}