import Cookies from 'js-cookie'
import {Navigate,Link} from 'react-router-dom'
import {Component} from 'react'

import './index.css'

class LoginPage extends Component {
  state = {username: '', password: '', isFail: false, errMsg: ''};

  updatePassword = ev => {
    this.setState({password: ev.target.value})
  }

  updateUsername = ev => {
    this.setState({username: ev.target.value})
  }

  checkDetails = async ev => {
    ev.preventDefault()
    const {username, password} = this.state;
    const {navigate} = this.props;
    console.log("props:", this.props);
    const url = 'http://localhost:5000/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({username, password}),
    }

    const response = await fetch(url, options);
    const data = await response.json();
    console.log("fetched response",response, data);
    if (response.ok) {
      const token = data.jwt_token;
      Cookies.set('jwt_token', token, {expires: 30});
      this.setState({isFail: false});
      navigate('/',{replace:true});
    } else {
      this.setState({isFail: true, errMsg: data.message});
    }
  }

  render() {
    const token = Cookies.get('jwt_token');
    const {username, password, isFail, errMsg} = this.state;

    if (token !== undefined) {
      return <Navigate to="/"/>
    }

    return (
      <div className="login-page">
        <form className="login-container" onSubmit={this.checkDetails}>
          <div className="display-logo">
            <h1 className="login-text">Login</h1>
          </div>
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <br />
          <input
            id={username}
            placeholder="Username"
            type="text"
            className="input"
            value={username}
            onChange={this.updateUsername}
          />
          <br />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <br />
          <input
            id="password"
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={this.updatePassword}
          />
          <br />
          <button className="login-button" type="submit">
            Login
          </button>
          {isFail && <p className="err-display">{`*${errMsg}`}</p>}
          <p className="register-note">If you not have an Account <Link className="signup-link" to="/Register">click here to Signup</Link></p>
        </form>
      </div>
    )
  }
}

export default LoginPage
