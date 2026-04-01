import PropTypes from 'prop-types';
import { validators } from '../../validate/validators';
import { GetCountries } from "react-country-state-city";
import { useEffect, useState } from 'react';

const PhoneForm = (props) => {
    const { phone, index, updateContact, formErrors, setFormErrors } = props;
    const [countriesList, setCountriesList] = useState([]);

    const fetchCountries = async () => {
        try {
            const countries = await GetCountries();
            setCountriesList(countries);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const handleValidate = (index, field, value) => {
        let errorValue = ''
        if(field === 'phoneType') {
            errorValue = validators.required(value)
        }
        if(field === 'countryCode') {
            errorValue = validators.countryCode(value)
        }
        if(field === 'number') {
            errorValue = validators.phone(value)
        }
        
        setFormErrors(prev => ({
            ...prev, 
            person: {
                ...prev.person,
                contact: {
                    ...prev.person.contact,
                    phones: prev.person.contact.phones.map((p, i) => 
                        i === index ? { ...p, [field]: errorValue } : p
                    )
                }
            }
        }))
    };

    return (
        <>
            { phone && (
                <div key={index} className="border rounded-lg p-1 p-sm-4 mb-4 bg-light">
                    <div className='mb-2'>
                        <span className="font-medium"><strong>Phone {index + 1}</strong></span>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-5 mb-3">
                            <div className="form-floating">
                                <select
                                    id={`phone-type-${index}`}
                                    value={phone.phoneType || ''}
                                    onBlur={(e) => handleValidate(index, 'phoneType', e.target.value)}
                                    onChange={(e) => updateContact('phones', index, 'phoneType', e.target.value)}
                                    className={`form-select ${formErrors.person.contact.phones[index].phoneType ? 'is-invalid' : ''}`}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label htmlFor={`phone-type-${index}`}>Type*</label>
                            </div>
                            { formErrors.person.contact.phones[index]?.phoneType && (
                                <div className="text-danger mt-1">{formErrors.person.contact.phones[index].phoneType}</div>
                            )}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-5 mb-3">
                            <div className="form-floating">
                                <select 
                                    id={`phone-country-code-${index}`}
                                    className={`form-select ${formErrors.person.contact.phones[index].countryCode ? 'is-invalid' : ''}`}
                                    name={`phone-country-code-${index}`}
                                    value={phone.countryCode || ''}
                                    onBlur={(e) => handleValidate(index, 'countryCode', e.target.value)}
                                    onChange={(e) => updateContact('phones', index, 'countryCode', e.target.value)}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    {countriesList.map((country) => (
                                        <option key={country.id} value={`${country.emoji} +${country.phone_code}`}>
                                            {country.emoji} +{country.phone_code}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor={`phone-country-code-${index}`}>Country Code*</label>
                            </div>
                            { formErrors.person.contact.phones[index]?.countryCode && (
                                <div className="text-danger mt-1">{formErrors.person.contact.phones[index].countryCode}</div>
                            )}
                        </div>
                        <div className="col-sm-7 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`phone-number-${index}`}
                                    type={"tel"}
                                    placeholder="Phone Number"
                                    value={phone.number || ''}
                                    onBlur={(e) => handleValidate(index, 'number', e.target.value)}
                                    onChange={(e) => updateContact('phones', index, 'number', e.target.value)}
                                    className={`form-control ${formErrors.person.contact.phones[index].number ? 'is-invalid' : ''}`}
                                    required
                                />
                                <label htmlFor={`phone-number-${index}`}>Phone Number*</label>
                            </div>
                            { formErrors.person.contact.phones[index]?.number && (
                                <div className="text-danger mt-1">{formErrors.person.contact.phones[index].number}</div>
                            )}
                        </div>
                    </div>
                </div>  
            )}
        </>
    )
}

PhoneForm.propTypes = {
    phone: PropTypes.object,
    index: PropTypes.number,
    updateContact: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default PhoneForm