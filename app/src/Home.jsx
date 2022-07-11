import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Typography } from "@mui/material";
import { clean, getAverages, getPriceHistory, getSessionToken } from "./API";
import Averages from "./Averages";
import PriceHistory from "./PriceHistory";
import AdminPanel from "./AdminPanel";

export default function Home({ meta }) {
  const [averages, setAverages] = useState(null);
  const [priceHistory, setPricehistory] = useState(null);

  const sessionToken = getSessionToken();

  useEffect(() => {
    const fetchData = async () => {
      setAverages(await getAverages());
      setPricehistory(await getPriceHistory());
    };
    fetchData();
  }, []);

  if (meta) {
    return (
      <Box p={2}>
        <Typography variant="h5">
          Total Practices: <strong>{meta.count}</strong>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>{Number((meta.enrolling / meta.count) * 100).toFixed(2)}% enrolling</strong> (
          {meta.enrolling} enrolling, {meta.notEnrolling} not enrolling)
        </Typography>
        <Typography variant="h5">Average fees by age</Typography>
        <Typography variant="subtitle1" gutterBottom>
          NZ Wide
        </Typography>
        {averages ? <Averages data={averages} /> : <CircularProgress />}
        {priceHistory ? (
          <PriceHistory data={priceHistory} />
        ) : (
          <CircularProgress />
        )}
        {sessionToken && <AdminPanel />}
      </Box>
    );
  }
}
