import React, { useEffect, useState } from "react";
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

export default function PriceHistory({ data }) {
  const [processedData, setProcessedData] = useState(null);
  useEffect(() => {
    setProcessedData(processData(data));
  }, [data]);

  const processData = (data) => {
    const labels = [];
    const averages = [[], [], [], [], []];
    const ages = [14, 18, 25, 45, 65];

    for (const [label, value] of Object.entries(data)) {
      let skip = false;

      for (var i = 0; i < ages.length; i++) {
        const age = ages[i];

        if (!value[age]) {
          console.log(
            "Price History: Skipping " +
              label +
              " because it does not contain the right ages."
          );
          skip = true;
          break;
        }
        averages[i].push(value[age].price);
      }

      if (!skip) labels.push(label);
    }

    return { labels, averages };
  };

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

  if (processedData) {
    const graphData = {
      labels: processedData.labels,
      datasets: [
        {
          label: "14",
          data: processedData.averages[0],
          borderColor: "green",
          backgroundColor: "green",
        },
        {
          label: "18",
          data: processedData.averages[1],
          borderColor: "red",
          backgroundColor: "red",
        },
        {
          label: "25",
          data: processedData.averages[2],
          borderColor: "purple",
          backgroundColor: "purple",
        },
        {
          label: "45",
          data: processedData.averages[3],
          borderColor: "orange",
          backgroundColor: "orange",
        },
        {
          label: "65",
          data: processedData.averages[4],
          borderColor: "black",
          backgroundColor: "black",
        },
      ],
    };
    return (
      <Box p={2}>
        <Line options={options} data={graphData} />
      </Box>
    );
  } else {
    return <CircularProgress />;
  }
}
