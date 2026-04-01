import PropTypes from 'prop-types';
import { validators } from '../../validate/validators';

const EmailForm = (props) => {
    const { email, index, updateContact, formErrors, setFormErrors } = props;

    const handleValidate = (index, field, value) => {   
        let errorValue = ''
        if(field === 'emailType') {
            errorValue = validators.required(value)
        }
        if(field === 'address') {
            errorValue = validators.email(value)
        }

        setFormErrors(prev => ({
            ...prev, 
            person: {
                ...prev.person,
                contact: {
                    ...prev.person.contact,
                    emails: prev.person.contact.emails.map((e, i) => 
                        i === index ? { ...e, [field]: errorValue } : e
                    )
                }
            }
        }))
    }

    return (
        <>
            { email && (
                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                    <div className='mb-2'>
                        <span className="font-medium"><strong>Email {index + 1}</strong></span>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-5 mb-3">
                            <div className="form-floating">
                                <select
                                    id={`email-type-${index}`}
                                    value={email.emailType || ''}
                                    onBlur={(e) => handleValidate(index, 'emailType', e.target.value)}
                                    onChange={(e) => updateContact('emails', index, 'emailType', e.target.value)}
                                    className={`form-select ${formErrors.person.contact.emails[index].emailType ? 'is-invalid' : ''}`}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Work">Work</option>
                                    <option value="School">School</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label htmlFor={`email-type-${index}`}>Type*</label>
                            </div>
                            { formErrors.person.contact.emails[index]?.emailType && (
                                <div className="text-danger mt-1">{formErrors.person.contact.emails[index].emailType}</div>
                            )}
                        </div>
                        <div className="col-sm-7 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`email-address-${index}`}
                                    type={"email"}
                                    placeholder="Email Address"
                                    value={email.address || ''}
                                    onBlur={(e) => handleValidate(index, 'address', e.target.value)}
                                    onChange={(e) => updateContact('emails', index, 'address', e.target.value)}
                                    className={`form-control ${formErrors.person.contact.emails[index].address ? 'is-invalid' : ''}`}
                                    required
                                />
                                <label htmlFor={`email-address-${index}`}>Email Address*</label>
                            </div>
                            { formErrors.person.contact.emails[index]?.address && (
                                <div className="text-danger mt-1">{formErrors.person.contact.emails[index].address}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

EmailForm.propTypes = {
    email: PropTypes.object,
    index: PropTypes.number,
    updateContact: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default EmailForm