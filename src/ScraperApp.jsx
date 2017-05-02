import React from 'react';
import PHOList from './PHOList';
import Utils from './Utils';
import LogsList from './LogsList';

import AppBar from 'react-toolbox/lib/app_bar';

class ScraperApp extends React.Component {

  constructor(props) {
    super(props);

    this.apiUrl = "http://localhost:8000"

    this.leftColumn = {
      "flex": "1",
    }

    this.rightColumn = {
      "flex": "2",
    }

    this.state = { 
      scrapers: [],
      logs: [],
      selected: {}
    }
  }

  getPhoList() {
    var self = this;

    Utils.JsonReq(this.apiUrl + '/dp/api/pho/', null, "GET", function(response) {
        self.setState({ 'scrapers': JSON.parse(response.data) });
    })
  }

  getLogsList(name) {
    var self = this;

    Utils.JsonReq(this.apiUrl + '/dp/api/logs/?source=' + name, null, "GET", function(response) {
        self.setState({ 'logs': JSON.parse(response.data) });
    })
  }

  componentDidMount() {
    this.getPhoList();
  }

  setItemState(module, state) {
    var self = this

    this.state.scrapers.forEach(function(item, index) {
        if (item.module == module ) self.state.scrapers[index].state = state;
    })

    this.setState({ 'scrapers': this.state.scrapers });
  }

  handleSelect(item) {
    var self = this;
    this.setState({ 'selected': item });
    this.getLogsList(item.module)

  }

  handleScrape() {
    var self = this;

    this.setItemState(this.state.selected, "Scraping")

    Utils.JsonReq(this.apiUrl + "/dp/scrape", {"module": this.state.selected.module}, "POST", function(res) {
        if (res.error) {
            self.state.selected.state = "Error: " + res.error
        }  else {
           self.state.selected.state = "Scraped"
        }
    })

  }

  handleSubmit() {
    var self = this;

    this.setItemState(this.state.selected, "Submitting")

    Utils.JsonReq(this.apiUrl + "/dp/submit", {"module": this.state.selected.module}, "POST", function(res) {

      if (res.error) {
          self.state.selected.state = "Error: " + res.error
      }  else {
          self.state.selected.state ="Submitted"
      }
      
      self.getPhoList();
      self.handleSelect({'module': self.state.selected.module});

    })
  }

  render(){
    return (
      <div>
        <AppBar title='DoctorPricer Scrapers'/>
        <div style= {{"display": "flex"}}>
          <div style={this.leftColumn}>
            <PHOList list={this.state.scrapers} select={this.handleSelect.bind(this)}/>
          </div>
          <div style={this.rightColumn}>
            <LogsList selected={this.state.selected} list={this.state.logs} last_scraped={this.state.last_scraped} scrape={this.handleScrape.bind(this)} submit={this.handleSubmit.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }
}

export default ScraperApp;