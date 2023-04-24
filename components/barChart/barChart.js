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
                dataLabels: {
                    formatter: function (val) {
                        return val + "%"
                    },
                    style: {
                        colors: ['#373737']
                    }
                },
                fill: {
                    colors: ['#FFBF00', '#F980FF', '#FFA548', '#FF00ED', '#00BAFF', '#6984FF', '#8700FF', '#00FF94', '#3B00FF', '#008D17', '#FF4D00', '#00FFBA', '#7D0084', '#008460', '#A7B7FF', '#FF8383', '#97AB98', '#001584']
                }
            }}
            width={450}
        />
    )
}