import Chart from "react-apexcharts"

export default function PieChart ({collaborators}) {
    const employees = collaborators.map(item => item.employee_name)
    const participation = collaborators.map(item => item.participation)

    return (
        <Chart
            type="pie"
            series={participation}
            options={{
                labels: employees,
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
            width={410}
        />
    )
}