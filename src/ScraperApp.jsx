import React from 'react';
import PHOList from './PHOList';
import Utils from './Utils';
import LogsList from './LogsList';
import Login from './Login';
import Navigation from 'react-toolbox/lib/navigation';

import AppBar from 'react-toolbox/lib/app_bar';

import { ThemeProvider } from 'react-css-themr';
import theme from './theme';

class ScraperApp extends React.Component {

  constructor(props) {
    super(props);

    this.apiUrl = "https://localhost:8443"

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
      username: sessionStorage.getItem('dpUsername'),
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

  setItemState(module, state, last_scrape) {
    var self = this

    this.state.scrapers.forEach(function(item, index) {
        if (item.module == module ) {
          self.state.scrapers[index].state = state;
          self.state.scrapers[index].last_scrape = last_scrape ? last_scrape : null;
        }
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

    Utils.JsonReq(this.apiUrl + "/dp/scrape", {"module": this.state.selected.module}, "POST", function(res) {
        if (res.error) {
            console.log(res.error);
            self.setItemState(self.state.selected.module, "Error: " + res.error)
        }  else {

            self.setItemState(self.state.selected.module, "Scraping")

            var json_res = JSON.parse(res.data);
            self.state.selected.status = {'count': 0, 'task_id': json_res.task_id};

            self.state.selected.timer = setInterval(self.updateTask.bind(self, self.state.selected), 5000);
        }
    }, this.state.sessionToken)

  }

  handleSubmit() {
    var self = this;

    Utils.JsonReq(this.apiUrl + "/dp/submit", {"module": this.state.selected.module}, "POST", function(res) {

      if (res.error) {
          console.log(res.error);
          self.setItemState(self.state.selected.module, "Error: " + res.error)
      }  else {

          self.setItemState(self.state.selected.module, "Submitting")

          var json_res = JSON.parse(res.data);
          self.state.selected.status = {'count': 0, 'task_id': json_res.task_id};

          self.state.selected.timer = setInterval(self.updateTask.bind(self, self.state.selected), 5000);
      }

    }, this.state.sessionToken)
  }

  updateTask(selected) {
    var self = this;

    console.log('Checking the status of ' + selected.status.task_id + ' from ' + selected.module);

    Utils.JsonReq(this.apiUrl + "/dp/task_status?task_id=" + selected.status.task_id, null, "GET", function(res) {
        selected.status.count = selected.status.count + 1;

        if (res.error) {

            clearInterval(selected.timer)
            self.setItemState(self.state.selected.module, "Error: " + res.error)
            console.log(res.error);

        }  else {

            var json_res = JSON.parse(res.data);
            console.log(json_res);

            if (json_res.status == "SUCCESS") {
              clearInterval(selected.timer)
              self.setItemState(selected.module, "Done", JSON.parse(json_res.result));
              self.getLogsList(selected.module);
              self.getPhoList();
            } else if (json_res.status == "PENDING") {
              self.setItemState(selected.module, json_res.meta + " " + (selected.status.count * 5) + " seconds");
            } else {
              clearInterval(selected.timer)
              self.setItemState(self.state.selected.module, "Error: " + json_res.result)
            }

        }
    })

  }

  handleLogin(token, username) {
    sessionStorage.setItem('dpSessionToken', token);
    sessionStorage.setItem('dpUsername', username);
    this.setState({'sessionToken': token, 'username': username});
  }

  handleLogout() {
    sessionStorage.removeItem('dpSessionToken');
    sessionStorage.removeItem('dpUsername');
    this.setState({'sessionToken': '', 'username': ''});
  }

  render(){
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBar title='DoctorPricer Scrapers'>
            { this.state.username && 
              <h4> Logged in as {this.state.username} </h4>
            }
            <Navigation type='horizontal'>
                <Login apiUrl={this.apiUrl} sessionToken={this.state.sessionToken} loginCallback={this.handleLogin.bind(this)} logoutCallback={this.handleLogout.bind(this)}/>
            </Navigation>
          </AppBar>
          <div style= {{"display": "flex"}}>
            <div style={this.leftColumn}>
              <PHOList list={this.state.scrapers} select={this.handleSelect.bind(this)}/>
            </div>
            <div style={this.rightColumn}>
              <LogsList selected={this.state.selected} sessionToken={this.state.sessionToken} list={this.state.logs} scrape={this.handleScrape.bind(this)} submit={this.handleSubmit.bind(this)}/>
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default ScraperApp;