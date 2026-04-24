import { Heart } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import ChildrenForm from './ChildrenForm';
import SpousesForm from './SpousesForm';

const FamilyInfo = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors, setFormErrors } = props;
    
    return (
        <>
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'crimson'}}>
                    <div className="d-flex">
                        <Heart size={28} className='me-2 text-white' />
                        <span className='h5 fw-semibold text-white'>Family Information</span>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Spouses Section */}
                    <SpousesForm
                        formData={formData}
                        addPersonToArray={addPersonToArray}
                        renderPersonForm={renderPersonForm}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />

                    {/* Children Section */}
                    <ChildrenForm 
                        formData={formData} 
                        addPersonToArray={addPersonToArray} 
                        renderPersonForm={renderPersonForm} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />
                </div>
            </div>
        </>
    )
}

FamilyInfo.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default FamilyInfo