import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceHistory({data}) {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Average Price History",
      },
    },
  };

  const graphData = {
    labels: data.labels,
    datasets: [
      {
        label: "14",
        data: data.averages[0],
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        label: "18",
        data: data.averages[1],
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "25",
        data: data.averages[2],
        borderColor: "purple",
        backgroundColor: "purple",
      },
      {
        label: "45",
        data: data.averages[3],
        borderColor: "orange",
        backgroundColor: "orange",
      },
      {
        label: "65",
        data: data.averages[4],
        borderColor: "black",
        backgroundColor: "black",
      },
    ],
  };

  if (data) {
    return (
      <Box p={2}>
        <Line options={options} data={graphData} />
      </Box>
    );
  } else {
    return <CircularProgress />;
  }
}
