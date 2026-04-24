import { Heart, People, PeopleFill, PersonArmsUp, PersonCheck, PersonCheckFill, PersonCircle, 
    PersonHeart, PersonHearts, PersonLinesFill, PersonRaisedHand } from 'react-bootstrap-icons';
import { useState } from 'react';
import PropTypes from 'prop-types';
import ViewContactCard from '../person/components/ViewContactCard';
import MemberPersonInfoCard from '../person/components/MemberPersonInfoCard';

const ViewApplicationCard = (props) => {
    const { formData, headerIcon, headerTitle, priColor } = props
    const HeaderIconComponent = headerIcon
    const [showContact, setShowContact] = useState(false)
    
    const handleToggle = () => {
        setShowContact(!showContact)
    }

    return (
        <>
            <div className='card mb-3'>
                <div className="card-header text-white" style={{ backgroundColor: priColor }}>
                    <div className="d-flex text-white">
                        <HeaderIconComponent size={28} className='mt-2 me-2' />
                        <span className='fs-5 mt-1 fw-semibold text-white'>{ headerTitle }</span>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="form-group row mb-3">
                        <div className="d-flex">
                            <PersonRaisedHand size={28} />
                            <span className="h5 ms-2">
                                {formData.person.lastName},&nbsp;
                                {formData.person.firstName}&nbsp;
                                {formData.person.middleName}
                            </span>
                        </div>
                    </div>
                    {/* Application Details */}
                    <span className="h5 fw-semibold text-primary">Application Details</span>
                    <div className="form-group row row-cols-auto mt-2">
                        <div className="col-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="applicationId"
                                    type="text" 
                                    className="form-control"
                                    value={formData.id || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="applicationId">Application Id</label>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="applicationNumber"
                                    type="text" 
                                    className="form-control"
                                    value={formData.applicationNumber || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="applicationNumber">Application Number</label>
                            </div>
                        </div>
                        <div className="col-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="dob"
                                    type="text" 
                                    className="form-control"
                                    value={formData.person.dob || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="dob">Date Of Birth</label>
                            </div>
                        </div>
                        <div className="col-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="lifeStatus"
                                    type="text" 
                                    className="form-control"
                                    value={formData.person.lifeStatus || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="lifeStatus">Life Status</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row row-cols-auto">
                        <div className="col-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="maritalStatus"
                                    type="text" 
                                    className="form-control"
                                    value={formData.maritalStatus || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="maritalStatus">Marital Status</label>
                            </div>
                        </div>
                        <div className="col-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="appCreatedAt"
                                    type="text" 
                                    className="form-control"
                                    value={formData.appCreatedAt || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="appCreatedAt">App Created At</label>
                            </div>
                        </div>
                        <div className="col-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="appUpdatedAt"
                                    type="text" 
                                    className="form-control"
                                    value={formData.appUpdatedAt || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="appUpdatedAt">App Updated At</label>
                            </div>
                        </div>
                        <div className="col-6 col-xxl-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id="applicationStatus"
                                    type="text" 
                                    className="form-control"
                                    value={formData.applicationStatus || ''}
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="applicationStatus">Application Status</label>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mb-3 justify-content-end">
                        <button onClick={handleToggle} className="btn btn-dark mb-3">
                            {showContact ? 'Hide Contact' : 'Show Contact'}
                        </button>
                    </div>
                    {
                        showContact && (
                            <>
                                <ViewContactCard contact={formData.person.contact} />
                            </>
                        )
                    }
                </div>
            </div>
            
            <MemberPersonInfoCard
                peopleData={formData.spouses}
                headerIcon={Heart}
                bodyIcon={PersonHeart}
                headerTitle={'Spouses Information'}
                personTypeMultiple={'Spouses'}
                personTypeSingle={'Spouse'}
                priColor={'crimson'}
            />
            <MemberPersonInfoCard
                peopleData={formData.children}
                headerIcon={PersonCircle}
                bodyIcon={PersonCircle}
                headerTitle={'Children Information'}
                personTypeMultiple={'Children'}
                personTypeSingle={'Child'}
                priColor={'limegreen'}
            />
            <MemberPersonInfoCard
                peopleData={formData.parents}
                headerIcon={People}
                bodyIcon={PeopleFill}
                headerTitle={'Parents Information'}
                personTypeMultiple={'Parents'}
                personTypeSingle={'Parent'}
                priColor={'purple'}
            />
            <MemberPersonInfoCard
                peopleData={formData.siblings}
                headerIcon={PersonArmsUp}
                bodyIcon={PersonArmsUp}
                headerTitle={'Siblings Information'}
                personTypeMultiple={'Siblings'}
                personTypeSingle={'Sibling'}
                priColor={'orange'}
            />
            <MemberPersonInfoCard
                peopleData={formData.referees}
                headerIcon={PersonCheck}
                bodyIcon={PersonCheckFill}
                headerTitle={'Reference Information'}
                personTypeMultiple={'Referees'}
                personTypeSingle={'Referee'}
                priColor={'coral'}
            />
            <MemberPersonInfoCard
                peopleData={formData.relatives}
                headerIcon={PersonLinesFill}
                bodyIcon={PersonLinesFill}
                headerTitle={'Club Relatives'}
                personTypeMultiple={'Relatives'}
                personTypeSingle={'Relative'}
                priColor={'teal'}
            />
            <MemberPersonInfoCard
                peopleData={formData.beneficiaries}
                headerIcon={PersonHearts}
                bodyIcon={PersonHearts}
                headerTitle={'Beneficiaries'}
                personTypeMultiple={'Beneficiaries'}
                personTypeSingle={'Beneficiary'}
                priColor={'saddlebrown'}
            />
        </>
    )
}

ViewApplicationCard.propTypes = {
    formData: PropTypes.object,
    headerIcon: PropTypes.elementType, 
    headerTitle: PropTypes.string,
    priColor: PropTypes.string,
}

export default ViewApplicationCard