import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ResultsChart = ({ results }) => {
  // Sort results by vote count in descending order
  const sortedResults = [...results].sort((a, b) => b.voteCount - a.voteCount)

  const data = {
    labels: sortedResults.map((result) => result.name),
    datasets: [
      {
        label: "Votes",
        data: sortedResults.map((result) => result.voteCount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Election Results",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

export default ResultsChart
