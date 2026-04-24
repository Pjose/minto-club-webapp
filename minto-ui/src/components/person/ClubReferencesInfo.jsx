import PropTypes from 'prop-types';
import RefereesForm from './RefereesForm';
import ClubRelativesForm from './ClubRelativesForm';
import { PersonCheckFill } from 'react-bootstrap-icons';

const ClubReferencesInfo = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

    return (
        <>
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'coral'}}>
                    <div className="d-flex">
                        <PersonCheckFill size={28} className='me-2 text-white' />
                        <span className='h5 fw-semibold text-white'>Club Reference Information</span>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Referees Section */}
                    <RefereesForm 
                        formData={formData}
                        addPersonToArray={addPersonToArray}
                        renderPersonForm={renderPersonForm}
                        formErrors={formErrors}
                    />

                    {/* Club Relatives Section */}
                    <ClubRelativesForm 
                        formData={formData}
                        addPersonToArray={addPersonToArray}
                        renderPersonForm={renderPersonForm}
                        formErrors={formErrors}
                    />

                </div>
            </div>
        </>
    )
}

ClubReferencesInfo.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
}

export default ClubReferencesInfo