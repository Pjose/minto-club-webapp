import { useEffect, useState } from "react"
import UserGrid from "../grid/UserGrid"
import { toast } from 'sonner'
import UpdateUser from "./UpdateUser"
import ViewUser from "./ViewUser"
import { Search } from "react-bootstrap-icons"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"
import { validators } from "../validate/validators"
import { areAllEmptyStrings } from "../validate/stringUtils"

const DEFAULT_USER = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    picture: "",
    source: ""
}

const EditUser = () => {
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [selectedUser, setSelectedUser] = useState(null)
    const [viewUser, setViewUser] = useState(false)
    const [message, setMessage] = useState('')
    const [saving, setSaving] = useState(false)
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_USER)
    const [formErrors, setFormErrors] = useState({ ...DEFAULT_USER, source: '' })
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

        if(selectedUser) {
            setFormData({
                firstName: selectedUser.firstName, 
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                role: selectedUser.role,
                picture: selectedUser.picture,
            })
        }

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
                setSelectedUser(null)
                setViewUser(false)
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [selectedUser, message, viewUser, user])
    
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
        e.preventDefault();
        setSaving(true)
        if (validateForm()) {
            toast.success('Add user form valid!')
            try {
                const bodyData = new FormData()
                if(image)
                    bodyData.append("imageFile", image)
                bodyData.append(
                    "updates",
                    new Blob([JSON.stringify(formData)], { type: "application/json" })
                );

                {/*const response = await fetchWithAuth(`/users/secure/${formData.email}`, { */}
                const response = await fetchWithAuth(`/users/secure`, {
                    method: 'PATCH',
                    body: bodyData,
                });

                if(!response.ok) {
                    console.log(`HTTP error! status: ${response.status}`)
                    toast.error('HTTP error!')
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const jsonData = await response.json();
                //console.log(jsonData);
                setMessage(`${jsonData.firstName} ${jsonData.lastName} updated successful`)
                toast.success(`${jsonData.firstName} ${jsonData.lastName} updated successful`)
            } catch (error) {
                console.log(error)
                toast.error('Error updating user. ' + error.message)
            } finally {
                setSaving(false)
            }
        } else {
            console.log(formErrors)
            toast.error('User form is NOT valid')
            setSaving(false)
        } 
    }

    const resetFormData = () => {
        setFormData(DEFAULT_USER);
    }

    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="card my-3 border border-dark shadow">
                        <div className="card-header text-white bg-dark">
                            <div className="d-flex">
                                <Search size={26} className='text-white me-2' />
                                <span className="fs-5" style={{ fontWeight: '700'}}>Search User</span>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <UserGrid setSelectedUser={setSelectedUser} setViewUser={setViewUser}  />
                            
                            {
                                selectedUser && viewUser && (
                                    <ViewUser formData={formData} />
                                )
                            }                   
                            { 
                                selectedUser && !viewUser && (
                                    <UpdateUser 
                                        isAuthenticated={isAuthenticated}
                                        isAdminOrStaff={isAdminOrStaff}
                                        formData={formData}
                                        setFormData={setFormData}
                                        resetFormData={resetFormData}
                                        setImage={setImage}
                                        formErrors={formErrors}
                                        setFormErrors={setFormErrors}
                                        onSubmit={onSubmit}
                                        saving={saving}
                                        setSelectedUser={setSelectedUser}
                                    />
                                )
                            }    
                        </div>
                    </div>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
    );
};

export default EditUser