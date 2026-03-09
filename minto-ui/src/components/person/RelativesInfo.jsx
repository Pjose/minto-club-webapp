import { People } from "react-bootstrap-icons";
import PropTypes from 'prop-types';
import ParentsForm from "./ParentsForm";
import SiblingsForm from "./SiblingsForm";

const RelativesInfo = (props) => {
    const { formData, addPersonToArray, renderPersonForm, formErrors } = props;

    return (
        <>
            <div className='card'>
                <div className="card-header text-white" style={{ backgroundColor: 'purple'}}>
                    <div className="d-flex">
                        <People size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>Relatives Information</h3>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">

                    {/* Parents Section */}
                    <ParentsForm 
                        formData={formData}
                        addPersonToArray={addPersonToArray}
                        renderPersonForm={renderPersonForm}
                        formErrors={formErrors}
                    />

                    {/* Siblings Section */}
                    <SiblingsForm 
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

RelativesInfo.propTypes = {
    formData: PropTypes.object.isRequired,
    addPersonToArray: PropTypes.func.isRequired,
    renderPersonForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
}

export default RelativesInfo