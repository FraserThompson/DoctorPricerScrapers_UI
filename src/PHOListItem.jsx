import React from 'react';
import config from 'config';
import Moment from 'react-moment';
import Utils from './Utils';
import { ListItem } from 'react-toolbox/lib/list';

class PHOListItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      state: this.props.state,
      time: this.props.time,
      current_task_id: this.props.current_task_id,
      timer: null
    }

    // if there's a current task running
    if (this.state.current_task_id){
      this.state.state = "Scraping";
      this.props.updateTask(this);
      this.state.timer = setInterval(function() { return this.props.updateTask(this) }.bind(this), 5000);
    }
  
  }

  render(){
    return (
      <ListItem 
        itemContent={
          <div>
            <h3>{this.props.name}</h3>
            <p>Last Run: {Utils.formatDate(this.props.last_run)}</p>
            <p>Number of Practices: {this.props.number_of_practices}</p>
            <p>{this.state.state} {this.state.time && <span>since <Moment fromNow>{this.state.time}</Moment></span>}</p>
          </div>
        } 
        onClick={this.props.handleSelect.bind(this, this)}/>
    )
  }
}

export default PHOListItem;