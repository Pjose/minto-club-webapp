import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'
import LoadingSpinner from '../loading/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import { defaultUser } from '../../model/defaultUser';
import PictureView from './components/PictureView';
import { CalendarCheck, CalendarPlus, Keyboard, PersonBadge } from 'react-bootstrap-icons';

const ViewUser = (props) => {
    const { formData } = props
    const [viewUserData, setViewUserData] = useState({ ...defaultUser })
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if(formData.email && user) {
                    const response = await fetchWithAuth(`/users/${formData.email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewUser] - Error: ", response.status)
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json();
                    setViewUserData(data);
                    toast.success('User data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading user. ' + error.message)
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
        
        return () => {
            console.log("Cleaned up after fetchData in ViewUser!");
          }
    }, [formData, user, fetchWithAuth]);

    return (
        <>
            {
                (isAuthenticated && ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))) ? (
                    <div>
                        {
                            isLoading ? (
                                <LoadingSpinner caption={'View user'} clsTextColor={"text-black"} />
                            ) : (
                                isAuthenticated && (
                                    <div className="container my-3 px-0">
                                        <div className="card my-4 border">
                                            <div className="card-header text-white bg-dark">
                                                <h4 className="card-title">View User</h4>
                                            </div>
                                            <div className='card-body'>
                                                <div className="container">
                                                    <div className="form-group row">
                                                        <div className="col-lg-6 col-xl-3">
                                                            <div style={s.pictureSection}>
                                                                <h2 style={s.sectionTitle}>Picture</h2>
                                                                <PictureView
                                                                    currentPicture={viewUserData.picture}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-xl-8">
                                                            <div className="row">
                                                                <div style={s.infoHeader}>
                                                                    <div>
                                                                        <h1 style={s.name}>{viewUserData.firstName} {viewUserData.lastName}</h1>
                                                                        <p style={s.username}>{viewUserData.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className='col-xl-6'>
                                                                    <div style={s.infoItem}>
                                                                        <PersonBadge size={24} className="text-secondary" />
                                                                        <div>
                                                                            <p style={s.infoLabel}>Role</p>
                                                                            <p style={s.infoValue}>{viewUserData.role}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div style={s.infoItem}>
                                                                        <Keyboard size={24} className="text-secondary" />
                                                                        <div>
                                                                            <p style={s.infoLabel}>Source</p>
                                                                            <p style={s.infoValue}>{viewUserData.source}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                    <div style={s.infoItem}>
                                                                        <CalendarCheck size={24} className="text-secondary" />
                                                                        <div>
                                                                            <p style={s.infoLabel}>Created On</p>
                                                                            <p style={s.infoValue}>{new Date(viewUserData.createdAt).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div style={s.infoItem}>
                                                                        <CalendarPlus size={24} className="text-secondary" />
                                                                        <div>
                                                                            <p style={s.infoLabel}>Updated On</p>
                                                                            <p style={s.infoValue}>{new Date(viewUserData.updatedAt).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
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

ViewUser.propTypes = {
    formData: PropTypes.object,
}

export default ViewUser

const s = {
    avatar: { width:'150px', height:'150px', borderRadius:'50%', objectFit:'cover', border:'4px solid #12ab34', boxShadow:'0 4px 20px rgba(102,126,234,0.3)' },
    pictureSection: { padding:'32px', background:'linear-gradient(180deg,#d5f3ff,#d5f3df)', border:'1px solid #e5e7eb', borderRadius: '0px 0px 0px 0px', display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' },
    sectionTitle: { fontSize:'15px', fontWeight:'700', color:'#374151', margin:0, textTransform:'uppercase', letterSpacing:'0.5px' },
    infoHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' },
    name: { fontSize:'26px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 4px' },
    username: { color:'darkgreen', fontWeight:'500', margin:0, fontSize:'15px' },
    infoItem: { display:'flex', alignItems:'center', gap:'12px', background:'#f9fafb', padding:'12px', marginBottom: '4px', borderRadius:'10px' },
    infoIcon: { fontSize:'22px' },
    infoLabel: { margin:'0 0 2px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' },
    infoValue: { margin:0, fontSize:'14px', color:'#374151', fontWeight:'500' },
}