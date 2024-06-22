import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
  } = jobDetails
  return (
    <div className="similar-job-item-container">
      <div className="job-item-header">
        <div className="job-item-main-info-container">
          <div className="company-logo-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="similar job company logo"
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
        <div className="job-item-description-container">
          <h1 className="description-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </div>
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
      </div>
    </div>
  )
}

export default SimilarJobItem
