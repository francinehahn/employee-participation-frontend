import Chart from "react-apexcharts"

export default function PieChart ({collaborators}) {
    const employees = collaborators.map(item => item.employee_name)
    const participation = collaborators.map(item => item.participation)

    return (
        <Chart
            type="donut"
            series={participation}
            options={{
                labels: employees,
                dataLabels: {
                    formatter(val) {
                        return [val + '%']
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
                    show: true,
                    position: 'right',
                    offsetY: -22,
                    markers: {
                        width: 12,
                        height: 12,
                        radius: 0,
                        offsetX: -15,
                        offsetY: 13,
                        radius: 10
                    },
                    itemMargin: {
                        horizontal: 5,
                        vertical: -3
                    }
                },
                colors: ['#FFBF00', '#F980FF', '#AEE125', '#FF00ED', '#00BAFF', '#6984FF', '#8700FF', '#00FF94', '#3B00FF', '#008D17', '#FF4D00', '#00FFBA', '#7D0084', '#008460', '#A7B7FF', '#FF8383', '#97AB98', '#001584'],
                responsive: [{
                    breakpoint: 450,
                    options: {
                        chart: {
                            width: 350,
                            height: 500
                        },
                        legend: {
                            offsetY: -27,
                        }
                    }
                }]
            }}
            width={430}
            height={550}
        />
    )
}