import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, Title, Tooltip, Legend, ArcElement } from "chart.js";

Chart.register(Title, Tooltip, Legend, ArcElement);

function DoughnutChart({ Dashdata }) {
  const emailCount = Dashdata?.emailcount;
  const ipCount = Dashdata?.ipcount;
  const mobCount = Dashdata?.mobcount;

  const data = {
    labels: ["Email Count", "IP Count", "Mobile Count"],
    datasets: [
      {
        data: [emailCount, ipCount, mobCount],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Doughnut Chart of Blocked Counts" },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default DoughnutChart;
