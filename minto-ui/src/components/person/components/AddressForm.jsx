import PropTypes from 'prop-types';
import { validators } from '../../validate/validators';
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useEffect, useState } from 'react';

const AddressForm = (props) => {
    const { address, index, updateContact, formErrors, setFormErrors } = props;
    const [countriesList, setCountriesList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [country, setCountry] = useState(address ? address.country : null);
    const [currentState, setCurrentState] = useState(address ? address.state : null);
    const [city, setCity] = useState(address ? address.city : null);

    const fetchCountries = async () => { 
        try {
            const countries = await GetCountries();
            setCountriesList(countries);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchStates = async (countryId) => {
        try {
            const states = await GetState(countryId);
            setStateList(states);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const fetchCities = async (countryId, stateId) => {
        try {
            const cities = await GetCity(countryId, stateId);
            setCitiesList(cities);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };


    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (country && countriesList.length > 0) {
            let selectedCountry = findCountryByName(countriesList, country);
            fetchStates(parseInt(selectedCountry.id));
        }
    }, [country, countriesList]);
    
    useEffect(() => {
        if (country && currentState && countriesList.length > 0 && stateList.length > 0) {
            let selectedCountry = findCountryByName(countriesList, country);
            let selectedState = stateList.find(state => state.name === currentState);

            fetchCities(parseInt(selectedCountry.id), parseInt(selectedState.id));
        }
        //console.log('Selected State: ', currentState)
        //console.log('Cities List: ', citiesList)
    }, [country, countriesList, stateList, currentState]); 

    /*
    useEffect(() => {
        console.log('address: ', address)
        if(address) {
            let e = { addressType: '', street: '', country: '', state: '', city: '', zipcode: '' };
            e.addressType = validators.required(address.addressType);
            e.street = validators.street(address.street);
            e.city = validators.name(address.city);
            e.state = validators.optionalString(2)(address.state);
            e.zipcode = validators.optionalString(3)(address.zipcode);
            e.country = validators.required(address.country);
            formErrors.person.contact.addresses[index] = e;
        }
    }, [address, index])
    */

    const findCountryByName = (list, targetName) => {
        const lowerCaseTargetName = targetName.toLowerCase();
        return list.find(country => country.name.toLowerCase() === lowerCaseTargetName);
    }

    const handleValidate = (index, field, value) => {
        console.log('value: ', value)
        let errorValue = ''
        if (field === 'addressType') { errorValue = validators.required(value) }
        if (field === 'street') { errorValue = validators.street(value) }
        if (field === 'city') { errorValue = validators.required(value) }
        if (field === 'state') { errorValue = validators.optionalString(2)(value) }
        if (field === 'zipcode') { errorValue = validators.optionalString(3)(value) }
        if (field === 'country') { errorValue = validators.required(value) }

        setFormErrors(prev => ({
            ...prev, 
            person: {
                ...prev.person, 
                contact: { 
                    ...prev.person.contact,
                    addresses: prev.person.contact.addresses.map((contact, i) =>
                        i === index ? { ...contact, [field]: errorValue } : contact
                    )
                }
            }
        }))
    }

    const handleCountryChange = (c) => {
        let countryName = c.target.value;
        updateContact('addresses', index, 'country', countryName);
        updateContact('addresses', index, 'state', "");
        updateContact('addresses', index, 'city', "");
        setCountry(countryName);
        setCurrentState(null);
        setCity(null);
    }

    const handleStateChange = (s) => {
        let stateName = s.target.value;
        updateContact('addresses', index, 'state', stateName);
        updateContact('addresses', index, 'city', "");
        setCurrentState(stateName);
        setCity(null);
    }

    const handleCityChange = (c) => {
        let cityName = c.target.value;
        updateContact('addresses', index, 'city', cityName);
        setCity(cityName);
    }

    return (
        <>
            { address && (
                <div key={index} className="border rounded-bottom-3 p-1 p-sm-3 mb-4 bg-light">
                    <div className='mb-2'>
                        <span className="font-medium text-primary"><strong>Address {index + 1}</strong></span>
                    </div>
                    <div className="form-group row mt-3">
                        <div className="col-sm-5 mb-3">
                            <div className="form-floating">
                                <select
                                    id={`address-type-${index}`}
                                    value={address.addressType || ''}
                                    onBlur={(e) => handleValidate(index, 'addressType', e.target.value)}
                                    onChange={(e) => updateContact('addresses', index, 'addressType', e.target.value)}
                                    className={`form-select ${formErrors.person.contact.addresses[index]?.addressType ? 'is-invalid' : ''}`}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="School">School</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Shipping">Shipping</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label htmlFor={`address-type-${index}`}>Type*</label>
                            </div>
                            { formErrors.person.contact.addresses[index]?.addressType && (
                                <div className="text-danger mt-1">{formErrors.person.contact.addresses[index]?.addressType}</div>
                            )}
                        </div>
                        <div className="col-sm-7 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`address-street-${index}`}
                                    type={"text"}
                                    placeholder="Street Address"
                                    value={address.street || ''}
                                    onBlur={(e) => handleValidate(index, 'street', e.target.value)}
                                    onChange={(e) => updateContact('addresses', index, 'street', e.target.value)}
                                    className={`form-control ${formErrors.person.contact.addresses[index]?.street ? 'is-invalid' : ''}`}
                                    required
                                />
                                <label htmlFor={`address-street-${index}`}>Street Address*</label>
                            </div>
                            { formErrors.person.contact.addresses[index]?.street && (
                                <div className="text-danger mt-1">{formErrors.person.contact.addresses[index]?.street}</div>
                            )}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <select 
                                    id={`country-${index}`}
                                    name={`country-${index}`}
                                    className={`form-select ${formErrors.person.contact.addresses[index]?.country ? 'is-invalid' : ''}`}
                                    value={address.country || ''}
                                    onBlur={(e) => handleValidate(index, 'country', e.target.value)}
                                    onChange={handleCountryChange}
                                    required
                                >
                                    <option key={'nil'} value="">-- Select --</option>
                                    {countriesList.map((country) => (
                                        <option key={country.id} value={country.name}>
                                            {country.emoji} {country.name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor={`country-${index}`}>Country*</label>
                            </div>
                            { formErrors.person.contact.addresses[index]?.country && (
                                <div className="text-danger mt-1">{formErrors.person.contact.addresses[index]?.country}</div>
                            )}
                        </div>
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <select 
                                    id={`state-${index}`}
                                    name={`state-${index}`}
                                    className={`form-select ${formErrors.person.contact.addresses[index]?.state ? 'is-invalid' : ''}`}
                                    value={address.state || ''}
                                    onBlur={(e) => handleValidate(index, 'state', e.target.value)}
                                    onChange={handleStateChange}
                                    disabled={!country}
                                >
                                    <option key={'nil'} value="">-- {country ? 'Select state / province' : 'Choose country first'} --</option>
                                    {stateList.map((curState) => (
                                        <option key={curState.id} value={curState.name}>
                                            {curState.name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor={`state-${index}`}>State / Province</label>
                            </div>
                            { formErrors.person.contact.addresses[index]?.state && (
                                <div className="text-danger mt-1">{formErrors.person.contact.addresses[index]?.state}</div>
                            )}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <select 
                                    id={`city-${index}`}
                                    name={`city-${index}`}
                                    className={`form-select ${formErrors.person.contact.addresses[index]?.city ? 'is-invalid' : ''}`}
                                    value={address.city || ''}
                                    onBlur={(e) => handleValidate(index, 'city', e.target.value)}
                                    onChange={handleCityChange}
                                    disabled={!currentState}
                                    required
                                >
                                    <option key={'nil'} value="">-- {currentState ? 'Select city' : 'Choose state first'} --</option>
                                    {citiesList.map((curCity) => (
                                        <option key={curCity.id} value={curCity.name}>
                                            {curCity.name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor={`city-${index}`}>City*</label>
                            </div>
                            { formErrors.person.contact.addresses[index]?.city && (
                                <div className="text-danger mt-1">{formErrors.person.contact.addresses[index]?.city}</div>
                            )}
                        </div>
                        <div className="col-sm-6 mb-3">
                            <div className="form-floating">
                                <input
                                    id={`address-zipcode-${index}`}
                                    type={"text"}
                                    placeholder="ZIP Code"
                                    value={address.zipcode || ''}
                                    onBlur={(e) => handleValidate(index, 'zipcode', e.target.value)}
                                    onChange={(e) => updateContact('addresses', index, 'zipcode', e.target.value)}
                                    className={`form-control ${formErrors.person.contact.addresses[index]?.zipcode ? 'is-invalid' : ''}`}
                                />
                                <label htmlFor={`address-zipcode-${index}`}>ZIP Code / Postal</label>
                            </div>
                            { formErrors.person.contact.addresses[index]?.zipcode && (
                                <div className="text-danger mt-1">{formErrors.person.contact.addresses[index]?.zipcode}</div>
                            )}
                        </div>
                    </div>
                </div>
            )} 
        </>
    )
}

AddressForm.propTypes = {
    address: PropTypes.object,
    index: PropTypes.number,
    updateContact: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

export default AddressForm