import React from 'react';
import Utils from './Utils';
import LogsListItem from './LogsListItem'

import { Panel } from 'react-toolbox';
import { Button } from 'react-toolbox/lib/button';
import {Tab, Tabs} from 'react-toolbox';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';
import Dialog from 'react-toolbox/lib/dialog';

class LogsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      dialogActive: false,
    }
  }

  handleTabChange(index) {
    this.setState({index});
  }

  handleDialogToggle() {
    this.setState({dialogActive: !this.state.dialogActive});
  }

  render(){
    if (this.props.list) {
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
    } else {
      var logsList = (<ProgressBar type='circular' mode='indeterminate' multicolor />)
    }
    
    return (
      <div>
        { this.props.selected != null && 
          <div className="header">
            <h1>
              {this.props.selected.props.name}
            </h1>
            <h4 style={{marginLeft: 15 + 'px'}}><a href={this.props.selected.props.website}>{this.props.selected.props.website}</a></h4>
            { this.props.sessionToken && this.props.selected.props.module &&
              <div style={{marginLeft: 15 + 'px'}}>
                <Button style={{marginRight: 15 + 'px'}} type="submit" raised onClick={this.props.scrape} label="Scrape"/>
                <Button style={{marginRight: 15 + 'px'}} type="submit" raised onClick={this.props.submit} label="Submit"/>
                <Button style={{marginRight: 15 + 'px'}} type="submit" raised onClick={this.props.stop} label="Stop"/> 
                <Button style={{backgroundColor: 'red'}} type="submit" raised accent onClick={this.handleDialogToggle.bind(this)} label="Delete"/> 
                <Dialog
                  actions={[{ label: "Cancel", onClick: this.handleDialogToggle.bind(this)}, {label: "Delete", onClick: this.props.delete.bind(this) }]}
                  active={this.state.dialogActive}
                  onEscKeyDown={this.handleDialogToggle}
                  onOverlayClick={this.handleDialogToggle}
                  type="small"
                  title='Are you sure?'
                >
                <p>This will delete the PHO and all practices.</p>
              </Dialog>
              </div>
            }
            <Tabs index={this.state.index} onChange={this.handleTabChange.bind(this)}>
              <Tab label="Last Scrape">
                <pre>{JSON.stringify(this.props.selected.props.last_scrape, null, 2)}</pre>
              </Tab>
              <Tab label="Submit History">
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