import PropTypes from 'prop-types'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { CardChecklist } from 'react-bootstrap-icons'
import LoadingSpinner from '../loading/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import useFetch from '../hooks/useFetch'
import { defaultApplication } from '../../model/defaultApplication'
import ViewApplicationCard from './ViewApplicationCard'

const ViewApplication = (props) => {
    const { formData } = props
    const [viewApplicationData, setViewApplicationData] = useState({ ...defaultApplication })
    const { fetchWithAuth } = useFetch()
    const { getUser, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if((formData.id > 0) && user) {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/applications/dto/id/${formData.id}`, {
                        method: 'GET',
                        credentials: 'include',
                    })
                    
                    if (!response.ok) {
                        const respError = await response.text()
                        console.log("[ViewApplication] - HTTP Error: " + respError)
                        toast.error('HTTP Error: ' + respError)
                        throw new Error('Network response was not ok! ' + respError)
                    }
                    const data = await response.json()
                    setViewApplicationData(data)
                    toast.success('Application data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading application. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in ViewApplication!")
            }
    }, [formData, user, fetchWithAuth])

    return (
    <>
        <div>
            {
                isLoading ? (
                    <LoadingSpinner caption={'View Application'} clsTextColor={"text-primary"} />
                ) : (
                    isAuthenticated && (
                        <>
                            <ViewApplicationCard 
                                formData={viewApplicationData}
                                headerIcon={CardChecklist}
                                headerTitle={'Application Details'}
                                priColor={'blue'}
                            />
                        </>
                    )
                )
            }
        </div>
    </>
    )
}

ViewApplication.propTypes = {
    formData: PropTypes.object,
}

export default ViewApplication
