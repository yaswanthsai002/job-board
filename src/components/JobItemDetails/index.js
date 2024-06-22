import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  notFound: 'NOT_FOUND',
}

export default class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.fetchJobItemDetails()
  }

  fetchJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    try {
      const {match} = this.props
      const {params} = match
      const {id} = params
      const jwtToken = Cookies.get('jwt_token')
      const fetchApiUrl = `https://apis.ccbp.in/jobs/${id}`
      const fetchOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(fetchApiUrl, fetchOptions)
      if (response.ok) {
        const jsonResponse = await response.json()
        const jobDetails = {
          id: jsonResponse.job_details.id,
          title: jsonResponse.job_details.title,
          companyLogoUrl: jsonResponse.job_details.company_logo_url,
          companyWebsiteUrl: jsonResponse.job_details.company_website_url,
          employmentType: jsonResponse.job_details.employment_type,
          jobDescription: jsonResponse.job_details.job_description,
          location: jsonResponse.job_details.location,
          packagePerAnnum: jsonResponse.job_details.package_per_annum,
          rating: jsonResponse.job_details.rating,
          lifeAtCompany: {
            description: jsonResponse.job_details.life_at_company.description,
            imageUrl: jsonResponse.job_details.life_at_company.image_url,
          },
          skills: jsonResponse.job_details.skills.map(skill => ({
            name: skill.name,
            imageUrl: skill.image_url,
          })),
        }
        const similarJobs = jsonResponse.similar_jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          rating: job.rating,
          title: job.title,
        }))
        this.setState({
          jobDetails,
          similarJobs,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
      console.log('Error occured while fetching details', error)
    }
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      lifeAtCompany,
      skills,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-item-details-wrapper">
        <div className="job-item-details-container">
          <div className="job-item-header">
            <div className="job-item-main-info-container">
              <div className="company-logo-container">
                <img
                  className="company-logo"
                  src={companyLogoUrl}
                  alt="job details company logo"
                />
              </div>
              <div className="job-title-and-rating-container">
                <h1 className="job-title">{title}</h1>
                <div className="rating-container">
                  <FaStar className="star-logo" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="job-item-other-info-container">
              <div className="location-and-employment-type-container">
                <div className="location-container">
                  <IoLocationSharp className="location-logo" />
                  <p className="location">{location}</p>
                </div>
                <div className="employment-type-container">
                  <BsBriefcaseFill className="job-logo" />
                  <p className="employment-type">{employmentType}</p>
                </div>
              </div>
              <div className="package-container">
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="job-item-description-container">
            <div className="job-item-description-header">
              <h1 className="description-heading">Description</h1>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="company-website-link"
              >
                Visit <FaExternalLinkAlt className="external-link-logo" />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="skills-container-heading">Skills</h1>
            <ul className="skills-list">
              {skills.map(skill => (
                <li className="skill-item" key={skill.name}>
                  <img
                    className="skill-img"
                    src={skill.imageUrl}
                    alt={skill.name}
                  />
                  <p className="skill-name">{skill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company-container">
            <h1 className="life-at-company-container-heading">
              Life at company
            </h1>
            <div className="life-at-company">
              <div className="life-at-company-description-container">
                <p className="life-at-company-description">{description}</p>
              </div>
              <div className="life-at-company-img-container">
                <img
                  className="life-at-company-img"
                  src={imageUrl}
                  alt="life at company"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-container-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(job => (
              <SimilarJobItem key={job.id} jobDetails={job} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
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
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.fetchJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="content-container">{this.renderContent()}</div>
      </>
    )
  }
}
