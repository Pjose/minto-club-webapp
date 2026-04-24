import { PersonLinesFill, Plus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const ClubRelativesForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;
    
    return (
        <>
            <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border shadow">
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <PersonLinesFill size={32} className='mt-1 mx-1' style={{ color: 'teal' }} />
                        <span 
                            className="h5 ms-1 mt-1"
                            style={{ color: 'teal' }}
                        >
                            <strong>Relatives</strong>
                        </span>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => addPersonToArray('relatives')}
                        className="d-flex btn text-center"
                        style={{ backgroundColor: 'teal' }}
                        title={`Add Relative`}
                    >
                        <Plus className="mb-1 text-white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Add Relative</span>
                    </button>
                </div>
            
                {formData.relatives.length === 0 ? (
                    <p className="text-secondary text-center py-4">No relatives added yet</p>
                ) : (
                    formData.relatives.map((relative, index) => 
                    renderPersonForm(relative, 'relatives', index, 'Relative', formErrors)
                    )
                )}
            </div>
        </>
    )
}

ClubRelativesForm.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
}

export default ClubRelativesForm