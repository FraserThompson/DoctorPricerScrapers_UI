import React from 'react';
import config from 'config';
import PHOList from './PHOList';
import Utils from './Utils';
import LogsList from './LogsList';
import Login from './Login';
import Error from './Error';
import Navigation from 'react-toolbox/lib/navigation';

import AppBar from 'react-toolbox/lib/app_bar';

import { ThemeProvider } from 'react-css-themr';
import theme from './theme';

class ScraperApp extends React.Component {

  constructor(props) {
    super(props);

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
      errorActive: false,
      errorMessage: "Error",
      selected: null
    }
  }

  getPhoList() {

    Utils.JsonReq(config.apiUrl + '/dp/api/pho/', null, "GET", function(response) {
        if (response.data) {
          this.setState({ 'scrapers': JSON.parse(response.data) });
        } else {
          this.setState({ 'errorActive': true, 'errorMessage': 'Error: Could not fetch PHO list, server may be temporarily down.'})
        }
    }.bind(this))
  }

  getLogsList(name) {

    Utils.JsonReq(config.apiUrl + '/dp/api/logs/?source=' + name, null, "GET", function(response) {
        this.setState({ 'logs': JSON.parse(response.data) });
    }.bind(this))
  }

  componentDidMount() {
    this.getPhoList();
  }

  setItemState(module, values) {
    this.state.scrapers.forEach(function(item, index) {
        if (item.module == module ) {
          
          values.forEach(function(item, key) {
            self.state.scrapers[index][key] = item;
          })
        }
    }.bind(this))

    this.setState({ 'scrapers': this.state.scrapers });
  }

  handleSelect(item) {
    this.setState({ 'selected': item });
    this.getLogsList(item.props.module)
  }

  handleStop() {

    if (!this.state.selected.state.current_task_id) {
      console.log("Can't stop because we're not doing anything");
      return false;
    }
    
    Utils.JsonReq(config.apiUrl + "/dp/task_status/?task_id=" + this.state.selected.state.current_task_id + "&module=" + this.state.selected.props.module, null, "DELETE", function(res) {
        if (res.error) {
          console.log(res);
        }  else {
          this.state.selected.setState({"state": "Done", "time": null});
          this.getLogsList(this.state.selected.module);
          this.getPhoList();
        }
    }.bind(this), this.state.sessionToken)

  }

  handleScrape() {

    if (this.state.selected.state.current_task_id) {
      console.log("Not scraping because we're already scraping");
      return false;
    }

    Utils.JsonReq(config.apiUrl + "/dp/scrape/", {"module": this.state.selected.props.module}, "POST", function(res) {
        if (res.error) {
          console.log(res.error);
          this.state.selected.setState({"state": "Error: " + res.error})
        }  else {
          var json_res = JSON.parse(res.data);
          this.state.selected.setState({"state": "Scraping", "current_task_id": json_res.task_id, "timer": setInterval(this.updateTask.bind(this, this.state.selected), 5000)});
        }
    }.bind(this), this.state.sessionToken)

  }

  handleSubmit() {
    var self = this;

    Utils.JsonReq(config.apiUrl + "/dp/submit/", {"module": this.state.selected.props.module}, "POST", function(res) {

      if (res.error) {
        console.log(res.error);
        this.state.selected.setState({"state": "Error: " + res.error})
      }  else {
        var json_res = JSON.parse(res.data);
        this.state.selected.setState({'state': 'Submitting', 'current_task_id': json_res.task_id,  "timer": setInterval(function() { return this.updateTask(this.state.selected) }.bind(this), 5000)});
      }

    }.bind(this), this.state.sessionToken)
  }

  updateTask(selected) {

    console.log('Checking the status of ' + selected.state.current_task_id + ' from ' + selected.props.module);

    Utils.JsonReq(config.apiUrl + "/dp/task_status/?task_id=" + selected.state.current_task_id, null, "GET", function(res) {

        if (res.error) {

            clearInterval(selected.state.timer)
            selected.setState({"state": "Error: " + res.data})
            console.log(res);

        }  else {

            var json_res = JSON.parse(res.data);
            console.log(json_res);

            selected.setState({"time": json_res.date_done})

            if (json_res.status == "SUCCESS") {
              clearInterval(selected.state.timer)
              selected.setState({"state": "Done", "time": null});
              this.getLogsList(selected.module);
              this.getPhoList();
            } else if (json_res.status == "PENDING") {
              selected.setState({"state": json_res.meta});
            } else {
              clearInterval(selected.state.timer)
              selected.setState({"state": "Error: " + json_res.result})
            }

        }
    }.bind(this))

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
                <Login apiUrl={config.apiUrl} sessionToken={this.state.sessionToken} loginCallback={this.handleLogin.bind(this)} logoutCallback={this.handleLogout.bind(this)}/>
            </Navigation>
          </AppBar>
          <div style= {{"display": "flex"}}>
            <div style={this.leftColumn}>
              <PHOList list={this.state.scrapers} handleSelect={this.handleSelect.bind(this)} updateTask={this.updateTask.bind(this)}/>
            </div>
            <div style={this.rightColumn}>
              <LogsList selected={this.state.selected} sessionToken={this.state.sessionToken} list={this.state.logs} stop ={this.handleStop.bind(this)} scrape={this.handleScrape.bind(this)} submit={this.handleSubmit.bind(this)}/>
            </div>
          </div>
          <Error active={this.state.errorActive} message={this.state.errorMessage}></Error>
        </div>
      </ThemeProvider>
    )
  }
}

export default ScraperApp;