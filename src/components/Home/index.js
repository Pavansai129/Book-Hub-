import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, topRatedBooks: []}

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const topRatedBooksApiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(topRatedBooksApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formatedData = data.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        topRatedBooks: formatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {topRatedBooks} = this.state
    const settings = {
      dots: false,
      infinite: true,
      swipe: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    }
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {topRatedBooks.map(eachBook => {
            const {id, title, authorName, coverPic} = eachBook
            return (
              <li key={id}>
                <Link to={`/books/${id}`}>
                  <div className="book-container">
                    <img src={coverPic} alt={title} className="cover-pic" />
                    <h1 className="title">{title}</h1>
                    <h1 className="author-name">{authorName}</h1>
                  </div>
                </Link>
              </li>
            )
          })}
        </Slider>
      </div>
    )
  }

  onClickTryAgain = () => {
    this.getTopRatedBooks()
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

  renderTopRatedBooks = () => {
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

  onCLickFindBooksButton = () => {
    const {history} = this.props
    history.replace('/shelf')
  }

  render() {
    return (
      <div className="home-page-container">
        <Header />
        <div className="home-page-content-container">
          <div className="home-page-text-container">
            <h1 className="content-heading">Find Your Next Favorite Books?</h1>
            <p className="content-description">
              You are in the right place. Tell us what titles or genres you have
              enjoyed in the past, and we will give you surprisingly insightful
              recommendations.
            </p>
            <button
              type="button"
              className="find-books-button mobile-view-button"
              onClick={this.onCLickFindBooksButton}
            >
              Find Books
            </button>
          </div>
          <div className="top-rated-books-container">
            <div className="top-rated-text-and-button-container">
              <h1 className="top-rated-text">Top Rated Books</h1>
              <button
                type="button"
                onClick={this.onCLickFindBooksButton}
                className="find-books-button desktop-view-button"
              >
                Find Books
              </button>
            </div>
            <div>{this.renderTopRatedBooks()}</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
