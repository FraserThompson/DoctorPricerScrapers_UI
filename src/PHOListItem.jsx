import React from "react";
import Moment from "react-moment";
import Utils from "./Utils";

import Button from "@mui/material/Button";

import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";

class PHOListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogActive: false,
      state: this.props.state,
      time: this.props.time,
      current_task_id: this.props.current_task_id,
      timer: null,
      error: this.props.error,
    };

    // if there's a current task running
    if (this.state.current_task_id) {
      this.state.state = "Scraping";
      this.props.updateTask(this);
      this.state.timer = setInterval(
        function () {
          return this.props.updateTask(this);
        }.bind(this),
        5000
      );
    }
  }

  handleDialogToggle() {
    this.setState({ dialogActive: !this.state.dialogActive });
  }

  render() {
    return (
      <>
        <ListItemButton onClick={this.props.handleSelect.bind(this, this)}>
          <ListItemIcon>
            <Typography variant="h5">
              {String(this.props.number_of_practices)}
            </Typography>
          </ListItemIcon>
          <ListItemText
            primary={this.props.name}
            secondary={
              <>
                <Typography>
                  {this.state.state}{" "}
                  {this.state.error && (
                    <Button
                      onClick={this.handleDialogToggle.bind(this)}
                      color="error"
                    >
                      Show
                    </Button>
                  )}
                </Typography>
                <Typography>
                  {this.state.time && (
                    <span>
                      since <Moment fromNow>{this.state.time}</Moment>
                    </span>
                  )}
                  Last Scrape: {Utils.formatDate(this.props.last_run)}
                </Typography>
              </>
            }
          ></ListItemText>
        </ListItemButton>
        <Dialog
          actions={this.actions}
          open={this.state.dialogActive}
          onEscKeyDown={this.handleDialogToggle.bind(this)}
          onOverlayClick={this.handleDialogToggle.bind(this)}
        >
          <DialogTitle>{this.props.name + " Error"}</DialogTitle>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            <code>{this.state.error}</code>
          </pre>
        </Dialog>
      </>
    );
  }
}

export default PHOListItem;
