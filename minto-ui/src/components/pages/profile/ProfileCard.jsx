import PropTypes from 'prop-types'
import { CalendarCheck, CalendarPlus, EnvelopeAt, FolderSymlink, PersonBadge } from 'react-bootstrap-icons'
import ProfilePictureUpload from './ProfilePictureUpload'

const ProfileCard = (props) => {
    const { profileData } = props

    return (
        <>
            <div className='card mb-3'>
                <div className="card-header" style={{ background:'linear-gradient(135deg,#006400,#23bc56)' }}>
                    <div className="d-flex">
                        <h3 className='ms-1 text-white'>Profile</h3>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="form-group row">
                        <div className="col-lg-6 col-xl-4">
                            <div style={s.pictureSection}>
                                <h2 style={s.sectionTitle}>Profile Picture</h2>
                                <ProfilePictureUpload />
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-8">
                            <div className='row pt-4 pb-2 px-4'>
                                <div style={s.infoHeader}>
                                    <div>
                                        <h1 style={s.name}>{profileData.firstName} {profileData.lastName}</h1>
                                        <p style={s.username}>{profileData.email}</p>
                                    </div>
                                </div>
                                <h5 className="my-2"><strong>About</strong></h5>
                                <div className='col-xl-6'>
                                    <div style={s.infoItem}>
                                        <EnvelopeAt size={24} className="text-secondary" />
                                        <div>
                                            <p style={s.infoLabel}>Email</p>
                                            <p style={s.infoValue}>{profileData.email}</p>
                                        </div>
                                    </div>
                                    <div style={s.infoItem}>
                                        <PersonBadge size={24} className="text-secondary" />
                                        <div>
                                            <p style={s.infoLabel}>Role</p>
                                            <p style={s.infoValue}>{profileData.role}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div style={s.infoItem}>
                                        <CalendarCheck size={24} className="text-secondary" />
                                        <div>
                                            <p style={s.infoLabel}>Created At:</p>
                                            <p style={s.infoValue}>{profileData.createdAt}</p>
                                        </div>
                                    </div>
                                    <div style={s.infoItem}>
                                        <CalendarPlus size={24} className="text-secondary" />
                                        <div>
                                            <p style={s.infoLabel}>Updated At:</p>
                                            <p style={s.infoValue}>{profileData.updatedAt}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

ProfileCard.propTypes = {
    profileData: PropTypes.object,
}

const s = {
    pictureSection: { padding:'32px', background:'linear-gradient(180deg,#f8fff7,#f0ffef)', borderRight:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', borderRadius: '0px 0px 0px 5px', display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' },
    sectionTitle: { fontSize:'15px', fontWeight:'700', color:'#374151', margin:0, textTransform:'uppercase', letterSpacing:'0.5px' },
    infoHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' },
    name: { fontSize:'26px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 4px' },
    username: { color:'darkgreen', fontWeight:'500', margin:0, fontSize:'15px' },
    infoItem: { display:'flex', alignItems:'center', gap:'12px', background:'#f9fafb', padding:'12px', marginBottom: '4px', borderRadius:'10px' },
    infoIcon: { fontSize:'22px' },
    infoLabel: { margin:'0 0 2px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' },
    infoValue: { margin:0, fontSize:'14px', color:'#374151', fontWeight:'500' },
}

export default ProfileCard
