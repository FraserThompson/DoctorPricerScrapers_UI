import React from 'react';
import Utils from './Utils';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import Chip from 'react-toolbox/lib/chip';
import {Tab, Tabs} from 'react-toolbox';

class LogsListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 1
    }
  }

  formatDate(date) {

    var date_obj = new Date(date);
    var day = date_obj.getDate();
    var monthIndex = date_obj.getMonth();
    var year = date_obj.getFullYear();

    var hours = date_obj.getHours();
    var minutes = date_obj.getMinutes();

    return day + '/' + monthIndex + '/' + year + " " + hours + ":" + minutes;
  }

  handleTabChange(index) {
    this.setState({index});
  };

  render(){
    return (
      <Card>
        <CardTitle title={this.props.id + " - " + this.formatDate(this.props.date)}/>
        <CardText>
          <Tabs index={this.state.index} onChange={this.handleTabChange.bind(this)}>
            <Tab label={"Errors " + this.props.errors_count}>
              <pre>{this.props.errors}</pre>
            </Tab>
            <Tab label={"Warnings " + this.props.warnings_count}>
              <pre>{this.props.warnings}</pre>
            </Tab>
            {this.props.changes.length > 2  && 
              <Tab label={"Changes"}>
                <pre>{this.props.changes}</pre>
              </Tab>
            }
            <Tab label={"Scraped " + this.props.scraped_count}>
              <pre>{this.props.scraped}</pre>
            </Tab>
          </Tabs>
        </CardText>
      </Card>
    )
  }
}

export default LogsListItem;