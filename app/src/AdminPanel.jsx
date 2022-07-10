import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Typography } from "@mui/material";
import { clean } from "./API";

export default function AdminPanel() {
  const [cleanResult, setCleanResult] = useState([]);
  const [cleaning, setCleaning] = useState(false);

  const doClean = async () => {
    setCleaning(true);
    const result = await clean();
    setCleaning(false);
    setCleanResult(result);
  };

  return (
    <>
      <Typography variant="h5">Admin Stuff</Typography>
      {!cleaning && <Button color="success" variant="contained" onClick={() => doClean()}>Clean</Button>}
      {cleaning && <CircularProgress />}
      <pre>{JSON.stringify(cleanResult, null, 2)}</pre>
    </>
  );
}
