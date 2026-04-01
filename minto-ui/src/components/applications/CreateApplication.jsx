import { ClipboardPlus, FileEarmarkPerson, PersonPlusFill, PersonRolodex, XCircleFill } from "react-bootstrap-icons"
import { Suspense, useEffect, useState } from "react"
import UserSelectionModal from "../users/UserSelectionModal"
import useConfirmation from "../hooks/useConfirmation"
import { defaultApplication } from "../../model/defaultApplication"
import ConfirmationModal from "../misc/modals/ConfirmationModal"
import ViewUser from "../users/ViewUser"
import { toast } from "sonner"
import AddUser from "../users/AddUser"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"
import LoadingSpinner from "../loading/LoadingSpinner"
import NewApplication from "./NewApplication"

const CreateApplication = () => {
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const [formData, setFormData] = useState({ ...defaultApplication })
    const [showUsersModal, setShowUsersModal] = useState(false)
    const [showAddUser, setShowAddUser] = useState(false)
    const [appUser, setAppUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [appCreated, setAppCreated] = useState(false)
    const [appExists, setAppExists] = useState(false)
    let user = getUser()

    useEffect(() => {
        const loadApplications = async (usr) => {
            setLoading(true)
            try {
                if(user) {
                    const params = {
                        id: usr.id
                    }
                    const queryStr = new URLSearchParams(params).toString()
                    const response = await fetchWithAuth(`/applications/user?${queryStr}`, {
                        method: 'GET',
                        credentials: "include",
                    })
                    
                    if (!response.ok) {
                        console.log("[CreateApplication] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok')
                    }
    
                    const applicationsData = await response.json()
                    if(applicationsData.length > 0) {// Only set formData if a draft application exists
                        //setFormData(applicationsData)
                        //console.log('applicationsData: ', applicationsData)
                        setAppExists(true)
                        toast.success('Applications loaded successfully!')
                    } else {
                        console.log('No draft application found for the user.')
                        toast.error('No draft application found for the user.')
                    }
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        if(appUser) {
            loadApplications(appUser)
            //console.log('formData: ', formData)
        }
    }, [formData, appUser])

    const cancel = async () => {
        const confirmation = await showConfirmation('Are you sure you want to cancel application?')
        if(confirmation) {
            setFormData({ ...defaultApplication })
            setAppUser(null)
            setShowAddUser(false)
            setAppExists(false)
            setAppCreated(false)
            console.log('New application cancelled! The form is reset.')
            toast.info('New application -> Cancelled!', {
                description: 'The form has been reset.',
            })
            //navigate('/login')
        } else {
            console.log('Cancel aborted! Continue working on new application.')
            toast.info('Cancel -> Aborted!', {
                description: 'Continue working on new application.',
            })
        }
    }

    const handleAddUser = (userToAdd) => {
        setShowAddUser(false)
        setAppUser(userToAdd)
        addUser(userToAdd)
        setShowUsersModal(false)
    }

    const addUser = (userToAdd) => {
        setFormData(prev => ({
            ...prev,
            user: userToAdd,
        }))
    }

    const onStart = () => {
        console.log('Starting application...')
        setAppCreated(true)
    }

    const handleSelectUser = () => {
        setShowUsersModal(true)
        setAppUser(null)
        setAppExists(false)
    }

    const handleCreateUser = () => {
        setShowAddUser(true)
        setAppUser(null)
        setAppExists(false)
    }
    
    if(appCreated) {
        if(formData.user.id == null) {
            setAppCreated(false)
            setAppUser(null)
            setShowAddUser(false)
            setAppExists(false)
        } else {
            return (
                <Suspense fallback={<LoadingSpinner caption={'New Application'} clsTextColor={"text-primary"} />}>
                    <NewApplication 
                        title={'New Application'} 
                        headerBgColor={'bg-primary'} 
                        cardBorderColor={'border-primary'} 
                        formData={formData}
                        setFormData={setFormData}
                    />
                </Suspense>
            )
        }

    }
    

    return (
        <>
            <div className="mb-3">
                <div className="card my-3 border border-primary shadow"> 
                    <div className='card-header text-white bg-primary'>
                        <div className="d-flex">
                            <ClipboardPlus size={26} className='text-white me-2' />
                            <span className="fs-5" style={{ fontWeight: '700'}}>Create New Application</span>
                        </div>
                    </div>
                    <div className="card-body px-1 px-sm-3">
                        <span className="ms-2 fs-5" style={{ fontWeight: '600'}}>1. Select user</span>
                        <div className="d-flex justify-content-center my-3">
                            <button 
                                onClick={handleSelectUser}
                                className="d-flex btn btn-dark text-center me-2"
                                title={`Select User to Add`}
                            >
                                <PersonRolodex className="me-2 mb-1 text-white" size={21} />
                                Select 
                                <span className='d-none d-sm-flex text-white'>&nbsp;User</span>
                            </button>
                            <span className="fw-bold mt-2 me-2">- OR -</span>
                            <button 
                                onClick={handleCreateUser}
                                className="d-flex btn btn-dark text-center me-2"
                                title={`Create User to Add`}
                            >
                                <PersonPlusFill className="me-2 mb-1 text-white" size={21} />
                                Create 
                                <span className='d-none d-sm-flex text-white'>&nbsp;User</span>
                            </button>
                        </div>
                        <div className="container">
                            { appExists && (
                                <div 
                                    className="text-center fw-bold my-2 p-2 border border-2 border-danger rounded-3" 
                                    style={{ background: '#FEC5E5'}}
                                >
                                    Error: Application already exists.
                                </div>
                            )}
                            { appUser && isAuthenticated && (
                                <ViewUser formData={appUser} />
                            )}
                            { showAddUser && isAuthenticated && (
                                <AddUser />
                            )}
                        </div>
                    </div>
                    <div className="card-footer border-top border-primary px-1 px-sm-3" style={{ background: '#ddeeff' }}>
                        <span className="ms-2 fs-5" style={{ fontWeight: '600'}}>2. Start application</span>
                        <div className="text-center my-3">
                            <button type='button' onClick={cancel} className="btn btn-outline-danger mx-3" disabled={loading} title='Cancel Application Review'>
                                <XCircleFill size={20} className="me-1 mb-1" />
                                <span className="d-inline-block">Cancel</span>
                            </button>
                            <button type="button" onClick={(e) => onStart(e)} className="btn btn-success mx-3" disabled={appUser === null || appExists} title='Cancel Application Review'>
                                <FileEarmarkPerson size={20} className="me-1 mb-1" />
                                <span className="d-inline-block">
                                    { loading ? 'Starting...' : 'Start App' }
                                </span>
                            </button>
                            <ConfirmationModal
                                show={show}
                                message={confirmMsg}
                                onConfirm={handleConfirm}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showUsersModal && (
                <UserSelectionModal
                onClose={() => setShowUsersModal(false)}
                onAddUser={handleAddUser}
                personType={'User'}
                />
            )}
        </>
    )
}

export default CreateApplication