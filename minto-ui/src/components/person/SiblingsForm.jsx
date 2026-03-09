import { PersonArmsUp, Plus } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const SiblingsForm = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

  return (
    <>
        <div className="container py-6 px-sm-6 mb-4 rounded-lg border shadow">
            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                <div className="d-flex items-center">
                    <PersonArmsUp size={32} className='mt-1 mx-1' style={{ color: 'orange' }} />
                    <h3 
                        className="text-lg font-semibold"
                        style={{ color: 'orange' }}
                    >
                        <strong>Siblings</strong>
                    </h3>
                </div>
                <button 
                    type="button" 
                    onClick={() => addPersonToArray('siblings')}
                    className="d-flex btn text-center"
                    style={{ backgroundColor: 'orange' }}
                    title={`Add Sibling`}
                >
                    <Plus className="mb-1 text-white" size={21} />
                    <span className='d-none d-sm-flex text-white'>Add Sibling</span>
                </button>
            </div>
        
            {formData.siblings.length === 0 ? (
                <p className="text-secondary text-center py-4">No siblings added yet</p>
            ) : (
                formData.siblings.map((sibling, index) => 
                renderPersonForm(sibling, 'siblings', index, 'Sibling', formErrors)
                )
            )}
        </div>
    </>
  )
}

SiblingsForm.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
}

export default SiblingsForm