import PropTypes from 'prop-types'
import { CalendarCheck, CalendarPlus, EnvelopeAt, FolderSymlink, PersonBadge } from 'react-bootstrap-icons'
import ProfilePictureUpload from './ProfilePictureUpload'

const ProfileCard = (props) => {
    const { profileData } = props

    return (
        <>
            <div className='card mb-3'>
                <div className="card-header" style={{ background: 'darkgreen'}}>
                    <div className="d-flex">
                        <h3 className='ms-1 text-white'>Profile</h3>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="form-group row">
                        <div className="col-lg-6 col-xl-4">
                            <div style={{ padding:'32px', background:'linear-gradient(180deg,#f8fff7,#f0ffef)', borderRight:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' }}>
                                <h2 
                                    style={{ fontSize:'15px', fontWeight:'700', color:'#374151', margin:0, textTransform:'uppercase', letterSpacing:'0.5px' }}
                                >
                                    Profile Picture
                                </h2>
                                <ProfilePictureUpload />
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-8">
                            <div className='row' style={{ padding:'32px' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
                                    <div>
                                        <h1 style={{ fontSize:'26px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 4px' }}>{profileData.firstName} {profileData.lastName}</h1>
                                        <p style={{ color:'darkgreen', fontWeight:'500', margin:0, fontSize:'16px' }}>{profileData.email}</p>
                                    </div>
                                </div>
                                <div className='col-xl-6'>
                                    <h5 className="my-2"><strong>About</strong></h5>
                                    <div className="d-flex mb-3" style={{ alignItems: 'center', gap: '12px'}}>
                                        <EnvelopeAt size={24} className="text-secondary" />
                                        <div>
                                            <p style={{ margin:'0 0 2px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' }}>
                                                Email
                                            </p>
                                            <p style={{ margin:0, fontSize:'14px', color:'#374151', fontWeight:'500' }}>
                                                {profileData.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-3" style={{ alignItems: 'center', gap: '12px'}}>
                                        <PersonBadge size={24} className="text-secondary" />
                                        <div>
                                            <p style={{ margin:'0 0 2px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' }}>
                                                Role
                                            </p>
                                            <p style={{ margin:0, fontSize:'14px', color:'#374151', fontWeight:'500' }}>
                                                {profileData.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="mb-3">
                                        <FolderSymlink className="text-secondary" />
                                        <span className="text-secondary mx-2">Registration Source:</span>
                                        <span className="h6">{profileData.source}</span>
                                    </div>
                                    <div className="mb-3">
                                        <CalendarCheck className="text-secondary" />
                                        <span className="text-secondary mx-2">Created At:</span>
                                        <span className="h6">{profileData.createdAt}</span>
                                    </div>
                                    <div className="mb-3">
                                        <CalendarPlus className="text-secondary" />
                                        <span className="text-secondary mx-2">Updated At:</span>
                                        <span className="h6">{profileData.updatedAt}</span>
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

export default ProfileCard
