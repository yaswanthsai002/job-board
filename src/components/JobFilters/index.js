import './index.css'

const JobFilters = props => {
  const {
    employmentTypeInput,
    minimumPackageInput,
    employmentTypesList,
    salaryRangesList,
    addEmploymentType,
    setMinimumPackageInput,
    locationInput,
    jobLocationsList,
    addLocation,
  } = props

  const renderEmploymentFilters = () => (
    <div className="employment-types-filters-container">
      <h1 className="employment-types-filters-heading">Type of Employment</h1>
      <ul className="filters-container">
        {employmentTypesList.map(type => (
          <li className="filter-input-grp" key={type.employmentTypeId}>
            <input
              type="checkbox"
              name="employmentType"
              id={type.employmentTypeId}
              onChange={() => addEmploymentType(type.employmentTypeId)}
              checked={employmentTypeInput.includes(type.employmentTypeId)}
            />
            <label htmlFor={type.employmentTypeId}>{type.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderLocationFilters = () => (
    <div className="location-filters-container">
      <h1 className="location-filters-heading">Location</h1>
      <ul className="filters-container">
        {jobLocationsList.map(type => (
          <li className="filter-input-grp" key={type.locationId}>
            <input
              type="checkbox"
              name="location"
              id={type.locationId}
              onChange={() => addLocation(type.locationId)}
              checked={locationInput.includes(type.locationId)}
            />
            <label htmlFor={type.locationId}>{type.locationName}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderSalaryRangeFilters = () => (
    <div className="salary-range-filters-container">
      <h1 className="salary-range-filters-heading">Salary Range</h1>
      <ul className="filters-container">
        {salaryRangesList.map(type => (
          <li className="filter-input-grp" key={type.salaryRangeId}>
            <input
              name="salary range"
              type="radio"
              id={type.salaryRangeId}
              onChange={() => setMinimumPackageInput(type.salaryRangeId)}
              checked={minimumPackageInput === type.salaryRangeId}
            />
            <label htmlFor={type.salaryRangeId}>{type.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <>
      {renderEmploymentFilters()}
      {renderLocationFilters()}
      <hr className="divider" />
      {renderSalaryRangeFilters()}
    </>
  )
}

export default JobFilters
