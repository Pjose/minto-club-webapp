import PropTypes from 'prop-types'
import { toast } from 'sonner'
import { useState } from 'react'
import { CardChecklist, FolderSymlinkFill, HandThumbsDownFill, HandThumbsUpFill, Heart, People, PeopleFill, PersonArmsUp, PersonCheck, 
    PersonCheckFill, PersonCircle, PersonHeart, PersonHearts, PersonLinesFill, PersonRaisedHand, SignTurnLeftFill, XOctagonFill } from 'react-bootstrap-icons'
import LoadingSpinner from '../loading/LoadingSpinner'
import ViewContactCard from '../person/components/ViewContactCard'
import MemberPersonInfoCard from '../person/components/MemberPersonInfoCard'
import { useAuth } from '../hooks/useAuth'
import ConfirmationModal from '../misc/modals/ConfirmationModal'
import useConfirmation from '../hooks/useConfirmation'
import { useNavigate } from 'react-router-dom'
import ConfirmReasonModal from '../misc/modals/ConfirmReasonModal'
import useConfirmReason from '../hooks/useConfirmReason'

const SubmittedApplication = (props) => {
    const { formData, setFormData, onReview, onApprove, onReject, onReturned, loading } = props
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const { showReason, showConfirmReason, handleConfirmReason, handleCancelReason } = useConfirmReason()
    const [showContact, setShowContact] = useState(false)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleToggle = () => {
        setShowContact(!showContact)
    }

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onConfirmReason = (reason) => {
        // Handle the user's response from the Confirm Reason Modal
        if(reason) {  
            setFormData({ ...formData, rejectionReason: reason });
            console.log("User confirmed the application rejection.")
        } else {
            console.log("User cancelled the application rejection.")
        }
        handleConfirmReason();
    }

    const cancel = async () => {
        const confirmation = await showConfirmation("Are you sure you want to cancel prosessing this Application?")
        if(confirmation) {
            console.log("Processing Application Cancelled! The form is reset.")
            toast.info("'Processing Application' -> Cancelled!", {
                description: "The application has been reset.",
            })
            navigate('/login')
        } else {
            console.log("Cancel Aborted! Continue processing the Membership Application.")
            toast.info("Cancel -> Aborted!", {
                description: "Continue processing the 'Membership Application'.",
            })
        }
    }

    const reject = async (e) => {
        if(formData.notes === '' || formData.notes === null) {
            toast.error("Rejection Notes Required!", {
                description: "Please provide notes for rejecting the application.",
            })
            return
        }

        const confirmation = await showConfirmReason()
        if(confirmation) {
            onReject(e)
            console.log("Membership Application Rejected! The application status is set to rejected.")
            toast.info("'Membership Application' -> Rejected!", {
                description: "The application has been rejected.",
            })
            navigate('/login')
        } else {
            console.log("Reject Aborted! Continue processing the Membership Application.")
            toast.info("Reject -> Aborted!", {
                description: "Continue processing the 'Membership Application'.",
            })
        }
    }

    const returnApplication = async (e) => {
        if(formData.notes === '' || formData.notes === null) {
            toast.error("Return Notes Required!", {
                description: "Please provide notes for returning the application.",
            })
            return
        }

        const confirmation = await showConfirmReason()
        if(confirmation) {
            onReturned(e)
            console.log("Membership Application Returned! The application status is set to returned.")
            toast.info("'Membership Application' -> Returned!", {
                description: "The application has been returned to the applicant.",
            })
            navigate('/login')
        } else {
            console.log("Return Aborted! Continue processing the Membership Application.")
            toast.info("Return -> Aborted!", {
                description: "Continue processing the 'Membership Application'.",
            })
        }
    }

    return (
    <>
        <div>
            {
                loading ? (
                    <LoadingSpinner caption={'Submitted Application'} clsTextColor={"text-primary"} />
                ) : (
                    isAuthenticated && (
                        <>
                            <div className='card mb-3 border border-primary shadow'>
                                <div className="card-header bg-primary text-white">
                                    <div className="d-flex text-white">
                                        <CardChecklist size={30} className='me-2' />
                                        <h3 className='ms-1'>Application Details: [{formData.applicationStatus}]</h3>
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
                                    <h5 className="text-primary mb-3"><strong>Application Details</strong></h5>
                                    <div className="form-group row row-cols-auto">
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="applicationNumber"
                                                    type="text" 
                                                    className="form-control"
                                                    value={formData.applicationNumber ?? ''}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="applicationNumber">Application Number</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="applicationId"
                                                    type="text" 
                                                    className="form-control"
                                                    value={formData.id ?? ''}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="applicationId">Application Id</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="appCreatedAt"
                                                    type="text" 
                                                    className="form-control"
                                                    value={formData.appCreatedAt ?? ''}
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
                                                    value={formData.appUpdatedAt ?? ''}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="appUpdatedAt">App Updated At</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="maritalStatus"
                                                    type="text" 
                                                    className="form-control"
                                                    value={formData.maritalStatus ?? ''}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="maritalStatus">Marital Status</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xxl-3">
                                            <div className="form-floating mb-3">
                                                <input 
                                                    id="dob"
                                                    type="text" 
                                                    className="form-control"
                                                    value={formData.person.dob ?? ''}
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
                                                    value={formData.person.lifeStatus ?? ''}
                                                    disabled
                                                    readOnly
                                                />
                                                <label htmlFor="lifeStatus">Life Status</label>
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
                                                <label htmlFor={"applicationStatus"}>Application Status</label>
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
                                            <ViewContactCard contact={formData.person.contact} />
                                        )
                                    }
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
                                        peopleData={formData.beneficiaries}
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
                                    <div className="text-center my-3">
                                        {
                                            (formData.applicationStatus === 'Under review' || formData.applicationStatus === 'Approved') && (
                                                <>
                                                    <button type="submit" onClick={reject} className="btn btn-danger mx-3" title='Reject Membership Application'>
                                                        <span className="d-none d-sm-inline-block">
                                                            { loading ? 'Updating...' : 'Set Rejected' }
                                                        </span>
                                                        <HandThumbsDownFill size={20} className="m-0 ms-sm-1 mb-1" />
                                                    </button>
                                                    <ConfirmReasonModal
                                                        showReason={showReason}
                                                        onConfirmReason={onConfirmReason}
                                                        onCancelReason={handleCancelReason}
                                                    />
                                                </>
                                            )
                                        }
                                        {/*TODO: Create method to change status to 'Returned' and allow user to re-submit the a draft application */}
                                        {
                                            (formData.applicationStatus === 'Submitted' || formData.applicationStatus === 'Under review') && (
                                                <>
                                                    <button type="submit" onClick={returnApplication} className="btn btn-primary mx-3" title='Return Membership Application'>
                                                        <span className="d-none d-sm-inline-block">
                                                            { loading ? 'Updating...' : 'Return to User' }
                                                        </span>
                                                        <SignTurnLeftFill size={20} className="m-0 ms-sm-1 mb-1" />
                                                    </button>
                                                    <ConfirmationModal
                                                        show={show}
                                                        message={confirmMsg}
                                                        onConfirm={handleConfirm}
                                                        onCancel={handleCancel}
                                                    />
                                                </>
                                            )
                                        }
                                        <button type='button' onClick={cancel} className="btn btn-outline-danger mx-3" title='Cancel Application Review'>
                                            <span className="d-none d-sm-inline-block">Cancel</span>
                                            <XOctagonFill size={20} className="m-0 ms-sm-1 mb-1" />
                                        </button>
                                        <ConfirmationModal
                                            show={show}
                                            message={confirmMsg}
                                            onConfirm={handleConfirm}
                                            onCancel={handleCancel}
                                        />
                                        {
                                            formData.applicationStatus === 'Submitted' && (
                                                <button type="submit" onClick={(e) => onReview(e)} className="btn btn-success mx-3" title='Set Membership Application Under Review'>
                                                    <span className="d-none d-sm-inline-block">
                                                        { loading ? 'Updating...' : 'Set Under Review' }
                                                    </span>
                                                    <FolderSymlinkFill size={20} className="m-0 ms-sm-1 mb-1" />
                                                </button>  
                                            )
                                        }
                                        {
                                            formData.applicationStatus === 'Under review' && (   
                                                <button type="submit" onClick={(e) => onApprove(e)} className="btn btn-success mx-3" title='Approve Membership Application'>
                                                    <span className="d-none d-sm-inline-block">
                                                        { loading ? 'Updating...' : 'Set Approved' }
                                                    </span>
                                                    <HandThumbsUpFill size={20} className="m-0 ms-sm-1 mb-1" />
                                                </button> 
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                )
            }
        </div>
    </>
    )
}

SubmittedApplication.propTypes = {
    formData: PropTypes.object,
    setFormData: PropTypes.func,
    onInputChange: PropTypes.func,
    onReview: PropTypes.func,
    onApprove: PropTypes.func,
    onReject: PropTypes.func,
    onReturned: PropTypes.func,
    loading: PropTypes.bool,
}

export default SubmittedApplication
