import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    bookDetails: {},
  }

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const bookDetailsApiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(bookDetailsApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formatedData = {
        id: data.book_details.id,
        title: data.book_details.title,
        readStatus: data.book_details.read_status,
        rating: data.book_details.rating,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        aboutBook: data.book_details.about_book,
        aboutAuthor: data.book_details.about_author,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        bookDetails: formatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {bookDetails} = this.state
    const {
      title,
      readStatus,
      rating,
      authorName,
      coverPic,
      aboutAuthor,
      aboutBook,
    } = bookDetails

    return (
      <div className="book-item-details-card-container">
        <div className="book-item-details-card">
          <div className="book-item-top-section">
            <img src={coverPic} alt={title} className="book-cover-pic" />
            <div className="book-item-top-section-details-container">
              <h1 className="book-title">{title}</h1>
              <h1 className="book-author-name">{authorName}</h1>
              <p className="book-rating">
                Avg Rating: {<BsFillStarFill />} {rating}
              </p>
              <p className="book-read-status">
                Status: <span className="status">{readStatus}</span>
              </p>
            </div>
          </div>
          <hr className="horizontal-line" />
          <h1 className="book-item-bottom-section-heading">About Author</h1>
          <p className="book-item-bottom-section-description">{aboutAuthor}</p>
          <h1 className="book-item-bottom-section-heading">About Book</h1>
          <p className="book-item-bottom-section-description">{aboutBook}</p>
        </div>
      </div>
    )
  }

  onClickTryAgain = () => {
    this.getBookDetails()
  }

  renderFailureView = () => (
    <div className="failure-content-container">
      <img
        src="https://res.cloudinary.com/dhcs4pksp/image/upload/v1695984137/Book%20Hub/Failure%20View%20Image.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-content-text">
        Something went wrong, Please try again.
      </h1>
      <button
        type="button"
        className="try-again-button"
        onClick={this.onClickTryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderBookDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="book-item-details-page-container">
        <Header />
        {this.renderBookDetails()}
        <Footer />
      </div>
    )
  }
}

export default BookItemDetails
