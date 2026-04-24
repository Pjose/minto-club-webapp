import PropTypes from 'prop-types';
import { Plus } from 'react-bootstrap-icons'

const ContactBar = (props) => {
    const { title, subTitle, arrayName, icon, addNewContact } = props
    const IconComponent = icon;

    return (
        <>
            {/* ── Section bar ── */}
            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                <div className="d-flex items-center">
                    <IconComponent size={22} className='mt-1 mx-1' />
                    <span className="fs-5 fw-semibold">{title}</span>
                </div>
                <button 
                    type="button" 
                    className="d-flex btn btn-dark text-center" 
                    onClick={() => addNewContact(arrayName)}
                    title={`Add ${subTitle}`}
                >
                    <Plus className="mb-1" color="white" size={21} />
                    <span className='d-none d-sm-flex text-white'>{subTitle}</span>
                </button>
            </div>
        </>
    )
}

ContactBar.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    arrayName: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    addNewContact: PropTypes.func.isRequired
}

export default ContactBar