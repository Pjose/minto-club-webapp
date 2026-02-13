import { useEffect, useState } from "react"
import { Search } from "react-bootstrap-icons"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"
import { defaultMember } from "../../model/defaultMember"
import ActivateMember from "./ActivateMember"
import MembersGrid from "../grid/MembersGrid"
import ViewMember from "./ViewMember"
//import UpdateMember from "./UpdateMember";
//import MsgModal from "../misc/modals/MsgModal"
//import useConfirmation from "../hooks/useConfirmation"
//import ConfirmationModal from "../misc/modals/ConfirmationModal"

const ProcessMembers = () => {
    const navigate = useNavigate()
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated } = useAuth()
    const [selectedMember, setSelectedMember] = useState(null)
    const [viewMember, setViewMember] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ ...defaultMember })

    useEffect(() => {
        if(selectedMember) {
            setFormData(selectedMember)
        }

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
                setSelectedMember(null)
                setViewMember(false)
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [selectedMember, message, viewMember])

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/members`, {
                method: 'PUT',
                credentials: "include",
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if(!response.ok) {
                console.log(`HTTP error! status: ${response.status}`)
                toast.error('HTTP error!')
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
            setFormData(jsonData)
            //console.log(jsonData);
            setMessage('Update successful')
            toast.success('Update successful')
            navigate('/login')
        } catch (error) {
            console.log(error)
            toast.error('Error updating member. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        {
            isAuthenticated ? (
                <div className="container my-3 px-0">
                    <div className="card mb-4 border border-danger shadow-lg">
                        <div className="card-header text-danger">
                            <div className="d-flex">
                                <Search size={26} className='text-danger me-2' />
                                <h4 className="card-title">Process Members</h4>
                            </div>
                        </div>
                        <div className='card-body p-0'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <MembersGrid setSelectedMember={setSelectedMember} setViewMember={setViewMember}  />
                                
                        </div>
                    </div>
                    {
                        selectedMember && viewMember && (
                            <ViewMember formData={formData} />
                        )
                    }                   
                    { 
                        selectedMember && !viewMember && (
                            <>
                            { console.log('selectedMember:', formData)}
                            { <ActivateMember 
                                formData={formData} 
                                setFormData={setFormData}
                                loading={loading}
                                onSubmit={onSubmit}
                                /> }
                            {/*<UpdateMember
                                formData={formData}
                                setFormData={setFormData}
                                loading={loading}
                                onSubmit={onSubmit}
                            />
                            */}
                            </>
                        )
                    }
                </div>
            ) : (
                <div className="container my-3 p-2">
                    <h3 className="text-primary text-center">Unauthorized</h3>
                </div>
            )
        }
        </>
    );

    /*
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const [showModal, setShowModal] =  useState(false)

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleDelete = async () => {
        const confirmed = await showConfirmation('Are you sure you want to delete this item?')
        if(confirmed) {
            console.log('Item deleted!')
        } else {
            console.log('Deletion cancelled.')
        }
    }

    return (
        <>
            <div className="card my-3 border border-danger shadow-lg">
                <div className="card-header bg-danger">
                    <h4 className="card-title text-white">Process Members</h4>
                </div>
                <div className="card-body">
                    <p className="fw-bold fs-3 mt-4 mx-auto">&apos;TODO&apos;</p>
                    <h4>Testing Components</h4>
                    <button 
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={handleOpenModal}
                    >
                        Show MsgModal
                    </button>
                    <MsgModal 
                        title={'Test Message'} 
                        message={'This is a message modal example for displaying information!'} 
                        show={showModal}
                        handleClose={handleCloseModal}
                    />

                    <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={handleDelete}
                    >
                        Delete Item
                    </button>
                    <ConfirmationModal
                        show={show}
                        message={confirmMsg}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </div>
                <div className="card-footer">
                    <p>TODO</p>
                </div>
            </div>
        </>
    )
    */
}

export default ProcessMembers
