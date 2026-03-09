import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingSpinner from '../../loading/LoadingSpinner'
import ProfileCard from './ProfileCard'
import { useAuth } from '../../hooks/useAuth'
import useFetch from '../../hooks/useFetch'
import { defaultUser } from '../../../model/defaultUser'
import { Link } from 'react-router-dom'
import { CalendarCheck, CalendarPlus, CalendarX, Hash, Journals, JournalX } from 'react-bootstrap-icons'
import { ProgressBar } from 'react-bootstrap'
import ProfileApplications from './ProfileApplications'

const steps = ["Draft", "Submitted", "Under review", "Returned", "Rejected", "Approved"];
{/* 
const stepColors = {
    "Draft": "bg-secondary",
    "Submitted": "bg-primary",
    "Under review": "bg-warning",
    "Returned": "bg-danger",
    "Rejected": "bg-danger",
    "Approved": "bg-success",
};
*/}

const Profile = () => {
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const [profileData, setProfileData] = useState({ ...defaultUser })
    const [userApplications, setUserApplications] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    //const [currentStep, setCurrentStep] = useState('Draft');
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response1 = await fetchWithAuth(`http://localhost:8080/api/v1/profile`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response1.ok) {
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    
                    const data = await response1.json()
                    setProfileData(data);
                    setForm({ firstName: data.firstName || '', lastName: data.lastName || '' })
                    toast.success('User profile loaded successfully!')

                    fetchApplications()
                    toast.success('Applications data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading profile. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }

        const fetchApplications = async () => {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/applications/dto/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            
            if (!response.ok) {
                toast.error('HTTP Error: Network response not OK!')
                throw new Error('Network response was not ok!')
            }
            const data = await response.json()
            //console.log('Applications fetched successfully:', data)
            setUserApplications(data);
        }

        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in Profile!");
          }
    }, [user, fetchWithAuth])

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetchWithAuth('http://localhost:8080/api/v1/profile', {
                method: 'PUT',
                credentials: "include",
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            })

            if (!response.ok) {
                toast.error('HTTP Error: Network response not OK!')
                throw new Error('Network response was not ok!')
            }
            const data = await response.json()
            setProfileData(data);
            setEditing(false);
            showMessage('Profile updated!');
        } catch (err) {
            showMessage('Failed to update profile.');
        } finally { setSaving(false); }
    };

    const handlePictureUpload = (updatedProfile) => {
        setProfileData(updatedProfile);
        showMessage('Profile picture updated!');
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    {/* 
    // Determine progress percentage and color
    const getProgress = () => {
        const index = steps.indexOf(currentStep);
        return ((index + 1) / steps.length) * 100;
    };

    const getVariant = () => {
        if (currentStep === 'Approved') return 'success';
        if (currentStep === 'Rejected') return 'danger';
        if (currentStep === 'Returned') return 'warning';
        return 'primary';
    };
    */}

    return (
        <>
            <div style={{  minHeight:'100vh', background:'#f3f4f6' }}>
                {
                    isLoading ? (
                        <LoadingSpinner caption={'Profile'} clsTextColor={"text-success"} />
                    ) : (
                        isAuthenticated && (
                            <div className="container mt-5 mb-3 pt-4">
                                <ProfileCard 
                                    profileData={profileData}
                                    message={message}
                                    handlePictureUpload={handlePictureUpload}
                                    form={form}
                                    setForm={setForm}
                                    editing={editing}
                                    setEditing={setEditing}
                                    saving={saving}
                                    handleSave={handleSave}
                                />

                                <ProfileApplications />
                                
                            </div>
                        )
                    )
                }
            </div>
        </>
    )
}

export default Profile

const s = {
    title: { fontSize:'26px', fontWeight:'700', color:'darkgreen', margin:'0 0 4px' },
    infoItem: { display:'flex', alignItems:'center', gap:'12px', background:'#f9fafb', padding:'12px', marginBottom: '4px', borderRadius:'10px' },
    infoIcon: { fontSize:'22px' },
    infoLabel: { margin:'0 0 2px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' },
    infoValue: { margin:0, fontSize:'14px', color:'#374151', fontWeight:'500' },
}