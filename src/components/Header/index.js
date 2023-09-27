import Popup from 'reactjs-popup'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiOutlineClose} from 'react-icons/ai'
import {GiHamburgerMenu} from 'react-icons/gi'
import './index.css'

const Header = props => {
  const {match} = props
  const {path} = match
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  const renderMobileNavLinks = () => (
    <div className="mobile-popup-icon-container">
      <Popup
        modal
        trigger={
          <button type="button" className="trigger-button">
            <GiHamburgerMenu size="18px" />
          </button>
        }
      >
        {close => (
          <div className="popup-menu-container">
            <div className="close-button-container">
              <button
                type="button"
                className="trigger-button"
                onClick={() => close()}
              >
                <AiOutlineClose size="30px" />
              </button>
            </div>
            <div className="mobile-menu-container">
              <ul className="mobile-menu-list">
                <li className="mobile-nav-link-text">
                  <Link
                    to="/"
                    className={`${
                      path === '/' ? 'link-item selected-item' : 'link-item'
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li className="mobile-nav-link-text">
                  <Link
                    to="/books"
                    className={
                      path === '/books' ? 'link-item selectedItem' : 'link-item'
                    }
                  >
                    Bookshelves
                  </Link>
                </li>
                <li className="popup-logout-text" onClick={onClickLogout}>
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )}
      </Popup>
    </div>
  )

  const renderDesktopNavLinks = () => (
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
            className="desktop-logout-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )

  return (
    <nav className="navbar-container">
      <Link to="/">
        <img
          src="https://res.cloudinary.com/dhcs4pksp/image/upload/v1695754147/Book%20Hub/Book%20Hub%20Logo.png"
          alt="website logo"
          className="book-hub-logo"
        />
      </Link>
      <div>
        {renderMobileNavLinks()}
        {renderDesktopNavLinks()}
      </div>
    </nav>
  )
}

export default withRouter(Header)
