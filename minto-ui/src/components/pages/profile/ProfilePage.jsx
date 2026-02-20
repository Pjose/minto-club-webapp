import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect, useState } from "react"
import { toast } from 'sonner'
import useFetch from '../../hooks/useFetch'
import { defaultUser } from '../../../model/defaultUser'
import ProfilePictureUpload from "./ProfilePictureUpload"

const ProfilePage = () => {
    const { getUser, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const { fetchWithAuth } = useFetch()
    const [profileData, setProfileData] = useState({ ...defaultUser })
    const [profile, setProfile] = useState(null)
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ fullName: '', bio: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        fetchData()
        //loadProfile();
        return () => {
            console.log("Cleaned up after fetchData in Profile!");
        }
    }, []);

    /*
    const loadProfile = async () => {
        try {
            //const res = await profileAPI.getProfile();
            //setProfile(res.data);
            //setForm({ fullName: res.data.fullName || '', bio: res.data.bio || '' });
        } catch (err) {
            if (err.response?.status === 401) { logout(); navigate('/login'); }
        } 
    };
    */

    const fetchData = async () => {
        setIsLoading(true)
        try {
            if(user) {
                const response1 = await fetchWithAuth(`http://localhost:8080/api/v1/users/${user.decoded.sub}`, {
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
                //console.log('user fetched successfully:', data)
                setProfileData(data);
                let profileInfo = {}
                profileInfo.profilePictureUrl = data.picture
                profileInfo.fullName = data.firstName + ' ' + data.lastName
                profileInfo.username = data.email
                profileInfo.email = data.email
                profileInfo.createdAt = data.createdAt
                profileInfo.bio = ''
                setProfile(profileInfo)
                setForm({ fullName: profileInfo.fullName || '', bio: profileInfo.bio || '' });
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

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await profileAPI.updateProfile(form);
            setProfile(res.data);
            updateUser({ ...user, fullName: res.data.fullName });
            setEditing(false);
            showMessage('Profile updated!');
        } catch (err) {
            showMessage('Failed to update profile.');
        } finally { setSaving(false); }
    };

    const handlePictureUpload = (updatedProfile) => {
        setProfile(updatedProfile);
        updateUser({ ...user, profilePictureUrl: updatedProfile.profilePictureUrl });
        showMessage('Profile picture updated!');
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    if (!profile) return (
        <div style={s.loadingScreen}>
            <div style={s.spinner}></div>
            <p>Loading profile...</p>
        </div>
    );

    return (
        <>
            <div style={s.page}>
                {/* Header */}
                <header style={s.header}>
                    <div style={s.headerInner}>
                    <div style={s.headerLogo}>👤 ProfileApp</div>
                    <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
                    </div>
                </header>

                <main style={s.main}>
                    {message && <div style={s.toast}>{message}</div>}

                    <div style={s.profileCard}>
                        {/* Picture section */}
                        <div style={s.pictureSection}>
                            <h2 style={s.sectionTitle}>Profile Picture</h2>
                            <ProfilePictureUpload
                            currentPicture={profile.profilePictureUrl}
                            onUploadSuccess={handlePictureUpload}
                            />
                        </div>

                        {/* Info section */}
                        <div style={s.infoSection}>
                            <div style={s.infoHeader}>
                                <div>
                                    <h1 style={s.name}>{profile.fullName || profile.username}</h1>
                                    <p style={s.username}>@{profile.username}</p>
                                </div>
                                {!editing && (
                                    <button style={s.editBtn} onClick={() => setEditing(true)}>✏️ Edit</button>
                                )}
                            </div>

                            {editing ? (
                            <div style={s.editForm}>
                                <div style={s.field}>
                                <label style={s.label}>Full Name</label>
                                <input style={s.input} value={form.fullName}
                                    onChange={e => setForm({...form, fullName: e.target.value})}
                                    placeholder="Your full name" />
                                </div>
                                <div style={s.field}>
                                <label style={s.label}>Bio</label>
                                <textarea style={s.textarea} value={form.bio}
                                    onChange={e => setForm({...form, bio: e.target.value})}
                                    placeholder="Tell us about yourself..." rows={4} />
                                </div>
                                <div style={s.editActions}>
                                <button style={s.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                                <button style={{...s.saveBtn, opacity: saving ? 0.7 : 1}}
                                    onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                </div>
                            </div>
                            ) : (
                            <div>
                                <div style={s.infoGrid}>
                                    <div style={s.infoItem}>
                                        <span style={s.infoIcon}>📧</span>
                                        <div>
                                            <p style={s.infoLabel}>Email</p>
                                            <p style={s.infoValue}>{profile.email}</p>
                                        </div>
                                    </div>
                                    <div style={s.infoItem}>
                                        <span style={s.infoIcon}>📅</span>
                                        <div>
                                            <p style={s.infoLabel}>Member Since</p>
                                            <p style={s.infoValue}>{new Date(profile.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                {profile.bio && (
                                <div style={s.bioSection}>
                                    <p style={s.bioLabel}>About Me</p>
                                    <p style={s.bioText}>{profile.bio}</p>
                                </div>
                                )}
                                {!profile.bio && (
                                <div style={s.emptyBio}>
                                    <p style={{color:'#9ca3af', fontSize:'14px'}}>No bio yet. Click Edit to add one!</p>
                                </div>
                                )}
                            </div>
                            )}
                        </div>
                    </div>
                </main>
                </div>
        </>
    )
}
    
const s = {
    page: { minHeight:'100vh', background:'#f3f4f6', marginTop: '56px' },
    loadingScreen: { minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', color:'#6b7280' },
    spinner: { width:'40px', height:'40px', border:'4px solid #e5e7eb', borderTop:'4px solid #667eea', borderRadius:'50%', animation:'spin 1s linear infinite' },
    header: { background:'linear-gradient(135deg,#667eea,#764ba2)', padding:'0', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' },
    headerInner: { maxWidth:'900px', margin:'0 auto', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' },
    headerLogo: { color:'#fff', fontWeight:'700', fontSize:'18px' },
    logoutBtn: { background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.4)', borderRadius:'8px', padding:'8px 16px', cursor:'pointer', fontWeight:'600', fontSize:'13px' },
    main: { maxWidth:'900px', margin:'32px auto', padding:'0 24px', position:'relative' },
    toast: { position:'fixed', top:'24px', right:'24px', background:'#059669', color:'#fff', padding:'12px 20px', borderRadius:'10px', fontWeight:'600', fontSize:'14px', zIndex:1000, boxShadow:'0 4px 12px rgba(0,0,0,0.2)' },
    profileCard: { background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', display:'grid', gridTemplateColumns:'340px 1fr' },
    pictureSection: { padding:'32px', background:'linear-gradient(180deg,#f8f7ff,#f0efff)', borderRight:'1px solid #e5e7eb', display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' },
    sectionTitle: { fontSize:'15px', fontWeight:'700', color:'#374151', margin:0, textTransform:'uppercase', letterSpacing:'0.5px' },
    infoSection: { padding:'32px' },
    infoHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' },
    name: { fontSize:'26px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 4px' },
    username: { color:'#667eea', fontWeight:'500', margin:0, fontSize:'15px' },
    editBtn: { background:'#f3f4f6', border:'none', borderRadius:'8px', padding:'8px 16px', cursor:'pointer', fontWeight:'600', fontSize:'13px', color:'#374151' },
    editForm: { display:'flex', flexDirection:'column', gap:'16px' },
    field: { display:'flex', flexDirection:'column', gap:'6px' },
    label: { fontWeight:'600', fontSize:'14px', color:'#374151' },
    input: { padding:'11px 14px', border:'2px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box' },
    textarea: { padding:'11px 14px', border:'2px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', resize:'vertical', fontFamily:'inherit', boxSizing:'border-box' },
    editActions: { display:'flex', gap:'10px' },
    cancelBtn: { flex:1, padding:'11px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer' },
    saveBtn: { flex:2, padding:'11px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer' },
    infoGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' },
    infoItem: { display:'flex', alignItems:'center', gap:'12px', background:'#f9fafb', padding:'14px', borderRadius:'10px' },
    infoIcon: { fontSize:'22px' },
    infoLabel: { margin:'0 0 2px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' },
    infoValue: { margin:0, fontSize:'14px', color:'#374151', fontWeight:'500' },
    bioSection: { background:'#f9fafb', padding:'16px', borderRadius:'10px' },
    bioLabel: { margin:'0 0 8px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' },
    bioText: { margin:0, color:'#374151', lineHeight:'1.6', fontSize:'14px' },
    emptyBio: { padding:'16px', borderRadius:'10px', border:'2px dashed #e5e7eb', textAlign:'center' },
};


export default ProfilePage