import { useEffect, useState } from "react";
import CustomSelect from "../misc/CustomSelect";
import PasswordGenerator from "../misc/PasswordGenerator";
import { toast } from 'sonner'
import { Floppy, XCircleFill } from "react-bootstrap-icons";
import ConfirmationModal from "../misc/modals/ConfirmationModal";
import useConfirmation from "../hooks/useConfirmation";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { defaultUser } from "../../model/defaultUser";
import LoadingSpinner from "../loading/LoadingSpinner";
import { validators } from "../validate/validators";
import { areAllEmptyStrings } from "../validate/stringUtils";

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
    const [formErrors, setFormErrors] = useState(DEFAULT_USER)
    const [image, setImage] = useState(null)
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

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0])
    }

    const handlePasswordChange = (newPassword) => {
        setFormData({ ...formData, password: newPassword });
    }

    const validateForm = () => {
        const err = {};

        err.firstName = validators.name(formData.firstName)
        err.lastName = validators.name(formData.lastName)
        err.email = validators.email(formData.email)
        err.password = validators.password(formData.password)
        err.role = validators.required(formData.role)
        console.log('err: ', err)
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

                    const response = await fetchWithAuth('http://localhost:8080/api/v1/users/secure', {
                        method: 'POST',
                        body: bodyData,
                    })

                    if(!response.ok) {
                        console.log(`HTTP error! status: ${response.status}`)
                        toast.error('HTTP error!')
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    const jsonData = await response.json();
                    //console.log(jsonData)
                    setFormData(DEFAULT_USER)
                    setMessage(`User: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
                    toast.success(`User: ${jsonData.firstName} ${jsonData.lastName} created successfully!`)
                }
            } catch (error) {
                console.log(error)
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
        const confirmation = await showConfirmation("Are you sure you want to cancel 'Add New User'?")
        if(confirmation) {
            setFormData(DEFAULT_USER)
            console.log("Add New User Cancelled! The form is reset.")
            toast.info("'Add New User' -> Cancelled!", {
                description: "The form has been reset."
            })
        } else {
            console.log("Cancel Aborted! Continue with 'Add New User'.")
            toast.info("Cancel -> Aborted!", {
                description: "Continue with 'Add New User' form."
            })
        }
    }

    return (
        <>
            <style>{` 
                .form-control::file-selector-button { 
                    background-color: #333;
                    color: #4af;
                    border: 1px solid #333;
                    padding: .375rem .75rem;
                    border-radius: .25rem;
                }  
                .form-control::file-selector-button::hover {
                    background-color: #777;
                    border: 1px solid #777;
                    color: #333;
                }
              `}
            </style>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="card my-3 border border-dark shadow">
                        <div className="card-header text-white bg-dark">
                            <h3 className="card-title">Add New User</h3>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={(e) => onSubmit(e)} action="">
                                <fieldset disabled={saving}> {/* Disable form interactions when loading or saving */}
                                    <div className="border rounded-lg p-1 p-sm-4 mb-3 bg-light">
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3">
                                                <label htmlFor={"firstName"} className="form-label">
                                                    First Name
                                                </label>
                                                <input
                                                    id={"firstName"}
                                                    name="firstName"
                                                    type={"text"}
                                                    placeholder="First Name"
                                                    value={formData.firstName}
                                                    onChange={(e) => onInputChange(e)}
                                                    className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                                                    required
                                                />
                                                { formErrors.firstName && <div className="text-danger mt-1">{formErrors.firstName}</div>}
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <label htmlFor={"lastName"} className="form-label">
                                                    Last Name
                                                </label>
                                                <input
                                                    id={"lastName"}
                                                    name="lastName"
                                                    type={"text"}
                                                    placeholder="Last Name"
                                                    value={formData.lastName}
                                                    onChange={(e) => onInputChange(e)}
                                                    className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                                                    required
                                                />
                                                { formErrors.lastName && <div className="text-danger mt-1">{formErrors.lastName}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3">
                                                <label htmlFor={"email"} className="form-label">
                                                    Email
                                                </label>
                                                <input
                                                    id={"email"}
                                                    name="email"
                                                    type={"email"}
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={(e) => onInputChange(e)}
                                                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                    required
                                                />
                                                { formErrors.email && <div className="text-danger mt-1">{formErrors.email}</div>}
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <label htmlFor="password" className="form-label">
                                                    Password
                                                </label>
                                                <PasswordGenerator
                                                    className={`text-dark ${formErrors.password ? 'is-invalid' : ''}`}
                                                    id="password"
                                                    name="password"
                                                    placeholder="Type or generate password"
                                                    onChange={handlePasswordChange}
                                                    required
                                                />
                                                { formErrors.password && <div className="text-danger mt-1">{formErrors.password}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-md-5 mb-3">
                                                <label htmlFor="role" className="form-label">
                                                    Role
                                                </label>
                                                <CustomSelect
                                                    className={`mb-3 form-select ${formErrors.role ? 'is-invalid' : ''}`}
                                                    name="role"
                                                    value={formData.role}
                                                    placeholder=" -- Select a role -- "
                                                    onChange={(e) => onInputChange(e)}
                                                    url="http://localhost:8080/api/v1/auth/roles"
                                                    required
                                                />
                                                { formErrors.role && <div className="text-danger mt-1">{formErrors.role}</div>}
                                            </div>
                                            <div className="col-md-7 mb-3">
                                                <label htmlFor="email" className="form-label">
                                                    Picture
                                                </label>
                                                <input
                                                    type={"file"}
                                                    className="form-control"
                                                    name="picture"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="text-center my-3">
                                    <button type='button' onClick={cancel} disabled={saving}
                                        className="btn btn-outline-danger mx-3" title="Cancel New User">
                                        <XCircleFill size={20} className="m-0 me-sm-2 mb-1" />
                                        <span className="d-none d-sm-inline-block">Cancel</span>
                                    </button>
                                    <ConfirmationModal
                                        show={show}
                                        message={confirmMsg}
                                        onConfirm={handleConfirm}
                                        onCancel={handleCancel}
                                    />
                                    <button type="submit" disabled={saving}
                                        className="btn btn-outline-success mx-2 px-3" title="Save New User" >
                                        <Floppy size={20} className="m-0 me-sm-2 mb-1" />
                                        <span className="d-none d-sm-inline-block">
                                            { saving ? 'Saving...' : 'Save' }
                                        </span>
                                    </button>
                                </div>
                            </form>
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
