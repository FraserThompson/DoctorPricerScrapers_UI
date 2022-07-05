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
      setPricehistory(await getPriceHistory());
    };
    fetchData();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5">Average fees by age</Typography>
      <Typography variant="subtitle1" gutterBottom>
        NZ Wide
      </Typography>
      {averages ? <Averages data={averages} /> : <CircularProgress />}
      {priceHistory ? <PriceHistory data={priceHistory}/> : <CircularProgress />}
    </Box>
  );
}
