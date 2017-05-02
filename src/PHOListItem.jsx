import React from 'react';
import Utils from './Utils';
import { ListItem } from 'react-toolbox/lib/list';

class PHOListItem extends React.Component {

  constructor(props) {
    super(props);
  }

  formatDate(date) {

    var date_obj = new Date(date);
    var day = date_obj.getDate();
    var monthIndex = date_obj.getMonth();
    var year = date_obj.getFullYear();

    return day + '/' + monthIndex + '/' + year;
  }

  render(){
    return (
      <ListItem caption={this.props.name} legend={"Last Run: " + this.formatDate(this.props.last_run) + " Number of Practices: " + this.props.number_of_practices + " " + (this.props.state ? this.props.state : "")} onClick={this.props.select}/>
    )
  }
}

export default PHOListItem;