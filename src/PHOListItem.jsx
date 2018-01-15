import React from 'react';
import config from 'config';
import Moment from 'react-moment';
import Utils from './Utils';

import Button from 'react-toolbox/lib/button';
import { ListItem } from 'react-toolbox/lib/list';
import Dialog from 'react-toolbox/lib/dialog';

class PHOListItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dialogActive: false,
      state: this.props.state,
      time: this.props.time,
      current_task_id: this.props.current_task_id,
      timer: null,
      error: this.props.error
    }

    // if there's a current task running
    if (this.state.current_task_id){
      this.state.state = "Scraping";
      this.props.updateTask(this);
      this.state.timer = setInterval(function() { return this.props.updateTask(this) }.bind(this), 5000);
    }
  
  }

  handleDialogToggle() {
    this.setState({dialogActive: !this.state.dialogActive});
  }

  render(){
    return (
      <ListItem 
        caption={this.props.name}
        legend={"Last Scrape: " + Utils.formatDate(this.props.last_run)}
        leftIcon={String(this.props.number_of_practices)}
        rightIcon={<p>{this.state.state} {this.state.error && <Button label='Show' onClick={this.handleDialogToggle.bind(this)} />} {this.state.time && <span>since <Moment fromNow>{this.state.time}</Moment></span>}</p>}
        onClick={this.props.handleSelect.bind(this, this)}/>
    )
  }
}

export default PHOListItem;