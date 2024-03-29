import React, { useContext, useEffect, useState } from "react";
import Moment from "react-moment";
import { formatDate } from "./Utils";

import Button from "@mui/material/Button";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogActions, ListItem, Typography } from "@mui/material";
import { AppContext } from "./ScraperApp";
import { checkTask } from "./API";

export default function PHOListItem({ pho, handleSelect }) {
  const [dialogActive, setDialogActive] = useState(false);
  const [time, setTime] = useState(null);

  const appContext = useContext(AppContext);

  useEffect(() => {
    const state = appContext.getTaskState(pho.module);

    // If we have state and we haven't already started checking
    if (state && state.id) {
      updateTask(pho);
    }
  }, [appContext.taskStates]);

  function handleDialogToggle() {
    setDialogActive(!dialogActive);
  }

  async function updateTask() {
    const state = appContext.getTaskState(pho.module);
    if (!pho || !state || !state.id || state.state == "Error") return;

    console.log(
      "Checking the status of " + state["id"] + " from " + pho.module
    );

    const response = await checkTask(state["id"]);

    if (!response.error) {
      setTime(response.data.date_done);

      if (response.data.status == "SUCCESS") {
        const newState = { id: null, state: "Done" };
        appContext.setTaskState(pho.module, newState);
      } else if (response.data.status == "PENDING") {
        const newState = { ...state, state: response.data.meta };
        appContext.setTaskState(pho.module, newState);
      } else if (response.data.status == "REVOKED") {
        const newState = { id: null, state: "Stopped" };
        appContext.setTaskState(pho.module, newState);
      } else {
        const newState = {
          id: null,
          state: "Error",
          error: response.data.result,
        };
        appContext.setTaskState(pho.module, newState);
      }
    } else {
      const newState = { ...state, state: "Error", error: response.error };
      appContext.setTaskState(pho.module, newState);
    }
  }

  const theState = appContext.getTaskState(pho.module);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleSelect(pho)}>
          <ListItemIcon>
            <Typography variant="h5">
              {String(pho.number_of_practices)}
            </Typography>
          </ListItemIcon>
          <ListItemText
            primary={pho.name}
            secondary={
              <>
                {theState && (
                  <>
                    {theState.state}{" "}
                    {theState.error && !time && (
                      <Button
                        onClick={() => handleDialogToggle()}
                        color="error"
                      >
                        Show
                      </Button>
                    )}
                  </>
                )}
                {time && (
                  <span>
                    since <Moment fromNow>{time}</Moment>
                  </span>
                )}
                {!time && <>Last Scrape: {formatDate(pho.last_run)}</>}
              </>
            }
          ></ListItemText>
        </ListItemButton>
      </ListItem>
      <Dialog open={dialogActive}>
        <DialogTitle>
          {pho.name + " Error"}
          <Button
            style={{ float: "right" }}
            onClick={() => handleDialogToggle()}
          >
            X
          </Button>
        </DialogTitle>
        <code>{theState ? theState.error : "Error getting the error"}</code>
        <DialogActions>
          <Button onClick={() => handleDialogToggle()}>Whatever</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
