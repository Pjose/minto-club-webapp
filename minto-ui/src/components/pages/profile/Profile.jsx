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
    const [userApplications, setUserApplications] = useState([])
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
                    toast.success('User data loaded successfully!')

                    fetchApplications()

                    toast.success('Profile data loaded successfully!')
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

                                { userApplications.length > 0 ? (
                                    <div className="my-4">
                                        <h3 className="mb-3" style={s.title}>Your Applications</h3>
                                        <ul className="list-group">
                                            { userApplications.map((app, index) => (
                                                <>
                                                <li key={index} className="list-group-item mb-3">
                                                    <div className="row d-flex justify-content-between align-items-center mb-2">
                                                        <div className='col-12 col-md-3'>
                                                            <h5 className="text-primary my-2"><strong>Application {index + 1}</strong></h5>
                                                        </div>
                                                        <div className='col-12 col-md-7 mx-auto'>
                                                            <h6 className='text-md-center'>Progress Tracker</h6>
                                                            {/* Progress Bar Component */}
                                                            <ProgressBar 
                                                                animated 
                                                                now={((steps.indexOf(app.applicationStatus) + 1) / steps.length) * 100} 
                                                                label={app.applicationStatus} 
                                                                variant={app.applicationStatus === 'Approved' ? 'success' :
                                                                    app.applicationStatus === 'Rejected' ? 'danger' :
                                                                    app.applicationStatus === 'Returned' ? 'warning' :
                                                                    app.applicationStatus === 'Draft' ? 'secondary' :
                                                                    'primary'
                                                                } 
                                                                className="my-3"
                                                            />
                                                        </div>
                                                        <div className='col-12 col-md-2'>
                                                            <span className={`badge ${app.applicationStatus === 'Approved' ? 'bg-success' 
                                                                : app.applicationStatus === 'Under review' ? 'bg-primary'
                                                                : app.applicationStatus === 'Submitted' ? 'bg-primary'
                                                                : app.applicationStatus === 'Rejected' ? 'bg-danger' 
                                                                : app.applicationStatus === 'Returned' ? 'bg-warning' 
                                                                : 'bg-secondary'} text-white`}>
                                                                Status: {app.applicationStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/**if submitted show submitted date, if approved show approved date, if rejected show rejected date */}
                                                    <div className='row'>
                                                        <div className='col-lg-4'>
                                                            <div style={s.infoItem}>
                                                                <Hash size={24} className="text-secondary" />
                                                                <div>
                                                                    <p style={s.infoLabel}>Application No.</p>
                                                                    <p style={s.infoValue}>{app.applicationNumber}</p>
                                                                </div>
                                                            </div>
                                                            { app.submitted && 
                                                                <div style={s.infoItem}>
                                                                    <CalendarPlus size={24} className="text-secondary" />
                                                                    <div>
                                                                        <p style={s.infoLabel}>Submitted On</p>
                                                                        <p style={s.infoValue}>{new Date(app.submittedDate).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            }
                                                            { app.approved &&
                                                                <div style={s.infoItem}>
                                                                    <CalendarCheck size={24} className="text-secondary" />
                                                                    <div>
                                                                        <p style={s.infoLabel}>Approved On</p>
                                                                        <p style={s.infoValue}>{new Date(app.approvedDate).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            }
                                                            { app.rejectedDate &&
                                                                <div style={s.infoItem}>
                                                                    <CalendarX size={24} className="text-secondary" />
                                                                    <div>
                                                                        <p style={s.infoLabel}>Rejected On</p>
                                                                        <p style={s.infoValue}>{new Date(app.rejectedDate).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-lg-8">
                                                            { app.applicationStatus === 'Rejected' && app.rejectionReason &&
                                                                <div style={s.infoItem}>
                                                                    <JournalX size={24} className="text-secondary" />
                                                                    <div>
                                                                        <p style={s.infoLabel}>Rejection Reason</p>
                                                                        <p style={s.infoValue}>{app.rejectionReason}</p>
                                                                    </div>
                                                                </div>
                                                            }
                                                            { (app.submitted || app.approved) &&
                                                                <div style={s.infoItem}>
                                                                    <Journals size={24} className="text-secondary" />
                                                                    <div>
                                                                        <p style={s.infoLabel}>Notes</p>
                                                                        <p style={s.infoValue}>{app.notes}</p>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        app.applicationStatus === 'Draft' && (
                                                            <div className='my-3'>
                                                                <Link to="/draft-application" className="btn btn-primary ms-1">
                                                                    ✏️ Continue Application...
                                                                </Link>
                                                            </div>
                                                        )
                                                    }
                                                </li>
                                                </>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-secondary my-4">You have no applications yet.</p>
                                        { userApplications.length === 0 && 
                                            <div className="d-flex align-items-center my 3">
                                                <Link to="/draft-application" className="btn btn-primary ms-1">
                                                    📝 Start Application
                                                </Link>
                                            </div>
                                        }
                                    </>
                                )}
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