import { PersonCheck, PersonCheckFill, Plus } from 'react-bootstrap-icons'
import PropTypes from 'prop-types';

const RefereesForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

    return (
        <>
            <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border shadow">
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <PersonCheckFill size={32} className='mt-1 mx-1' style={{ color: 'coral' }} />
                        <span 
                            className="h5 ms-1 mt-1"
                            style={{ color: 'coral' }}
                        >
                            <strong>Referees</strong>
                        </span>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => addPersonToArray('referees')}
                        className="d-flex btn text-center"
                        style={{ backgroundColor: 'coral' }}
                        title={`Add Referee`}
                    >
                        <Plus className="mb-1 text-white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Add Referee</span>
                    </button>
                </div>
            
                {formData.referees.length === 0 ? (
                    <p className="text-secondary text-center py-4">No referees added yet</p>
                ) : (
                    formData.referees.map((referee, index) => 
                    renderPersonForm(referee, 'referees', index, 'Referee', formErrors)
                    )
                )}
            </div>
        </>
    )
}

RefereesForm.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
}

export default RefereesForm