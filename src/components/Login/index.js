import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

export default class Login extends Component {
  state = {showErrorMsg: false, errorMsg: '', username: '', password: ''}

  onUsernameChange = event => this.setState({username: event.target.value})

  onPasswordChange = event => this.setState({password: event.target.value})

  login = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const fetchApiUrl = 'https://apis.ccbp.in/login'
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    try {
      const response = await fetch(fetchApiUrl, fetchOptions)
      const jsonResponse = await response.json()
      if (response.ok) {
        const jwtToken = jsonResponse.jwt_token
        const {history} = this.props
        Cookies.set('jwt_token', jwtToken, {expires: 1})
        history.replace('/')
      } else {
        const errorMsg = jsonResponse.error_msg
        this.setState({showErrorMsg: true, errorMsg})
      }
    } catch (error) {
      console.log('Error while logging in', error)
    }
  }

  render() {
    const {username, password, errorMsg, showErrorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-container">
        <div className="login-form-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="login-form" onSubmit={this.login}>
            <div className="input-grp">
              <label htmlFor="username">USERNAME</label>
              <input
                type="username"
                className="username-input"
                onChange={this.onUsernameChange}
                value={username}
                placeholder="Username"
                id="username"
              />
            </div>
            <div className="input-grp">
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                className="password-input"
                onChange={this.onPasswordChange}
                value={password}
                placeholder="Password"
                id="password"
              />
            </div>
            <button type="submit" className="submit-btn">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
