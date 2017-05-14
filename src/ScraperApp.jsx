import React from 'react';
import PHOList from './PHOList';
import Utils from './Utils';
import LogsList from './LogsList';
import Login from './Login';
import Navigation from 'react-toolbox/lib/navigation';

import AppBar from 'react-toolbox/lib/app_bar';

class ScraperApp extends React.Component {

  constructor(props) {
    super(props);

    this.apiUrl = "http://localhost:8000"

    this.leftColumn = {
      "height": "90vh",
      "overflow": "auto",
      "flex": "1",
    }

    this.rightColumn = {
      "height": "90vh",
      "overflow": "auto",
      "flex": "2"
    }

    this.state = { 
      scrapers: [],
      sessionToken: sessionStorage.getItem('dpSessionToken'),
      logs: [],
      selected: null
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

    this.setItemState(this.state.selected.module, "Scraping")

    Utils.JsonReq(this.apiUrl + "/dp/scrape", {"module": this.state.selected.module}, "POST", function(res) {
        if (res.error) {
            console.log(res.error);
            self.setItemState(self.state.selected.module, "Error: " + res.error)
        }  else {
            self.setItemState(self.state.selected.module, "Scraped")
            self.state.selected.last_scrape = JSON.parse(res.data);
        }
    }, this.state.sessionToken)

  }

  handleSubmit() {
    var self = this;

    this.setItemState(this.state.selected.module, "Submitting")

    Utils.JsonReq(this.apiUrl + "/dp/submit", {"module": this.state.selected.module}, "POST", function(res) {

      if (res.error) {
          self.setItemState(self.state.selected.module, "Error: " + res.error)
      }  else {
          self.setItemState(self.state.selected.module, "Submitted")
          self.getLogsList(self.state.selected.module)
      }

    }, this.state.sessionToken)
  }

  handleLogin(token) {
    sessionStorage.setItem('dpSessionToken', token);
    this.setState({'sessionToken': token});
  }

  handleLogout() {
    sessionStorage.removeItem('dpSessionToken');
    this.setState({'sessionToken': ''});
  }

  render(){
    return (
      <div>
        <AppBar title='DoctorPricer Scrapers'>
          <Navigation type='horizontal'>
              <Login apiUrl={this.apiUrl} sessionToken={this.state.sessionToken} loginCallback={this.handleLogin.bind(this)} logoutCallback={this.handleLogout.bind(this)}/>
          </Navigation>
        </AppBar>
        <div style= {{"display": "flex"}}>
          <div style={this.leftColumn}>
            <PHOList list={this.state.scrapers} select={this.handleSelect.bind(this)}/>
          </div>
          <div style={this.rightColumn}>
            <LogsList selected={this.state.selected} list={this.state.logs} scrape={this.handleScrape.bind(this)} submit={this.handleSubmit.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }
}

export default ScraperApp;