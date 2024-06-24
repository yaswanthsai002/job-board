import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const handleLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        <img
          className="website-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="nav-list">
        <Link to="/" className="nav-link">
          <li className="nav-item">Home</li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li className="nav-item">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <ul className="nav-list-sm">
        <Link to="/" className="nav-link">
          <li className="nav-item">
            <AiFillHome className="home-icon" />
          </li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li className="nav-item">
            <BsBriefcaseFill className="jobs-icon" />
          </li>
        </Link>
        <FiLogOut className="logout-icon" onClick={handleLogout} />
      </ul>
    </nav>
  )
}

export default withRouter(Header)
