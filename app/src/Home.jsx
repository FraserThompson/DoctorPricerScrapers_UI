import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";
import { getAverages, getPriceHistory } from "./API";
import Averages from "./Averages";
import PriceHistory from "./PriceHistory";

export default function Home() {
  const [averages, setAverages] = useState(null);
  const [priceHistory, setPricehistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setAverages(await getAverages());
      setPricehistory(await priceHistoryData());
    };
    fetchData();
  }, []);

  const priceHistoryData = async () => {
    const data = await getPriceHistory();

    const labels = [];
    const averages = [[], [], [], [], []];

    for (const [key, value] of Object.entries(data)) {
      try {
        averages[0].push(value["14"].price);
        averages[1].push(value["18"].price);
        averages[2].push(value["25"].price);
        averages[3].push(value["45"].price);
        averages[4].push(value["65"].price);
      } catch (error) {
        continue;
      }
      labels.push(key);
    }

    return { labels, averages };
  };

  return (
    <Box p={2}>
      <Typography variant="h5">Average fees by age</Typography>
      <Typography variant="subtitle1" gutterBottom>
        NZ Wide
      </Typography>
      {averages ? <Averages data={averages} /> : <CircularProgress />}:
      {priceHistory ? <PriceHistory data={priceHistory}/> : <CircularProgress />}
    </Box>
  );
}
