import React, { useContext, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ReactJson from "react-json-view";
import { clean } from "./API";
import FormGroup from "@mui/material/FormGroup";
import { AppContext } from "./ScraperApp";

export default function AdminPanel() {
  const [active, setActive] = useState(false);
  const [cleanResult, setCleanResult] = useState([]);
  const [cleaning, setCleaning] = useState(false);
  const [params, setParams] = useState([]);

  const appContext = useContext(AppContext);

  const doClean = async () => {
    setCleaning(true);
    const result = await clean(params);
    setCleaning(false);
    setCleanResult(result);
  };

  const handleCheck = (checked, type) => {
    if (!checked) {
      setParams(params.filter((a) => a !== type));
    } else {
      setParams([...params, type]);
    }
  };

  return (
    <>
      {appContext.sessionToken && (
        <Button href="#" onClick={() => setActive(true)}>
          Admin
        </Button>
      )}
      <Dialog open={active} onClose={() => setActive(false)}>
        <DialogTitle>Admin</DialogTitle>
        <DialogContent>
          <>
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          handleCheck(e.target.checked, "dry");
                        }}
                        checked={params.includes("dry")}
                      />
                    }
                    label="Dry Run"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          handleCheck(e.target.checked, "name");
                        }}
                        checked={params.includes("name")}
                      />
                    }
                    label="Name Search"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          handleCheck(e.target.checked, "location");
                        }}
                        checked={params.includes("location")}
                      />
                    }
                    label="Location Search"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          handleCheck(e.target.checked, "smart");
                        }}
                        checked={params.includes("smart")}
                      />
                    }
                    label="Smart Search"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          handleCheck(e.target.checked, "dumb");
                        }}
                        checked={params.includes("dumb")}
                      />
                    }
                    label="Dumb Search"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          handleCheck(e.target.checked, "price_search");
                        }}
                        checked={params.includes("price_search")}
                      />
                    }
                    label="Price Search"
                  />
                </FormGroup>
              </>
            )}
            {cleaning && <CircularProgress />}
            <ReactJson theme="pop" src={cleanResult} />
          </>
          <DialogActions>
            <Button onClick={() => setActive(false)}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
