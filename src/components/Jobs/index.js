import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import Profile from '../Profile'
import JobFilters from '../JobFilters'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  notFound: 'NOT_FOUND',
}

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

export default class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    employmentTypeInput: [],
    minimumPackageInput: '',
    searchInput: '',
    jobs: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  onSearchInputChange = event => {
    this.setState({searchInput: event.target.value})
  }

  addEmploymentType = id =>
    this.setState(
      prevState => ({
        employmentTypeInput: !prevState.employmentTypeInput.includes(id)
          ? [...prevState.employmentTypeInput, id]
          : prevState.employmentTypeInput.filter(typeId => typeId !== id),
      }),
      () => {
        this.getJobs()
      },
    )

  setMinimumPackageInput = id =>
    this.setState({minimumPackageInput: id}, () => {
      this.getJobs()
    })

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {employmentTypeInput, minimumPackageInput, searchInput} = this.state
    const fetchApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeInput.join()}&minimum_package=${minimumPackageInput}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')

    const fetchOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(fetchApiUrl, fetchOptions)
      if (response.ok) {
        const jsonResponse = await response.json()
        const jobs = jsonResponse.jobs.map(job => ({
          id: job.id,
          title: job.title,
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          jobDescription: job.job_description,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
        }))

        this.setState({
          apiStatus:
            jsonResponse.total > 0
              ? apiStatusConstants.success
              : apiStatusConstants.notFound,
          jobs,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error in fetching jobs:', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsView = () => {
    const {jobs} = this.state
    return (
      <div className="jobs-list-container">
        <ul className="jobs-list">
          {jobs.map(job => (
            <JobItem key={job.id} jobDetails={job} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderNoJobsFound = () => (
    <div className="no-jobs-found-container">
      <img
        className="no-jobs-found-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-found-heading">No Jobs Found</h1>
      <p className="no-jobs-found-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.loading:
        return this.renderLoader()
      case apiStatusConstants.notFound:
        return this.renderNoJobsFound()
      default:
        return null
    }
  }

  render() {
    const {employmentTypeInput, minimumPackageInput, searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-page-container">
          <div className="search-input-container">
            <input
              type="search"
              className="search-input"
              value={searchInput}
              onChange={this.onSearchInputChange}
              onKeyDown={event => event.key === 'Enter' && this.getJobs()}
              name="search input"
              placeholder="Search"
              id="searchInput"
            />

            <BsSearch
              className="search-icon"
              data-testid="searchButton"
              onClick={this.getJobs}
            />
          </div>
          <div className="jobs-filters-and-jobs-list-container">
            <div className="profile-and-job-filters-container">
              <Profile />
              <hr className="divider" />
              <JobFilters
                employmentTypeInput={employmentTypeInput}
                minimumPackageInput={minimumPackageInput}
                employmentTypesList={employmentTypesList}
                salaryRangesList={salaryRangesList}
                addEmploymentType={this.addEmploymentType}
                setMinimumPackageInput={this.setMinimumPackageInput}
              />
            </div>
            {this.renderContent()}
          </div>
        </div>
      </>
    )
  }
}
