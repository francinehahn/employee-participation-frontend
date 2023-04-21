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
                    xaxis: {
                        categories: projects,
                        title: {text: "Projetos"}
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
                width={480}
            />
        </>
    )
}