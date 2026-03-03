import { Send } from 'react-bootstrap-icons'
import PropTypes from 'prop-types'
import ViewApplicationCard from '../ViewApplicationCard';

const ReviewAndSubmit = (props) => {
    const { formData, message } = props

    return (
        <>
            <ViewApplicationCard 
                formData={formData}
                headerIcon={Send}
                headerTitle={'Review & Submit'}
                priColor={'green'}
            />
            <div className="align-items-center text-center">
                { message && <span className="text-success ms-2 h5">...{message}...</span> }
            </div>
            
        </>
    )
}

ReviewAndSubmit.propTypes = {
    formData: PropTypes.object,
    message: PropTypes.string,
}

export default ReviewAndSubmit