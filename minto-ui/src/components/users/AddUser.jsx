import { useEffect, useState } from "react";
import { toast } from 'sonner'
import useConfirmation from "../hooks/useConfirmation";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../loading/LoadingSpinner";
import { validators } from "../validate/validators";
import { areAllEmptyStrings } from "../validate/stringUtils";
import UserForm from "./components/UserForm";
import { PersonPlus } from "react-bootstrap-icons";

const DEFAULT_USER = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    picture: "",
    source: 'DASHBOARD'
}

const AddUser = () => {
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [message, setMessage] = useState('')
    const [saving, setSaving] = useState(false)
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false)
    const [formData, setFormData] = useState(DEFAULT_USER)
    const [formErrors, setFormErrors] = useState({ ...DEFAULT_USER, source: '' })
    const [image, setImage] = useState(null)
    const [feedback, setFeedback] = useState('')
    let user = getUser()

    useEffect(() => {
        const isUserAdminOrStaff = () => {
            if (user !== null) {
                if ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))
                    return true;
                else
                    return false;
            }
        }
        setIsAdminOrStaff(isUserAdminOrStaff())

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [message, user])

    const validateForm = () => {
        const err = {};

        err.firstName = validators.name(formData.firstName)
        err.lastName = validators.name(formData.lastName)
        err.email = validators.email(formData.email)
        err.password = validators.password(formData.password)
        err.role = validators.required(formData.role)
        err.picture = formErrors.picture
        setFormErrors(err)
        return areAllEmptyStrings(err);
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage('Adding new user...')
        if (validateForm()) {
            toast.success('Add user form valid!')
            try {
                if(isAuthenticated) {
                    const bodyData = new FormData();
                    if(image)
                        bodyData.append("imageFile", image);
                    bodyData.append(
                        "addUserDTO",
                        new Blob([JSON.stringify(formData)], { type: "application/json" })
                    );

                    const response = await fetchWithAuth('/users/secure', {
                        method: 'POST',
                        body: bodyData,
                    })
                    
                    if(!response.ok) {
                        if(response.status == 409) {
                            const errorData = await response.json();
                            console.log(`[Error: ${errorData.statusCode}] - message: ${errorData.message}`)
                            throw new Error(errorData.message)
                        } else {
                            console.log(`HTTP error! status: ${response.status}`)
                            throw new Error(`HTTP error! status: ${response.status}`)
                        }
                    }

                    const jsonData = await response.json();
                    //console.log('jsonData: ', jsonData)
                    resetFormData()
                    setMessage(`User: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
                    toast.success(`User: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
                }
            } catch (error) {
                console.log(error)
                setFeedback(error.message)
                toast.error(error.message)
            } finally {
                setSaving(false)
            }
        } else {
            console.log(formErrors)
            toast.error('User form is NOT valid')
            setSaving(false)
        } 
    }

    const cancel = async () => {
        const confirmation = await showConfirmation("Are you sure you want to cancel adding a new user?")
        if(confirmation) {
            resetFormData();
            console.log("Add new user cancelled! The form is reset.")
            toast.info("Add new user -> Cancelled!", {
                description: "The form has been reset."
            })
            return true;
        } else {
            console.log("Cancel aborted! Continue adding a new user.")
            toast.info("Cancel -> Aborted!", {
                description: "Continue adding a new user."
            })
            return false;
        }
    }

    const resetFormData = () => {
        setFormData(DEFAULT_USER);
        setFeedback('')
    }

    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="card my-3 border border-dark shadow">
                        <div className="card-header text-white bg-dark">
                            <div className="d-flex">
                                <PersonPlus size={26} className="text-white me-2" />
                                <span className="fs-5" style={{ fontWeight: '700'}}>Add New User</span>
                            </div>
                        </div>
                        <div className='card-body'>
                            { feedback && (
                                <div 
                                    className="text-center fw-bold my-2 p-2 border border-2 border-danger rounded-3" 
                                    style={{ background: '#FEC5E5'}}
                                >
                                    Error: {feedback}
                                </div>
                            )}
                            <UserForm
                                formData={formData} 
                                setFormData={setFormData}
                                formErrors={formErrors} 
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
                    <LoadingSpinner caption={'Add User'} clsTextColor={"text-black"} />
                )
            }
        </>
    )
}

export default AddUser
