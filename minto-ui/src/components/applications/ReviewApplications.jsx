import { useEffect, useState } from "react"
import { ArrowLeftRight, Search } from "react-bootstrap-icons"
import { toast } from "sonner"
import ViewApplication from "./ViewApplication"
import ApplicationsGrid from "../grid/ApplicationsGrid"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"
import SubmittedApplication from "./SubmittedApplication"
import { defaultApplication } from "../../model/defaultApplication"

const ReviewApplications = () => {
    const navigate = useNavigate()
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated } = useAuth()
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [viewApplication, setViewApplication] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({...defaultApplication })

    useEffect(() => {
        //console.log('selectedApplication:', selectedApplication)
        if(selectedApplication) {
            setFormData(selectedApplication)
        }

        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
                setSelectedApplication(null)
                setViewApplication(false)
            }, 3000)

            return () => clearTimeout(timerId)
        }
    }, [selectedApplication, message])
/*
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        //console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`/applications`, {
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
            toast.error('Error updating submitted application. ' + error.message)
        } finally {
            setLoading(false)
        }
    }
*/
    const onReview = async (e) => {
        e.preventDefault();
        setLoading(true)
        //console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`/applications/review`, {
                method: 'POST',
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
            setMessage('Application is set under review successfully')
            toast.success('Application is set under review successfully')
            //navigate(-1)
        } catch (error) {
            console.log(error)
            toast.error('Error setting application under review. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const onApprove = async (e) => {
        e.preventDefault();
        setLoading(true)
        //console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`/applications/approve`, {
                method: 'POST',
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
            setMessage('Application is approved successfully')
            toast.success('Application is approved successfully')
            //navigate(-1)
        } catch (error) {
            console.log(error)
            toast.error('Error approving application. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const onReject = async (e) => {
        e.preventDefault();
        setLoading(true)
        //console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`/applications/reject`, {
                method: 'POST',
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
            setMessage('Application set to rejected successfully')
            toast.success('Application set torejected successfully')
            //navigate(-1)
        } catch (error) {
            console.log(error)
            toast.error('Error setting application to rejected. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const onReturned = async (e) => {
        e.preventDefault();
        setLoading(true)
        //console.log('FormData:', formData)

        try {
            const response = await fetchWithAuth(`/applications/return`, {
                method: 'POST',
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
            setMessage('Application set to returned successfully')
            toast.success('Application set to returned successfully')
            //navigate(-1)
        } catch (error) {
            console.log(error)
            toast.error('Error setting application to returned. ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <>
        {
            isAuthenticated ? (
                <div className="container my-3 px-0">
                    <div className="card mb-4 border border-primary shadow">
                        <div className="card-header text-white bg-primary">
                            <div className="d-flex">
                                <ArrowLeftRight size={26} className='text-white me-2' />
                                <span className="fs-5" style={{ fontWeight: '700'}}>Process Applications</span>
                            </div>
                        </div>
                        <div className='card-body px-1 px-sm-3'>
                            <div className="d-flex align-items-center">
                                { message && <span className="text-primary ms-2 h6">{message}</span> }
                            </div>
                            
                            <ApplicationsGrid 
                                setSelectedApplication={setSelectedApplication} 
                                setViewApplication={setViewApplication} 
                                url={"/applications/status/in/submitted,under%20review,returned"} 
                            />
                                
                        </div>
                    </div>
                    {
                        selectedApplication && viewApplication && (
                            <ViewApplication formData={formData} />
                        )
                    }                   
                    { 
                        selectedApplication && !viewApplication && (
                            <>
                            {<SubmittedApplication 
                                formData={formData} 
                                setFormData={setFormData}
                                loading={loading}
                                onInputChange={onInputChange}
                                onReview={onReview}
                                onApprove={onApprove}
                                onReject={onReject}
                                onReturned={onReturned}
                                setSelectedApplication={setSelectedApplication}
                            />}
                            {/* <SubmittedApplication 
                                formData={formData} 
                                loading={loading}
                                onInputChange={onInputChange}
                                onSubmit={onSubmit}
                            /> */}
                            {/*<ModifyApplication
                                formData={formData}
                                setFormData={setFormData}
                                loading={loading}
                                onSubmit={onSubmit}
                            />*/}
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
    )
}

export default ReviewApplications