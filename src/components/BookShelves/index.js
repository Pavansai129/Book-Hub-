import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

class BookShelves extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    bookShelfName: bookshelvesList[0].value,
    selectedLabel: bookshelvesList[0].label,
    userInput: '',
    searchText: '',
    books: [],
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {bookShelfName, searchText} = this.state
    const booksApiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${bookShelfName}&search=${searchText}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(booksApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formatedData = data.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        readStatus: eachBook.read_status,
        rating: eachBook.rating,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        books: formatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {books, searchText} = this.state
    return (
      <div>
        {books.length === 0 ? (
          <div className="no-books-view-container">
            <img
              src="https://res.cloudinary.com/dhcs4pksp/image/upload/v1696004955/Book%20Hub/No%20Videos%20Image.png"
              alt="no books"
              className="no-books-view-image"
            />
            <p className="no-books-view-text">
              Your search for {searchText} did not find any matches.
            </p>
          </div>
        ) : (
          <ul className="books-container">
            {books.map(eachBook => {
              const {
                id,
                title,
                readStatus,
                rating,
                authorName,
                coverPic,
              } = eachBook
              return (
                <li key={id} className="book-item">
                  <Link to={`/books/${id}`}>
                    <div className="book-item-container">
                      <img src={coverPic} alt={title} className="cover-pic" />
                      <div className="book-item-data-container">
                        <h1 className="title">{title}</h1>
                        <h1 className="author-name">{authorName}</h1>
                        <p className="rating">
                          Avg Rating {<BsFillStarFill />} {rating}
                        </p>
                        <p className="read-status">
                          Status: <span className="status">{readStatus}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  onClickTryAgain = () => {
    this.getBooks()
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

  renderBooks = () => {
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

  onChangeSearchText = event => {
    this.setState({userInput: event.target.value})
  }

  onClickSearchIcon = () => {
    const {userInput} = this.state
    this.setState({searchText: userInput.toLowerCase()}, this.getBooks)
  }

  onKeyDown = event => {
    if (event.key === 'Enter') {
      this.setState({searchText: event.target.value}, this.getBooks)
    }
  }

  renderSearchInput = () => {
    const {userInput} = this.state
    return (
      <div className="search-input-container">
        <input
          type="search"
          placeholder="Search"
          value={userInput}
          className="search-input"
          onKeyDown={this.onKeyDown}
          onChange={this.onChangeSearchText}
        />
        <button
          type="button"
          testid="searchButton"
          className="search-icon-button"
          onClick={this.onClickSearchIcon}
        >
          <BsSearch />
        </button>
      </div>
    )
  }

  onCLickShelfTab = (label, value) => {
    this.setState({bookShelfName: value, selectedLabel: label}, this.getBooks)
  }

  renderMobileView = () => (
    <>
      {this.renderSearchInput()}
      <h1 className="book-shelves-text">Bookshelves</h1>
      <ul className="labels-container">
        {bookshelvesList.map(eachBook => {
          const {id, label, value} = eachBook
          const {selectedLabel} = this.state
          const buttonClassName =
            selectedLabel === label ? 'active-button' : 'shelf-button'
          const onClickLabel = () => {
            this.onCLickShelfTab(label, value)
          }
          return (
            <li key={id}>
              <button
                type="button"
                className={buttonClassName}
                onClick={onClickLabel}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
      {this.renderBooks()}
    </>
  )

  onClickLabel = (label, value) => {
    this.setState({selectedLabel: label, bookShelfName: value}, this.getBooks)
  }

  renderDesktopView = () => {
    const {selectedLabel} = this.state
    return (
      <div className="desktop-book-shelves-container">
        <div className="book-shelves-container">
          <h1 className="book-shelves-text">Bookshelves</h1>
          <ul>
            {bookshelvesList.map(eachBook => {
              const {id, value, label} = eachBook
              const onClickLabelText = () => {
                this.onClickLabel(label, value)
              }
              const labelClass =
                selectedLabel === label ? 'active-label' : 'label'
              return (
                <li key={id} className={labelClass} onClick={onClickLabelText}>
                  {label}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="desktop-title-search-input-and-books-container">
          <div className="desktop-title-and-search-input-container">
            <h1 className="books-label-heading">{selectedLabel} Books</h1>
            {this.renderSearchInput()}
          </div>
          {this.renderBooks()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="book-shelves-page-container">
        <Header />
        <div className="mobile-view">{this.renderMobileView()}</div>
        <div className="desktop-view">{this.renderDesktopView()}</div>
        <Footer />
      </div>
    )
  }
}

export default BookShelves
