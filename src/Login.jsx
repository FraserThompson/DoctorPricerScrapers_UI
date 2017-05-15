import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Link from 'react-toolbox/lib/link';
import Input from 'react-toolbox/lib/input';
import Utils from './Utils';

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
              active={this.state.active}
              onEscKeyDown={this.handleToggle}
              onOverlayClick={this.handleToggle}
              title='Login'
          >
            <section>
              <Input type='text' label='Username' name='username' value={this.state.username} onChange={this.handleChange.bind(this, 'username')} maxLength={16} />
              <Input type='password' label='Password' name='password' value={this.state.password} onChange={this.handleChange.bind(this, 'password')} maxLength={16} />
            </section>
          </Dialog>
        </div>
    )
  }
}

export default Login;