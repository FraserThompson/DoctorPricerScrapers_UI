import React from 'react';
import Dialog from '@mui/material/Dialog';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Utils from './Utils';
import { Typography } from '@mui/material';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        active: false,
        username: '',
        password: ''
    };

    this.handleChange = (name, value) => {
      this.setState({[name]: value});
    };

    this.handleToggle = () => {
      this.setState({active: !this.state.active});
    }

    this.handleLogin = () => {

      var self = this;

      Utils.JsonReq(this.props.apiUrl + "/dp/login/", {"username": this.state.username, "password": this.state.password}, "POST", function(res) {

        if (res.error) {
          console.log(res.error)
        }  else {
          self.props.loginCallback(JSON.parse(res.data).token, self.state.username);
          self.setState({active: !self.state.active});
        }

      })
    }

    this.handleLogout = () => {
      this.props.logoutCallback()
    }

    this.actions = [
      { label: "Cancel", onClick: this.handleToggle },
      { label: "Login", onClick: this.handleLogin }
    ]
    
  }

  render(){
    return (
        <div>
          { !this.props.sessionToken && 
            <Link href='#' onClick={this.handleToggle} label='Login' />
          }
          { this.props.sessionToken && 
              <Link href='#' onClick={this.handleLogout} label='Logout' />
          }
          <Dialog
              actions={this.actions}
              open={this.state.active}
              onClose={this.handleToggle}
          >
            <section>
              <Typography variant="h4">Login</Typography>
              <TextField type='text' label='Username' name='username' value={this.state.username} onChange={this.handleChange.bind(this, 'username')} maxLength={32} />
              <TextField type='password' label='Password' name='password' value={this.state.password} onChange={this.handleChange.bind(this, 'password')} maxLength={128} />
            </section>
          </Dialog>
        </div>
    )
  }
}

export default Login;