import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillCloseCircle} from 'react-icons/ai'
import {GiHamburgerMenu} from 'react-icons/gi'
import './index.css'

class Header extends Component {
  state = {showMenu: false}

  onClickLogoutButton = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickMenuBar = () => {
    this.setState({showMenu: true})
  }

  renderDesktopNavLinks = () => {
    const {match} = this.props
    const {path} = match
    return (
      <div className="desktop-menu-container">
        <ul className="desktop-menu-list">
          <li className="nav-link-text">
            <Link
              to="/"
              className={`${
                path === '/' ? 'link-item selected-item' : 'link-item'
              }`}
            >
              Home
            </Link>
          </li>
          <li className="nav-link-text">
            <Link
              to="/books"
              className={
                path === '/books'
                  ? 'link-item desktop-book-shelves-text selectedItem'
                  : 'link-item desktop-book-shelves-text'
              }
            >
              Bookshelves
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="logout-button"
              onClick={this.onClickLogoutButton}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    )
  }

  renderMobileNavLinks = () => (
    <button
      type="button"
      onClick={this.onClickMenuBar}
      className="mobile-menu-icon"
    >
      <GiHamburgerMenu size="25px" />
    </button>
  )

  onClickCloseIcon = () => {
    this.setState({showMenu: false})
  }

  renderMobileMenu = () => {
    const {match} = this.props
    const {path} = match
    return (
      <ul className="mobile-menu-list">
        <li className="nav-link-text">
          <Link
            to="/"
            className={`${
              path === '/' ? 'link-item selected-item' : 'link-item'
            }`}
          >
            Home
          </Link>
        </li>
        <li className="nav-link-text">
          <Link
            to="/books"
            className={
              path === '/books'
                ? 'desktop-book-shelves-text selectedItem'
                : 'desktop-book-shelves-text'
            }
          >
            Bookshelves
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="logout-button"
            onClick={this.onClickLogoutButton}
          >
            Logout
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={this.onClickCloseIcon}
            className="mobile-menu-close-button"
          >
            <AiFillCloseCircle size="25px" />
          </button>
        </li>
      </ul>
    )
  }

  render() {
    const {showMenu} = this.state
    return (
      <nav className="navbar">
        <nav className="navbar-items-container">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dhcs4pksp/image/upload/v1695754147/Book%20Hub/Book%20Hub%20Logo.png"
              alt="website logo"
              className="book-hub-logo"
            />
          </Link>
          <div>
            {this.renderMobileNavLinks()}
            {this.renderDesktopNavLinks()}
          </div>
        </nav>
        {showMenu && (
          <div className="mobile-menu-container">{this.renderMobileMenu()}</div>
        )}
      </nav>
    )
  }
}

export default withRouter(Header)
