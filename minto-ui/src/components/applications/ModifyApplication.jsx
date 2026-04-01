import { useEffect, useState } from 'react';
import { ArrowLeftCircleFill, ArrowRightCircleFill, EnvelopeAt, EnvelopeFill, GeoAlt, Heart, People, PeopleFill, Person, PersonArmsUp, PersonCheck, PersonCheckFill, PersonCircle, PersonFill, PersonHeart, PersonHearts, PersonLinesFill, Plus, Send, SendCheck, Telephone, Trash, XCircleFill } from 'react-bootstrap-icons';
import { ProgressBar } from 'react-bootstrap';
import countriesData from '../../assets/data/countries.json';
import PropTypes from 'prop-types'
import ConfirmationModal from '../misc/modals/ConfirmationModal';
import useConfirmation from '../hooks/useConfirmation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { defaultPerson } from '../../model/defaultPerson';
import ApplicationProgressBar from './components/ApplicationProgressBar';
import PersonForm from '../person/person-form/PersonForm';
import PersonalInfoForm from '../person/personal-info-form/PersonalInfoForm';
import FamilyInfo from '../person/FamilyInfo';
import RelativesInfo from '../person/RelativesInfo';
import ClubReferencesInfo from '../person/ClubReferencesInfo';
import BeneficiariesForm from '../person/BeneficiariesForm';
import ReviewAndSubmit from './review/ReviewAndSubmit';
import { defaultErrors } from '../../model/defaultErrors';
import { defaultParent } from '../../model/defaultParent';
import { personErrors } from '../../model/personErrors';
import { defaultSpouse } from '../../model/defaultSpouse';
import { defaultChild } from '../../model/defaultChild';
import { defaultSibling } from '../../model/defaultSibling';
import { defaultReferee } from '../../model/defaultReferee';
import { defaultRelative } from '../../model/defaultRelative';
import { defaultBeneficiary } from '../../model/defaultBeneficiary';
import { validators } from '../validate/validators';
import { areAllEmptyStrings } from '../validate/stringUtils';

const ModifyApplication = (props) => {
    const { formData, setFormData, loading, onSubmit, setSelectedApplication, isSubmitted } = props
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [currentStep, setCurrentStep] = useState(1);
    const [formErrors, setFormErrors] = useState({ ...defaultErrors })

    const steps = [
        { number: 1, title: "Applicant's Info", icon: Person },
        { number: 2, title: "Family Info", icon: Heart },
        { number: 3, title: "Relatives Info", icon: People },
        { number: 4, title: "Club References", icon: PersonCheck },
        { number: 5, title: "Beneficiaries Info", icon: PersonHearts },
        { number: 6, title: "Review & Submit", icon: SendCheck },
    ]

    const addPersonToArray = (arrayName) => {
        if (validateStep(currentStep)) {
            let newEntry, newErrors
            switch (arrayName) {
            case 'parents': 
                newEntry = { ...defaultParent } 
                newErrors = { ...personErrors.parent() }
                break
            case 'spouses': 
                newEntry = { ...defaultSpouse } 
                newErrors = { ...personErrors.spouse() }
                break
            case 'children': 
                newEntry = { ...defaultChild } 
                newErrors = { ...personErrors.child() }
                break
            case 'siblings': 
                newEntry = { ...defaultSibling } 
                newErrors = { ...personErrors.sibling() }
                break
            case 'referees': 
                newEntry =  { ...defaultReferee }
                newErrors = { ...personErrors.referee() }
                break
            case 'relatives': 
                newEntry = { ...defaultRelative }
                newErrors = { ...personErrors.relative() }
                break
            case 'beneficiaries': 
                newEntry = { ...defaultBeneficiary }
                newErrors = { ...personErrors.beneficiary() }
                break
            default: 
                newEntry = { ...defaultPerson }
                newErrors = { ...personErrors.person() }
            }
            
            setFormData(prev => ({
                ...prev,
                [arrayName]: [...prev[arrayName], newEntry]
            }))
            
            setFormErrors(prev =>({
                ...prev,
                [arrayName]: [...prev[arrayName], newErrors]
            }))
        } else {
            console.log('Invalid form! Please correct the errors and try again.')
            toast.error('Invalid form! Please correct the errors and try again.')
        }
    }

    const updatePersonInArray = (arrayName, index, field, value, subField = null) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === index) {
                    switch (arrayName) {
                        case 'parents':
                            if (field === 'parentType') {
                                return { ...entry, parentType: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'children':
                            if (field === 'childType') {
                                return { ...entry, childType: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'referees':
                            if (field === 'membershipNumber') {
                                return { ...entry, membershipNumber: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'siblings':
                            if (field === 'siblingType') {
                                return { ...entry, siblingType: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'spouses':
                            if (field === 'maritalStatus') {
                                return { ...entry, maritalStatus: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'relatives':
                            if (field === 'membershipNumber') {
                                return { ...entry, membershipNumber: value }
                            }
                            if (field === 'familyRelationship') {
                                return { ...entry, familyRelationship: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        case 'beneficiaries':
                            if (field === 'percentage') {
                                return { ...entry, percentage: value }
                            }
                            if (field === 'relationship') {
                                return { ...entry, relationship: value }
                            }
                            if (subField) {
                                return { ...entry, person: { ...entry.person, [field]: { ...entry.person[field], [subField]: value } } }
                            }
                            return { ...entry, person: { ...entry.person, [field]: value } }
                        
                        default:
                            return entry
                    }
                }
                return entry
            })
        }))
    }

    const updateContactForPerson = (arrayName, personIndex, contactType, contactIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === personIndex) {
                    let personObj;
                    switch (arrayName) {
                        case 'parents':
                        case 'spouses':
                        case 'children':
                        case 'siblings':
                        case 'referees':
                        case 'relatives':
                        case 'beneficiaries':
                            personObj = entry.person;
                        return {
                            ...entry,
                            person: {
                                ...personObj,
                                contact: {
                                    ...personObj.contact,
                                    [contactType]: personObj.contact[contactType].map((contact, j) =>
                                        j === contactIndex ? { ...contact, [field]: value } : contact
                                    )
                                }
                            }
                        }
                        
                        default:
                            return entry
                    }
                }
                return entry
            })
        }))
    }

    const addContactForPerson = (arrayName, personIndex, contactType) => {
        if(validateStep(currentStep)) {
            const newContact = contactType === 'addresses' 
            ? { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" }
            : contactType === 'emails'
            ? { emailType: "", address: "" }
            : { phoneType: "", countryCode: "", number: "" };

            setFormData(prev => ({
                ...prev,
                [arrayName]: prev[arrayName].map((entry, i) => {
                    if (i === personIndex) {
                        let personObj;
                        switch (arrayName) {
                            case 'parents':
                            case 'spouses':
                            case 'children':
                            case 'siblings':
                            case 'referees':
                            case 'relatives':
                            case 'beneficiaries':
                                personObj = entry.person
                                return {
                                    ...entry,
                                    person: {
                                        ...personObj,
                                        contact: {
                                            ...personObj.contact,
                                            [contactType]: [...personObj.contact[contactType], newContact]
                                        }
                                    }
                                }
                            
                            default:
                                return entry
                        }
                    }
                    return entry
                })
            }))

            setFormErrors(prev => ({
                ...prev,
                [arrayName]: prev[arrayName].map((entry, i) => {
                    if (i === personIndex) {
                        let personObj;
                        personObj = entry.person
                        return {
                            ...entry,
                            person: {
                                ...personObj,
                                contact: {
                                    ...personObj.contact,
                                    [contactType]: [...personObj.contact[contactType], newContact]
                                }
                            }
                        }
                    }
                })
            }))
        } else {
            console.log('Invalid form! Please correct the errors and try again.')
            toast.error('Invalid form! Please correct the errors and try again.')
        }
    }

    const removeContactForPerson = (arrayName, personIndex, contactType, contactIndex) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === personIndex) {
                    let personObj
                    switch (arrayName) {
                        case 'parents':
                        case 'spouses':
                        case 'children':
                        case 'siblings':
                        case 'referees':
                        case 'relatives':
                        case 'beneficiaries':
                            personObj = entry.person
                            return {
                                ...entry,
                                person: {
                                    ...personObj,
                                    contact: {
                                        ...personObj.contact,
                                        [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                                    }
                                }
                            }
                        
                        default:
                            return entry
                    }
                }
                return entry
            })
        }))

        setFormErrors(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((entry, i) => {
                if (i === personIndex) {
                    let personObj
                    personObj = entry.person
                    return {
                        ...entry,
                        person: {
                            ...personObj,
                            contact: {
                                ...personObj.contact,
                                [contactType]: personObj.contact[contactType].filter((_, j) => j !== contactIndex)
                            }
                        }
                    }
                }
            })
        }))
    }


    const removePersonFromArray = (arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));

        setFormErrors(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const addContact = (contactType) => {
        if(validateStep(currentStep)) {
            const newContact = contactType === 'addresses' 
            ? { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" }
            : contactType === 'emails'
            ? { emailType: "", address: "" }
            : { phoneType: "", countryCode: "", number: "" };

            setFormData(prev => ({
                ...prev,
                person: {
                    ...prev.person,
                    contact: {
                        ...prev.person.contact,
                        [contactType]: [...prev.person.contact[contactType], newContact]
                    }
                }
            }));

            setFormErrors(prev => ({
                ...prev,
                person: {
                    ...prev.person,
                    contact: {
                        ...prev.person.contact,
                        [contactType]: [...prev.person.contact[contactType], newContact]
                    }
                }
            }));
        } else {
            console.log('Invalid form! Please correct the errors and try again.')
            toast.error('Invalid form! Please correct the errors and try again.')
        }
    };

    const removeContact = (type, index) => {
        setFormData(prev => ({
            ...prev,
            person: {
                ...prev.person,
                contact: {
                    ...prev.person.contact,
                    [type]: prev.person.contact[type].filter((_, i) => i !== index)
                }
            }
        }));

        setFormErrors(prev => ({ 
            ...prev,
            person: { 
                ...prev.person,
                contact: { 
                    ...prev.person.contact,
                    [type]: prev.person.contact[type].filter((_, i) => i !== index)
                }
            }
        }));
    };

    const updateContact = (type, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            person: {
                ...prev.person,
                contact: {
                ...prev.person.contact,
                [type]: prev.person.contact[type].map((contact, i) => 
                    i === index ? { ...contact, [field]: value } : contact
                )
                }
            }
        }))

        setFormErrors(prev => ({ ...prev,
            person: { ...prev.person,
                contact: { ...prev.person.contact,
                    [type]: prev.person.contact[type].map((contact, i) => 
                        i === index ? { ...contact, [field]: "" } : contact
                    )
                }
            }
        }));
    }

    const updateMainPerson = (field, value) => {
        setFormData(prev => ({ ...prev,
            person: {
                ...prev.person, [field]: value
            }
        }))

        setFormErrors(prev => ({ ...prev, 
            person: {
                ...prev.person, [field]: ""
            }
        }))
    }

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFormErrors(prev => ({ ...prev, [field]: "" }));
    }

    const nextStep = () => {
        console.log('formErrors:', formErrors);
        if(validateStep(currentStep)) {
            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            console.log('Invalid form! Please correct the errors before proceeding to the next step.')
            toast.error('Invalid form! Please correct the errors.')
        }
    }

    const prevStep = () => {
        if(validateStep(currentStep)) {
            if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
            }
        } else {
            console.log('Invalid form! Please correct the errors before proceeding to the next step.')
            toast.error('Invalid form! Please correct the errors before proceeding to the next step.')
        }
    }

    const cancel = async () => {
        const confirmation = await showConfirmation('Are you sure you want to cancel updating the application?')
        if(confirmation) {
            //setFormData(DEFAULT_APPLICATION)
            console.log('Application Cancelled! The form is reset.')
            toast.info('Application -> Cancelled!', {
                description: 'The form has been reset.',
            })
            //navigate('/login')
            setSelectedApplication(null)
        } else {
            console.log('Cancel Aborted! Continue working on the application.')
            toast.info('Cancel -> Aborted!', {
                description: 'Continue working on the application.',
            })
        }
    }

    useEffect(() => {
        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000) 

            return () => clearTimeout(timerId)
        }
    }, [message])

    const validatePerson = (obj) => {
        let person = { 
            firstName: '', middleName: '', lastName: '', dob: '', lifeStatus: '', 
            contact: {
                addresses: [],
                emails: [],
                phones: []
            } 
        }
        person.firstName = validators.name(obj.person.firstName);
        person.middleName = validators.optionalString(2)(obj.person.middleName)
        person.lastName = validators.name(obj.person.lastName)
        person.dob = validators.required(obj.person.dob) || validators.dob(obj.person.dob)
        person.lifeStatus = validators.required(obj.person.lifeStatus)

        // Reset Addresses Errors
        person.contact.addresses = [];
        // Addresses validation
        obj.person.contact.addresses.forEach((address, index) => {
            let addressErrors = { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" };
            addressErrors.addressType = validators.required(address.addressType);
            addressErrors.street = validators.street(address.street);
            addressErrors.city = validators.required(address.city);
            addressErrors.state = validators.optionalString(2)(address.state);
            addressErrors.zipcode = validators.optionalString(3)(address.zipcode);
            addressErrors.country = validators.required(address.country);
            person.contact.addresses[index] = addressErrors;
        });

        // Reset Emails Errors
        person.contact.emails = [];
        // Emails validation
        obj.person.contact.emails.forEach((email, index) => {
            let emailErrors = { emailType: '', address: ''};
            emailErrors.emailType = validators.required(email.emailType);
            emailErrors.address = validators.email(email.address);
            person.contact.emails[index] = emailErrors;
        });

        // Reset Phones Errors
        person.contact.phones = [];
        // Phones validation
        obj.person.contact.phones.forEach((phone, index) => {
            let phoneErrors = { phoneType: '', countryCode: '', number: '' }
            phoneErrors.phoneType = validators.required(phone.phoneType);
            phoneErrors.countryCode = validators.countryCode(phone.countryCode);
            phoneErrors.number = validators.phone(phone.number);
            person.contact.phones[index] = phoneErrors;
        })

        return person
    }

    const validateStep = (s = currentStep) => {
        const e = { ...defaultErrors }
        
        if (s === 1) { // Step 1: Personal Info
            e.applicationStatus = validators.required(formData.applicationStatus)
            e.person.firstName = validators.name(formData.person.firstName);
            e.person.middleName = validators.optionalString(2)(formData.person.middleName)
            e.person.lastName = validators.name(formData.person.lastName)
            e.person.dob = validators.required(formData.person.dob) || validators.dob(formData.person.dob)
            e.person.lifeStatus = validators.required(formData.person.lifeStatus)
            e.maritalStatus = validators.required(formData.maritalStatus)

            // Reset Addresses Errors
            e.person.contact.addresses = [];
            // Addresses validation
            formData.person.contact.addresses.forEach((address, index) => {
                let addressErrors = { addressType: "", street: "", city: "", state: "", zipcode: "", country: "" };
                addressErrors.addressType = validators.required(address.addressType);
                addressErrors.street = validators.street(address.street);
                addressErrors.city = validators.required(address.city);
                addressErrors.state = validators.optionalString(2)(address.state);
                addressErrors.zipcode = validators.optionalString(3)(address.zipcode);
                addressErrors.country = validators.required(address.country);
                e.person.contact.addresses[index] = addressErrors;
            });

            // Reset Emails Errors
            e.person.contact.emails = [];
            // Emails validation
            formData.person.contact.emails.forEach((email, index) => {
                let emailErrors = { emailType: '', address: ''};
                emailErrors.emailType = validators.required(email.emailType);
                emailErrors.address = validators.email(email.address);
                e.person.contact.emails[index] = emailErrors;
            });

            // Reset Phones Errors
            e.person.contact.phones = [];
            // Phones validation
            formData.person.contact.phones.forEach((phone, index) => {
                let phoneErrors = { phoneType: '', countryCode: '', number: '' }
                phoneErrors.phoneType = validators.required(phone.phoneType);
                phoneErrors.countryCode = validators.countryCode(phone.countryCode);
                phoneErrors.number = validators.phone(phone.number);
                e.person.contact.phones[index] = phoneErrors;
            })
        }
        
        if (s === 2) { // Step 2: Family Info
            e.spouses = []
            formData.spouses.forEach((spouse, index) => {
                let personErrors = validatePerson(spouse);
                let spouseErrors = { maritalStatus: '', person: {} };
                spouseErrors.maritalStatus = validators.required(spouse.maritalStatus);
                spouseErrors.person = personErrors
                e.spouses[index] = spouseErrors;
            })

            e.children = []
            formData.children.forEach((child, index) => {
                let personErrors = validatePerson(child);
                let childErrors = { childType: '', person: {} };
                childErrors.childType = validators.required(child.childType);
                childErrors.person = personErrors;
                e.children[index] = childErrors;
            })
        }
        
        if (s === 3) { // Step 3: Relatives Info
            e.parents = []
            formData.parents.forEach((parent, index) => {
                let personErrors = validatePerson(parent);
                let parentErrors = { parentType: '', person: {} };
                parentErrors.parentType = validators.required(parent.parentType);
                parentErrors.person = personErrors;
                e.parents[index] = parentErrors;
            })

            e.siblings = []
            formData.siblings.forEach((sibling, index) => {
                let personErrors = validatePerson(sibling);
                let siblingErrors = { siblingType: '', person: {} };
                siblingErrors.siblingType = validators.required(sibling.siblingType);
                siblingErrors.person = personErrors;
                e.siblings[index] = siblingErrors;
            })
        }

        if (s === 4) { // Step 5: Club References Info
            e.referees = []
            formData.referees.forEach((referee, index) => {
                let personErrors = validatePerson(referee);
                let refereeErrors = { membershipNumber: '', person: {} };
                refereeErrors.membershipNumber = validators.membershipNumber(referee.membershipNumber);
                refereeErrors.person = personErrors;
                e.referees[index] = refereeErrors;
            })
            
            e.relatives = []
            formData.relatives.forEach((relative, index) => {
                let personErrors = validatePerson(relative);
                let relativeErrors = { membershipNumber: '', familyRelationship: '', person: {} };
                relativeErrors.familyRelationship = validators.required(relative.familyRelationship);
                relativeErrors.membershipNumber = validators.membershipNumber(relative.membershipNumber);
                relativeErrors.person = personErrors;
                e.relatives[index] = relativeErrors;
            })
        }

        if (s === 5) { // Step 5: Beneficiaries Info
            e.beneficiaries = []
            formData.beneficiaries.forEach((beneficiary, index) => {
                let personErrors = validatePerson(beneficiary);
                let beneficiaryErrors = { percentage: '', relationship: '', person: {} };
                beneficiaryErrors.relationship = validators.name(beneficiary.relationship);
                beneficiaryErrors.percentage = validators.percentage(beneficiary.percentage);
                beneficiaryErrors.person = personErrors;
                e.beneficiaries[index] = beneficiaryErrors;
            })
        }
        
        //console.log(e)
        setFormErrors(e);
        return areAllEmptyStrings(e);
    }

    const renderPersonForm = (entry, arrayName, index, title, formErrors) => {
        return (
            <PersonForm
                key={index}
                entry={entry}
                arrayName={arrayName}
                index={index}
                title={title}
                removePersonFromArray={removePersonFromArray}
                updatePersonInArray={updatePersonInArray}
                addContactForPerson={addContactForPerson}
                updateContactForPerson={updateContactForPerson}
                removeContactForPerson={removeContactForPerson}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            />
        )
    }

    // Personal Information
    const renderPersonalInfo = () => {
        return (
            <PersonalInfoForm
                formData={formData}
                updateFormData={updateFormData}
                updateMainPerson={updateMainPerson}
                addContact={addContact}
                removeContact={removeContact}
                updateContact={updateContact}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            />
        )
    }

    // Family Info
    const renderFamilyInfo = () => {
        return (
            <FamilyInfo
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                />
        )
    }

    // Relatives Info
    const renderRelativesInfo = () => {
        return (
            <RelativesInfo
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
                formErrors={formErrors}
                />
        )
    }

    // Club References Info
    const renderClubReferencesInfo = () => {
        return (
            <ClubReferencesInfo
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
                formErrors={formErrors}
                />
        )
    }

    // Beneficiaries
    const renderBeneficiaries = () => {
        return (
            <BeneficiariesForm
                formData={formData}
                addPersonToArray={addPersonToArray}
                renderPersonForm={renderPersonForm}
                formErrors={formErrors}
            />
        )
    }

    // Review & Submit
    const renderReviewAndSubmit = () => {
        return (
            <>
                <ReviewAndSubmit
                    formData={formData} 
                    message={message} 
                />
            </>
        )
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1: return renderPersonalInfo()
            case 2: return renderFamilyInfo()
            case 3: return renderRelativesInfo()
            case 4: return renderClubReferencesInfo()
            case 5: return renderBeneficiaries()
            case 6: return renderReviewAndSubmit()
            default:
                return null;
        }
    };


    if (isSubmitted) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <h2>Application Submitted Successfully!</h2>
                <p>You will be redirected to the previous page shortly...</p>
                {/* Optional: Add a manual "Go Back" button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn btn-primary mt-3"
                >
                    Go Back Now
                </button>
            </div>
        );
    }

  return (
    <>
        <div className='card my-3 border border-primary shadow-lg'>
            <div className='card-header text-white position-sticky bg-primary'  style={{ top: '56px', zIndex: 100 }}>
                <h5 className="card-title">Edit Application</h5>
                <span>App No.: {formData.applicationNumber}</span>
            </div>
            <div className='card-body px-1 px-sm-3'>
                {/* Progress Bar */}
                <ApplicationProgressBar steps={steps} currentStep={currentStep} />

                {/* Form Content */}
                <div className="p-6">
                    {renderStep()}
                </div>
            </div>
        </div>
        <div className="card-footer">
            <div className="text-center my-2">
                <button type="button" onClick={prevStep} className="btn btn-outline-primary mx-3" disabled={(currentStep === 0) || loading} title='Previuos Step'>
                    <ArrowLeftCircleFill size={20} className="m-0 me-sm-1 mb-1" />
                    <span className="d-none d-sm-inline-block">Prev</span>
                </button>
                <button type='button' onClick={cancel} className="btn btn-outline-danger mx-3" disabled={loading} title='Cancel Membership Application'>
                    <span className="d-none d-sm-inline-block">Cancel</span>
                    <XCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                </button>
                <ConfirmationModal
                    show={show}
                    message={confirmMsg}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
                {currentStep < (steps.length) ? (
                    <button type="button" onClick={nextStep} className="btn btn-outline-primary mx-3" disabled={loading} title='Next Step'>
                        <span className="d-none d-sm-inline-block">Next</span>
                        <ArrowRightCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                    </button>
                ) : (
                    <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-success mx-3" disabled={loading} title='Update Application'>
                        <span className="d-none d-sm-inline-block">
                            { loading ? 'Updating...' : 'Update' }
                        </span>
                        <SendCheck size={20} className="m-0 ms-sm-1 mb-1" />
                    </button>
                )}
            </div>
        </div>
    </>
  );
};

ModifyApplication.propTypes = {
    formData: PropTypes.object,
    setFormData: PropTypes.func,
    loading: PropTypes.bool, 
    onSubmit: PropTypes.func,
    setSelectedApplication: PropTypes.func,
    isSubmitted: PropTypes.bool,
}

export default ModifyApplication
