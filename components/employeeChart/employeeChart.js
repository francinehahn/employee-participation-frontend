import Chart from "react-apexcharts"

export default function EmployeeChart ({data, employee}) {
    const series = []
    
    data.forEach(element => {
        series.push({x: `${element.project_name} - ${element.end_date}`, y: element.collaborator_participation, goals: [
            {
                name: 'Média de participação de todos os colaboradores',
                value: element.avg_participation,
                strokeHeight: 5,
                strokeColor: '#FF00ED'
            }
        ]})
    })

    const projects = data.map(element => element.project_name)
    
    return (                
        <>
            <h3>{employee}</h3>

            <Chart
                type="bar"
                series={[{name: "Participação do funcionário", data: series}]}
                options={{
                    yaxis: {
                        categories: projects,
                        title: {text: "Participação %"}
                    },
                    xaxis: {
                        title: {text: "Projeto - Data de término"}
                    },
                    fill: {
                        colors: ['#FFCF00']
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    legend: {
                        show: true,
                        showForSingleSeries: true,
                        customLegendItems: ['Participação do colaborador', 'Média de participação do grupo'],
                        markers: {
                            fillColors: ['#FFCF00', '#FF00ED']
                        },
                        offsetY: 5,
                    },
                    responsive: [
                        {
                            breakpoint: 1110,
                            options: {
                                chart: {
                                    width: 600
                                }
                            }
                        },
                        {
                            breakpoint: 1000,
                            options: {
                                chart: {
                                    width: 550
                                }
                            }
                        },
                        {
                            breakpoint: 950,
                            options: {
                                chart: {
                                    width: 500
                                }
                            }
                        },
                        {
                            breakpoint: 890,
                            options: {
                                chart: {
                                    width: 450
                                }
                            }
                        },
                        {
                            breakpoint: 832,
                            options: {
                                chart: {
                                    width: 600
                                }
                            }
                        },
                        {
                            breakpoint: 660,
                            options: {
                                chart: {
                                    width: 500
                                }
                            }
                        },
                        {
                            breakpoint: 570,
                            options: {
                                chart: {
                                    width: 400
                                }
                            }
                        },
                        {
                            breakpoint: 470,
                            options: {
                                chart: {
                                    width: 350
                                }
                            }
                        },
                        {
                            breakpoint: 400,
                            options: {
                                chart: {
                                    width: 300
                                }
                            }
                        }
                    ]
                }}
                width={650}
            />
        </>
    )
}