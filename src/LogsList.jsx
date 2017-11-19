import React from 'react';
import Utils from './Utils';
import LogsListItem from './LogsListItem'

import { Panel } from 'react-toolbox';
import { Button } from 'react-toolbox/lib/button';
import {Tab, Tabs} from 'react-toolbox';

class LogsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 1
    }
  }

  handleTabChange(index) {
    this.setState({index});
  }

  render(){       

    var logsList = this.props.list.map(function (item, index) {
      return (
        <LogsListItem
          key={index}
          date={item.date}
          id={item.id}
          scraped={JSON.stringify(item.scraped, null, 2)}
          scraped_count={item.scraped.length}
          warnings={JSON.stringify(item.warnings, null, 2)}
          warnings_count={item.warnings.length}
          errors={JSON.stringify(item.errors, null, 2)}
          errors_count={item.errors.length}
          changes={JSON.stringify(item.changes, null, 2)}
        />
      );
    }, this);
    
    return (
      <div>
        { this.props.selected != null && 
          <div className="header">
            <h1>
              {this.props.selected.props.name}
            </h1>
            <a href={this.props.selected.props.website}>{this.props.selected.props.website}</a>
            { this.props.sessionToken && 
              <div>
                <Button type="submit" onClick={this.props.scrape} label="Scrape"/> 
                <Button type="submit" onClick={this.props.stop} label="Stop"/> 
                <Button type="submit" onClick={this.props.submit} label="Submit"/> 
              </div>
            }
            <Tabs index={this.state.index} onChange={this.handleTabChange.bind(this)}>
              <Tab label="Last Scrape">
                <pre>{JSON.stringify(this.props.selected.props.last_scrape, null, 2)}</pre>
              </Tab>
              <Tab label="Logs">
                {logsList}
              </Tab>
              <Tab label="Averages">
                <pre>{JSON.stringify(this.props.selected.props.average_prices, null, 2)}</pre>
              </Tab>
            </Tabs>
          </div>
        }
      </div>
    )
  }
}

export default LogsList;