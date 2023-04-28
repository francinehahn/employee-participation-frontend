import Chart from "react-apexcharts"

export default function Ranking ({data}) {
    const employees = data.map(item => item.employee_name)
    const participation = data.map(item => item.avg_participation)
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
                height={height}
            />
        </>
    )
}