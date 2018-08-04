import React from 'react';
import Utils from './Utils';
import LogsListItem from './LogsListItem'

import { Panel } from 'react-toolbox';
import {Button, IconButton} from 'react-toolbox/lib/button';
import {Tab, Tabs} from 'react-toolbox';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';

import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';

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

    const AverageModel = {
      age: {type: Number},
      average: {type: Number}
    };

    return (
      <div>
        { this.props.selected != null && 
          <div className="header">
            <h1>
              {this.props.selected.props.name}
              
              <span style={{float:"right"}}>
                <IconButton icon='X' onClick={this.props.close} />
              </span>

            </h1>
            <div>
              { this.props.selected.website && <Button href={this.props.selected.props.website} label={this.props.selected.props.website} flat primary></Button> }
              <Button href={"https://api.doctorpricer.co.nz/dp/api/practices/?pho=" + this.props.selected.props.name} target="_blank" label="View all practices" flat primary></Button> 
              { this.props.sessionToken && this.props.selected.props.module &&
                <div>
                  <Button type="submit" flat onClick={this.props.scrape} label="Scrape"/>
                  <Button type="submit" flat onClick={this.props.submit} label="Submit"/>
                  <Button type="submit" flat accent onClick={this.props.stop} label="Stop"/> 
                </div>
              }
            </div>
            <Tabs index={this.state.index} onChange={this.handleTabChange.bind(this)}>
              <Tab label="Last Scrape">
                <pre>{JSON.stringify(this.props.selected.props.last_scrape, null, 2)}</pre>
              </Tab>
              <Tab label="Submission History">
                {logsList}
              </Tab>
              <Tab label="Averages">
                <h4>Average fees for PHO by age</h4>
                <Table selectable={false} style={{ marginTop: 10 }}>
                  <TableHead>
                    <TableCell>Age</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>13</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>65</TableCell>
                  </TableHead>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    {this.props.selected.props.average_prices.length && this.props.selected.props.average_prices.map((item, idx) => (
                      <TableCell key={idx}>${item.average.toFixed(2)}</TableCell>
                    ))}
                  </TableRow>
                </Table>
                <h4>Raw Data</h4>
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