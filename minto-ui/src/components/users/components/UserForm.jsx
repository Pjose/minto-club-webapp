import PropTypes from 'prop-types'
import { Floppy, XCircleFill } from 'react-bootstrap-icons';
import ConfirmationModal from '../../misc/modals/ConfirmationModal';
import PasswordGenerator from '../../misc/PasswordGenerator';
import CustomSelect from '../../misc/CustomSelect';
import { useState } from 'react';
import PictureUpload from './PictureUpload';
import { validators } from '../../validate/validators';

const UserForm = (props) => {
    const { formData, setFormData, formErrors, setFormErrors, setImage, saving, cancel, onSubmit, show, confirmMsg, 
        handleConfirm, handleCancel } = props;
    const [preview, setPreview] = useState(null);
    const [imgError, setImgError] = useState('')

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleFileBlur = (e) => {
        let file = e.target.files[0];
        let err = validators.picture(file)
        setImgError(err)
        setFormErrors(prev => ({ ...prev, picture: err }));
    }

    const handleFileSelect = (e) => {
        let file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setImgError('Please select a valid image file.'); return; }
        if (file.size > 5 * 1024 * 1024) { setImgError('File size must be less than 5MB.'); return; }
        setImgError('');
        setFormErrors(prev => ({ ...prev, picture: '' }));
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handlePasswordChange = (newPassword) => {
        setFormData({ ...formData, password: newPassword });
    }

    const cancelForm = async () => {
        let success = await cancel()
        if(success) {
            setImage(null); 
            setImgError('');
            setPreview(null);
        }
    }

    return (
        <>
            <style>{` 
                .form-control::file-selector-button { 
                    background-color: #333;
                    color: #4af;
                    border: 1px solid #333;
                    padding: .375rem .75rem;
                    border-radius: .25rem;
                }  
                .form-control::file-selector-button::hover {
                    background-color: #777;
                    border: 1px solid #777;
                    color: #333;
                }
              `}
            </style>
            <form onSubmit={(e) => onSubmit(e)} action="">
                <fieldset disabled={saving}> {/* Disable form interactions when loading or saving */}
                    <div className="form-group row">
                        <div className="col-lg-6 col-xl-3">
                            <div style={s.pictureSection}>
                                <h2 style={s.sectionTitle}>Picture</h2>
                                <PictureUpload
                                    currentPicture={formData.picture}
                                    imgError={imgError}
                                    preview={preview}
                                    handleFileSelect={handleFileSelect}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center col-lg-6 col-xl-9">
                            <div className="border rounded-lg p-1 p-sm-3 mb-3 bg-light">
                                <div className="form-group row mt-3 mt-md-0">
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor={"firstName"} className="form-label">
                                            First Name
                                        </label>
                                        <input
                                            id={"firstName"}
                                            name="firstName"
                                            type={"text"}
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={(e) => onInputChange(e)}
                                            className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                                            required
                                        />
                                        { formErrors.firstName && <div className="text-danger mt-1">{formErrors.firstName}</div>}
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor={"lastName"} className="form-label">
                                            Last Name
                                        </label>
                                        <input
                                            id={"lastName"}
                                            name="lastName"
                                            type={"text"}
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={(e) => onInputChange(e)}
                                            className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                                            required
                                        />
                                        { formErrors.lastName && <div className="text-danger mt-1">{formErrors.lastName}</div>}
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor={"email"} className="form-label">
                                            Email
                                        </label>
                                        <input
                                            id={"email"}
                                            name="email"
                                            type={"email"}
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => onInputChange(e)}
                                            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                            required
                                        />
                                        { formErrors.email && <div className="text-danger mt-1">{formErrors.email}</div>}
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <PasswordGenerator
                                            className={`text-dark ${formErrors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            placeholder="Type or generate password"
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        { formErrors.password && <div className="text-danger mt-1">{formErrors.password}</div>}
                                    </div>
                                    <div className="col-xl-5">
                                        <label htmlFor="role" className="form-label">
                                            Role
                                        </label>
                                        <CustomSelect
                                            className={`mb-3 form-select ${formErrors.role ? 'is-invalid' : ''}`}
                                            name="role"
                                            value={formData.role}
                                            placeholder=" -- Select a role -- "
                                            onChange={(e) => onInputChange(e)}
                                            url="/auth/roles"
                                            required
                                        />
                                        { formErrors.role && <div className="text-danger mt-1">{formErrors.role}</div>}
                                    </div>
                                    <div className="col-xl-7 mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Picture
                                        </label>
                                        <input
                                            type={"file"}
                                            accept="image/*"
                                            className={`form-control ${imgError === '' ? '' : 'is-invalid'}`}
                                            name="picture"
                                            onBlur={handleFileBlur}
                                            onChange={handleFileSelect}
                                        />
                                        { imgError && <div className="text-danger mt-1">{imgError}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div className="text-center my-3">
                    <button type="reset" onClick={cancelForm} disabled={saving}
                        className="btn btn-outline-danger mx-3" title="Cancel New User">
                        <XCircleFill size={20} className="m-0 me-sm-2 mb-1" />
                        <span className="d-none d-sm-inline-block">Cancel</span>
                    </button>
                    <ConfirmationModal
                        show={show}
                        message={confirmMsg}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                    <button type="submit" disabled={saving}
                        className="btn btn-outline-success mx-2 px-3" title="Save New User" >
                        <Floppy size={20} className="m-0 me-sm-2 mb-1" />
                        <span className="d-none d-sm-inline-block">
                            { saving ? 'Saving...' : 'Save' }
                        </span>
                    </button>
                </div>
            </form>
        </>
    )
}

UserForm.propTypes = {
    formData: PropTypes.object, 
    setFormData: PropTypes.func, 
    formErrors: PropTypes.object, 
    setFormErrors: PropTypes.func,
    setImage: PropTypes.func,
    saving: PropTypes.bool,
    cancel: PropTypes.func,
    onSubmit: PropTypes.func,
    show: PropTypes.bool, 
    confirmMsg: PropTypes.string, 
    handleConfirm: PropTypes.func, 
    handleCancel: PropTypes.func,
}

export default UserForm

const s = {
    pictureSection: { padding:'32px', background:'linear-gradient(180deg,#d5f3ff,#d5f3df)', border:'1px solid #e5e7eb', borderRadius: '0px 0px 0px 0px', display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' },
    sectionTitle: { fontSize:'15px', fontWeight:'700', color:'#374151', margin:0, textTransform:'uppercase', letterSpacing:'0.5px' },
}