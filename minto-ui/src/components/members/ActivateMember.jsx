import PropTypes from 'prop-types'
import { Buildings, CalendarCheck, CalendarDate, CalendarPlus, CardChecklist, EnvelopeAt, FolderSymlink, Geo, GlobeAmericas, 
    Hash, Heart, HeartPulse, HouseDoor, Map, People, PeopleFill, PersonArmsUp, PersonBadge, PersonCheck, PersonCheckFill, 
    PersonCircle, PersonHeart, PersonHearts, PersonLinesFill, PersonRaisedHand, Telephone } from "react-bootstrap-icons"
import { useAuth } from "../hooks/useAuth"
import MemberPersonInfoCard from '../person/components/MemberPersonInfoCard'

const ActivateMember = (props) => {
    const { formData, setFormData, onSubmit, loading } = props
    const { isAuthenticated } = useAuth()

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <>
            { isAuthenticated && (
                <>
                    <div className='card my-3 border border-danger shadow'>
                        <div className="card-header bg-danger text-white">
                            <div className="d-flex text-white">
                                <CardChecklist size={30} className='me-2' />
                                <h3 className='ms-1'>Activate Membership</h3>
                            </div>
                        </div>
                        <div className="card-body px-1 px-sm-3">
                            <div className="form-group row mb-3">
                                <div className="d-flex">
                                    <PersonRaisedHand size={28} />
                                    <span className="h5 ms-2">
                                        {formData.application.person.lastName},&nbsp;
                                        {formData.application.person.firstName}&nbsp;
                                        {formData.application.person.middleName}
                                    </span>
                                </div>
                            </div>

                            {/* Application Details */}
                            <h5 className="text-danger mb-3"><strong>Application Details</strong></h5>
                            <hr />
                            <div className="form-group row row-cols-auto">
                                <div className="col-6 col-lg-4 col-xxl-2">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="applicationId"
                                            type="text" 
                                            className="form-control"
                                            value={formData.application.id}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="applicationId">Application Id</label>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-4 col-xxl-2">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="applicationNumber"
                                            type="text" 
                                            className="form-control"
                                            value={formData.application.applicationNumber}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="applicationNumber">Application Number</label>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-4 col-xxl-2">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="appCreatedAt"
                                            type="text" 
                                            className="form-control"
                                            value={formData.application.appCreatedAt}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="appCreatedAt">App Created At</label>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-4 col-xxl-2">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="appUpdatedAt"
                                            type="text" 
                                            className="form-control"
                                            value={formData.application.appUpdatedAt}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="appUpdatedAt">App Updated At</label>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-4 col-xxl-2">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="maritalStatus"
                                            type="text" 
                                            className="form-control"
                                            value={formData.application.maritalStatus}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="maritalStatus">Marital Status</label>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-4 col-xxl-2">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="applicationStatus"
                                            type="text" 
                                            className="form-control"
                                            value={formData.application.applicationStatus}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="applicationStatus">Application Status</label>
                                    </div>
                                </div>
                            </div>

                            {/* User, Personal Info, Contacts, Address */}
                            <h5 className="text-danger my-3"><strong>User, Personal Info, Contacts & Address</strong></h5>
                            <hr />
                            <div className="form-group row row-cols-auto">
                                <div className="col col-md-6 col-xl-4 col-xxl-3">
                                    {/* User Details */}
                                    <div className="py-3">    
                                        <h5 className="text-primary mb-3"><strong>User Details</strong></h5>
                                        <div className="mb-3">
                                            <Hash size={20} className="text-secondary" />
                                            <span className="text-secondary mx-2">User Id:</span>
                                            <span className="fw-bold">{formData.application.user.id}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonCircle className="text-secondary" />
                                            <span className="text-secondary mx-2">First Name:</span>
                                            <span className="fw-bold">{formData.application.user.firstName}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonCircle className="text-secondary" />
                                            <span className="text-secondary mx-2">Last Name:</span>
                                            <span className="fw-bold">{formData.application.user.lastName}</span>
                                        </div>
                                        <div className="mb-3">
                                            <EnvelopeAt className="text-secondary" />
                                            <span className="text-secondary mx-2">User Email:</span>
                                            <span className="fw-bold">{formData.application.user.email}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonBadge className="text-secondary" />
                                            <span className="text-secondary mx-2">Role:</span>
                                            <span className="fw-bold">{formData.application.user.role}</span>
                                        </div>
                                        <div className="mb-3">
                                            <FolderSymlink className="text-secondary" />
                                            <span className="text-secondary mx-2">Registration Source:</span>
                                            <span className="fw-bold">{formData.application.user.source}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarCheck className="text-secondary" />
                                            <span className="text-secondary mx-2">Created At:</span>
                                            <span className="fw-bold">{formData.application.user.createdAt}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarPlus className="text-secondary" />
                                            <span className="text-secondary mx-2">Updated At:</span>
                                            <span className="fw-bold">{formData.application.user.updatedAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col col-md-6 col-xl-4 col-xxl-3">
                                    {/* Personal Info */}
                                    <div className="py-3">    
                                        <h5 className="text-primary mb-3"><strong>Personal Info</strong></h5>
                                        <div className="mb-3">
                                            <Hash size={20} className="text-secondary" />
                                            <span className="text-secondary mx-2">Person Id:</span>
                                            <span className="fw-bold">{formData.application.person.id}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonCircle className="text-secondary" />
                                            <span className="text-secondary mx-2">First Name:</span>
                                            <span className="fw-bold">{formData.application.person.firstName}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonCircle className="text-secondary" />
                                            <span className="text-secondary mx-2">Middle Name:</span>
                                            <span className="fw-bold">{formData.application.person.middleName}</span>
                                        </div>
                                        <div className="mb-3">
                                            <PersonCircle className="text-secondary" />
                                            <span className="text-secondary mx-2">Last Name:</span>
                                            <span className="fw-bold">{formData.application.person.lastName}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarDate className="text-secondary" />
                                            <span className="text-secondary mx-2">Date of Birth:</span>
                                            <span className="fw-bold">{formData.application.person.dob}</span>
                                        </div>
                                        <div className="mb-3">
                                            <HeartPulse className="text-secondary" />
                                            <span className="text-secondary mx-2">Life Status:</span>
                                            <span className="fw-bold">{formData.application.person.lifeStatus}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarCheck className="text-secondary" />
                                            <span className="text-secondary mx-2">Created At:</span>
                                            <span className="fw-bold">{formData.application.person.createdAt}</span>
                                        </div>
                                        <div className="mb-3">
                                            <CalendarPlus className="text-secondary" />
                                            <span className="text-secondary mx-2">Updated At:</span>
                                            <span className="fw-bold">{formData.application.person.updatedAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col col-md-6 col-xl-4 col-xxl-3">
                                    {/* Contacts */}
                                    <div className="py-3">
                                        <h5 className="text-primary mb-3"><strong>Contacts</strong></h5>
                                        {formData.application.person.contact.phones.map((phone, index) => (
                                            <div key={index} className="mb-3">
                                                <Telephone className="text-secondary" />
                                                <span className="fs-6 text-secondary mx-2">{phone.phoneType} Phone:</span>
                                                <span className="fs-6 fw-bold">{phone.countryCode} {phone.number}</span>
                                            </div>
                                        ))}

                                        {formData.application.person.contact.emails.map((email, index) => (
                                            <div key={index} className="mb-3">
                                                <EnvelopeAt className="text-secondary" />
                                                <span className="text-secondary mx-2">{email.emailType} Email:</span>
                                                <span className="fw-bold">{email.address}</span>
                                            </div>
                                        ))}
                                        
                                    </div>
                                </div>
                                
                                {/* Address */}
                                <div className="row row-cols-auto mb-3">
                                    {formData.application.person.contact.addresses.map((address, index) => (
                                        <div key={index} className="col mb-3">
                                            <h5 className="text-primary my-3"><strong>{address.addressType} Address</strong></h5>
                                            <div className="mb-3">
                                                <HouseDoor className="text-secondary" />
                                                <span className="text-secondary mx-2">Street:</span>
                                                <span className="">{address.street}</span>
                                            </div>
                                            <div className="mb-3">
                                                <Buildings className="text-secondary" />
                                                <span className="text-secondary mx-2">City:</span>
                                                <span className="">{address.city}</span>
                                            </div>
                                            <div className="mb-3">
                                                <Map className="text-secondary" />
                                                <span className="text-secondary mx-2">State:</span>
                                                <span className="">{address.state}</span>
                                            </div>
                                            <div className="mb-3">
                                                <Geo className="text-secondary" />
                                                <span className="text-secondary mx-2">Zip Code:</span>
                                                <span className="">{address.zipcode}</span>
                                            </div>
                                            <div className="mb-3">
                                                <GlobeAmericas className="text-secondary" />
                                                <span className="text-secondary mx-2">Country:</span>
                                                <span className="">{address.country}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Family, References and Beneficiaries */}
                            <h5 className="text-danger my-3"><strong>Family, References and Beneficiaries</strong></h5>
                            <hr />
                            <MemberPersonInfoCard
                                peopleData={formData.application.referees}
                                headerIcon={PersonCheck}
                                bodyIcon={PersonCheckFill}
                                headerTitle={'Reference Information'}
                                personTypeMultiple={'Referees'}
                                personTypeSingle={'Referee'}
                                priColor={'coral'}
                            />
                            <MemberPersonInfoCard
                                peopleData={formData.application.relatives}
                                headerIcon={PersonLinesFill}
                                bodyIcon={PersonLinesFill}
                                headerTitle={'Club Relatives'}
                                personTypeMultiple={'Relatives'}
                                personTypeSingle={'Relative'}
                                priColor={'teal'}
                            />
                            <MemberPersonInfoCard
                                peopleData={formData.application.spouses}
                                headerIcon={Heart}
                                bodyIcon={PersonHeart}
                                headerTitle={'Spouses Information'}
                                personTypeMultiple={'Spouses'}
                                personTypeSingle={'Spouse'}
                                priColor={'crimson'}
                            />
                            <MemberPersonInfoCard
                                peopleData={formData.application.children}
                                headerIcon={PersonCircle}
                                bodyIcon={PersonCircle}
                                headerTitle={'Children Information'}
                                personTypeMultiple={'Children'}
                                personTypeSingle={'Child'}
                                priColor={'limegreen'}
                            />
                            <MemberPersonInfoCard
                                peopleData={formData.application.parents}
                                headerIcon={People}
                                bodyIcon={PeopleFill}
                                headerTitle={'Parents Information'}
                                personTypeMultiple={'Parents'}
                                personTypeSingle={'Parent'}
                                priColor={'purple'}
                            />
                            <MemberPersonInfoCard
                                peopleData={formData.application.siblings}
                                headerIcon={PersonArmsUp}
                                bodyIcon={PersonArmsUp}
                                headerTitle={'Siblings Information'}
                                personTypeMultiple={'Siblings'}
                                personTypeSingle={'Sibling'}
                                priColor={'orange'}
                            />
                            <MemberPersonInfoCard
                                peopleData={formData.application.beneficiaries}
                                headerIcon={PersonHearts}
                                bodyIcon={PersonHearts}
                                headerTitle={'Beneficiaries'}
                                personTypeMultiple={'Beneficiaries'}
                                personTypeSingle={'Beneficiary'}
                                priColor={'saddlebrown'}
                            />
                            {/* Application Notes */}
                            <div className="form-group row p-2 mt-2 mx-1 bg-light border border-secondary rounded">
                                <div className="col-12">
                                    <h6 className="mb-3"><strong>Application Notes:</strong></h6>
                                    <div className="form-floating mb-3">
                                        <textarea 
                                            id="notes"
                                            name='notes'
                                            value={formData.notes || ''}
                                            onChange={(e) => onInputChange(e)}
                                            rows={5}
                                            maxLength={2000}
                                            style={{ height: '120px' }}
                                            className="form-control"
                                        />
                                        <label htmlFor="notes">Notes</label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end my-3">
                                <button 
                                    className="btn btn-danger btn-lg px-4"  
                                    onClick={onSubmit}
                                    disabled={loading}
                                >
                                    { loading ? 'Activating...' : 'Activate Member' }
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

ActivateMember.propTypes = {
    formData: PropTypes.object,
    setFormData: PropTypes.func,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,
}

export default ActivateMember