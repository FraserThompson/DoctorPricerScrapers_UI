import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import ReactJson from 'react-json-view'
import { clean } from "./API";
import FormGroup from "@mui/material/FormGroup";

export default function AdminPanel() {
  const [cleanResult, setCleanResult] = useState([]);
  const [cleaning, setCleaning] = useState(false);
  const [dryCleaning, setDryCleaning] = useState(false);

  const doClean = async () => {
    setCleaning(true);
    const result = await clean(dryCleaning);
    setCleaning(false);
    setCleanResult(result);
  };

  const handleCheckbox = (e) => {
    setDryCleaning(e.target.checked ? true : false);
  }

  return (
    <>
      <Typography variant="h5">Admin Stuff</Typography>
      {!cleaning && (
        <>
          <FormGroup>
            <Button
              color="success"
              variant="contained"
              onClick={() => doClean()}
            >
              Clean
            </Button>
            <FormControlLabel control={<Checkbox onChange={handleCheckbox} checked={dryCleaning}/>} label="Dry Run" />
          </FormGroup>
        </>
      )}
      {cleaning && <CircularProgress />}
      <ReactJson theme="pop" src={cleanResult} />
    </>
  );
}
