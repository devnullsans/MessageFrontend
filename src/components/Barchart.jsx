import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Barchart({ Dashdata }) {
  console.log(Dashdata);
  // Extract counts from the StaticData object
  const emailCount = Dashdata?.emailcount;
  const ipCount = Dashdata?.ipcount;
  const mobCount = Dashdata?.mobcount;
  // Define data and labels for the chart
  const data = {
    labels: ["Email Count", "IP Count", "Mobile Count"], // Labels for the X-axis
    datasets: [
      {
        label: "Counts", // Label for the dataset
        data: [emailCount, ipCount, mobCount], // Corresponding data values
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Blocked Counts of Email, IP, and Mobile",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} height={325} width={1450} />;
}

export default Barchart;
