const BASE_URL = import.meta.env.VITE_BASE_URL;

const PictureView = (props) => {
    const { currentPicture } = props

    const displayPicture = currentPicture ? `${BASE_URL}${currentPicture}` : '';

    return (
        <>
            {/* Avatar Display */}
            <div style={s.avatarSection}>
                <div style={s.avatarContainer}>
                    {displayPicture ? (
                        <img src={displayPicture} alt="Profile" style={s.avatar} />
                    ) : (
                        <div style={s.avatarPlaceholder}>
                            <span style={s.avatarIcon}>👤</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PictureView

const s = {
    avatarSection: { position:'relative' },
    avatarContainer: { position:'relative', width:'150px', height:'150px' },
    avatar: { width:'150px', height:'150px', borderRadius:'50%', objectFit:'cover', border:'4px solid #122334', boxShadow:'0 4px 20px rgba(102,126,234,0.3)' },
    avatarPlaceholder: { width:'150px', height:'150px', borderRadius:'50%', background:'linear-gradient(135deg,#e8e8f0,#d0d0e0)', display:'flex', alignItems:'center', justifyContent:'center', border:'4px solid #e5e7eb' },
    avatarIcon: { fontSize:'64px' },
}