import PropTypes from 'prop-types';
import UserForm from './components/UserForm';
import useConfirmation from '../hooks/useConfirmation';
import { toast } from 'sonner';

const UpdateUser = (props) => {
    const { isAuthenticated, isAdminOrStaff, formData, setFormData, resetFormData, setImage, formErrors, 
        setFormErrors, onSubmit, saving, setSelectedUser } = props
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    
    const cancel = async () => {
        const confirmation = await showConfirmation("Are you sure you want to cancel updating user?")
        if(confirmation) {
            resetFormData()
            setSelectedUser(null)
            console.log("Update user cancelled! The form is reset.")
            toast.info("Update user -> Cancelled!", {
                description: "The form has been reset."
            })
            return true;
        } else {
            console.log("Cancel aborted! Continue updating user.")
            toast.info("Cancel -> Aborted!", {
                description: "Continue updating user."
            })
            return false;
        }
    }
    
    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="card mt-4 mb-3 border">
                        <div className="card-header text-white bg-dark">
                            <h5 className="card-title">Edit User</h5>
                        </div>
                        <div className="card-body">
                            <UserForm
                                formData={formData} 
                                setFormData={setFormData}
                                formErrors={formErrors} 
                                setFormErrors={setFormErrors}
                                setImage={setImage} 
                                saving={saving} 
                                cancel={cancel} 
                                onSubmit={onSubmit} 
                                show={show} 
                                confirmMsg={confirmMsg} 
                                handleConfirm={handleConfirm} 
                                handleCancel={handleCancel}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Authenticating... / Unauthorized</h3>
                    </div>
                )
            }
        </>
    )
}

UpdateUser.propTypes = {
    isAuthenticated: PropTypes.bool,
    isAdminOrStaff: PropTypes.bool,
    formData: PropTypes.object,
    setFormData: PropTypes.func, 
    resetFormData: PropTypes.func,
    setImage: PropTypes.func,
    formErrors: PropTypes.object, 
    setFormErrors: PropTypes.func,
    onSubmit: PropTypes.func,
    saving: PropTypes.bool, 
    setSelectedUser: PropTypes.func,
}

export default UpdateUser
