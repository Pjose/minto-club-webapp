import { useState, useRef } from 'react';
import PropTypes from 'prop-types'

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PictureUpload = (props) => {
    const { currentPicture, imgError, preview, handleFileSelect } = props;
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    const currentProfilePic = currentPicture ? `${BASE_URL}${currentPicture}` : '';
    const displayPicture = preview || currentProfilePic;

    return (
        <div style={s.wrapper}>
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
                    {preview && <div style={s.previewBadge}>Preview</div>}
                </div>
            </div>

            {/* Upload Area */}
            <div
                style={{ ...s.dropZone, ...(dragOver ? s.dropZoneActive : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect(e)}
                />
                <div style={s.dropIcon}>📷</div>
                <p style={s.dropText}>{dragOver ? 'Drop it!' : 'Click or drag & drop'}</p>
                <p style={s.dropHint}>JPG, PNG, GIF, WebP · Max 5MB</p>
            </div>

            {imgError && <div style={s.error}>{imgError}</div>}
        </div>
    );
}

PictureUpload.propTypes = {
    currentPicture: PropTypes.any,
    imgError: PropTypes.string,
    preview: PropTypes.any,
    handleFileSelect: PropTypes.func,
}

export default PictureUpload

const s = {
    wrapper: { display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' },
    avatarSection: { position:'relative' },
    avatarContainer: { position:'relative', width:'150px', height:'150px' },
    avatar: { width:'150px', height:'150px', borderRadius:'50%', objectFit:'cover', border:'4px solid #122334', boxShadow:'0 4px 20px rgba(102,126,234,0.3)' },
    avatarPlaceholder: { width:'150px', height:'150px', borderRadius:'50%', background:'linear-gradient(135deg,#e8e8f0,#d0d0e0)', display:'flex', alignItems:'center', justifyContent:'center', border:'4px solid #e5e7eb' },
    avatarIcon: { fontSize:'64px' },
    previewBadge: { position:'absolute', bottom:'4px', right:'4px', background:'#122334', color:'#fff', fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'20px' },
    dropZone: { width:'100%', border:'2px dashed #d1d5db', borderRadius:'12px', padding:'24px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', background:'#fafafa' },
    dropZoneActive: { borderColor:'#122334', background:'#f0f0ff' },
    dropIcon: { fontSize:'32px', marginBottom:'8px' },
    dropText: { fontWeight:'600', color:'#374151', margin:'0 0 4px', fontSize:'15px' },
    dropHint: { color:'#9ca3af', fontSize:'12px', margin:0 },
    error: { background:'#fee2e2', color:'#dc2626', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', width:'100%', boxSizing:'border-box' },
};