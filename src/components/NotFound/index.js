import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-route-container">
    <img
      src="https://res.cloudinary.com/dhcs4pksp/image/upload/v1695736984/Book%20Hub/Not%20Found%20Image.png"
      alt="not found"
      className="not-found-image"
    />
    <h1 className="heading">Page Not Found</h1>
    <p className="description">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="button">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
