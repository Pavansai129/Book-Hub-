import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: '', showErrorMsg: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({username: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showErrorMsg, errorMsg} = this.state
    return (
      <div className="login-page-container">
        <div className="login-image-container">
          <img
            src="https://res.cloudinary.com/dhcs4pksp/image/upload/v1695753965/Book%20Hub/Login%20Page%20Image.png"
            alt="login cover"
            className="login-image"
          />
        </div>
        <div className="form-card-container">
          <div className="form-card">
            <img
              src="https://res.cloudinary.com/dhcs4pksp/image/upload/v1695754147/Book%20Hub/Book%20Hub%20Logo.png"
              alt="website logo"
              className="website-logo"
            />
            <form onSubmit={this.onSubmitForm} className="form">
              <div className="label-and-input-container">
                <label htmlFor="username" className="label">
                  Username*
                </label>
                <input
                  type="text"
                  id="username"
                  className="login-input"
                  value={username}
                  onChange={this.onChangeUsername}
                />
              </div>
              <div className="label-and-input-container">
                <label htmlFor="password" className="label">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  className="login-input"
                  value={password}
                  onChange={this.onChangePassword}
                />
              </div>
              {showErrorMsg && <p className="error-message">*{errorMsg}</p>}
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
