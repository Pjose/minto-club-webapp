import PropTypes from 'prop-types';
import useConfirmation from '../hooks/useConfirmation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import PersonForm from '../person/person-form/PersonForm';
import PersonalInfoForm from '../person/personal-info-form/PersonalInfoForm';
import FamilyInfo from '../person/FamilyInfo';
import RelativesInfo from '../person/RelativesInfo';
import ClubReferencesInfo from '../person/ClubReferencesInfo';
import BeneficiariesForm from '../person/BeneficiariesForm';
import ReviewAndSubmit from './review/ReviewAndSubmit';
import LoadingSpinner from '../loading/LoadingSpinner';
import ApplicationProgressBar from './components/ApplicationProgressBar';
import { ArrowLeftCircleFill, ArrowRightCircleFill, Floppy2, Heart, People, Person, PersonCheck,  PersonHearts, 
    SendCheck, XCircleFill } from 'react-bootstrap-icons';
import ConfirmationModal from '../misc/modals/ConfirmationModal';
import UserSearchUI from '../users/UserSearchUI';
import { defaultApplication } from '../../model/defaultApplication';
import { defaultErrors } from '../../model/defaultErrors';
import { toast } from 'sonner';
import { validators } from '../validate/validators';
import { areAllEmptyStrings } from '../validate/stringUtils';

const NewApplication = (props) => {
    const { title, headerBgColor, cardBorderColor, formData, setFormData } = props
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const navigate = useNavigate()
    const { isAuthenticated, getUser } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1)
    //const [formData, setFormData] = useState({ ...defaultApplication, applicationStatus: 'Draft' })
    const [formErrors, setFormErrors] = useState({ ...defaultErrors })
    const user = getUser()

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
        const confirmation = await showConfirmation("Are you sure you want to cancel this application?")
        if(confirmation) {
            setFormData({ ...defaultApplication })
            console.log("Application Cancelled! The form is reset.")
            toast.info("Application -> Cancelled!", {
                description: "The form has been reset.",
            })
            //navigate(-1)
        } else {
            console.log("Cancel Aborted! Continue working on the application.")
            toast.info("Cancel -> Aborted!", {
                description: "Continue working on the application.",
            })
        }
    }

    useEffect(() => {
        const loadApplications = async () => {
            //setLoading(true)
            try {
                if(user && formData.user.id) {
                    const params = {
                        userId: formData.user.id
                    }
                    const queryStr = new URLSearchParams(params).toString()
                    const response = await fetchWithAuth(`/applications/load?${queryStr}`, {
                        method: 'GET',
                        credentials: "include",
                    })
                    
                    if (!response.ok) {
                        console.log("[ApplicationsGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok')
                    }
    
                    const applicationsData = await response.json()
                    if(applicationsData.applicationNumber) {// Only set formData if a draft application exists
                        setFormData(applicationsData)
                        toast.success('Applications loaded successfully!')
                    } else {
                        console.log('No draft application found for the user.')
                        toast.error('No draft application found for the user.')
                    }
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        loadApplications()
        if(isSubmitted) {
            const timer = setTimeout(() => {
                navigate(-1) // Go back to the previous page after 3 seconds
            }, 3000)
            return () => clearTimeout(timer)
        }
        if(message) {
            const timerId = setTimeout(() => {
                setMessage('')
            }, 3000) // Clear message after 3 seconds
            return () => clearTimeout(timerId)
        }
    }, [isSubmitted, message, user, fetchWithAuth, navigate])

    const onSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage('Saving membership application...')
        console.log('Saving membership application => ')

        try {
            if(isAuthenticated) {
                if (validateStep(currentStep)) {
                    toast.success('Application form is valid!')
                    const response = await fetchWithAuth('/applications', {
                        method: 'POST',
                        credentials: "include",
                        headers: { 
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData), 
                    })

                    if(!response.ok) {
                        const respObj = await response.json()
                        console.log(`Error: ${respObj.message}`)
                        toast.error(respObj.message)
                        throw new Error(respObj.message)
                    }

                    const jsonData = await response.json();
                    console.log(jsonData)
                    setMessage('Membership application saved successfully!')
                    toast.success('Membership application saved successfully!')
                    //setFormErrors({ ...defaultErrors })
                } else {
                    console.log('Invalid form! Please correct the errors and try again.')
                    console.log(formErrors)
                    toast.error('Invalid form! Please correct the errors and try again.')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('Sending membership application...')
        
        try {
            if(isAuthenticated) {
                const response = await fetchWithAuth('/applications/draft/submit', {
                    method: 'POST',
                    credentials: "include",
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData), 
                })

                if(!response.ok) {
                    console.log(`HTTP error! status: ${response.status}`)
                    toast.error('HTTP error!')
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const jsonData = await response.json();
                console.log(jsonData)
                setIsSubmitted(true)
                setMessage('Membership application submitted successfully!')
                toast.success('Membership application submitted successfully!')
                setFormErrors({ ...defaultErrors })
            }
        } catch (error) {
            console.error('Error submitting application:', error)
            toast.error('Error submitting application: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

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

    const renderUserSearchUI = () => {
        return (
            <>
                <UserSearchUI />
            </>
        )
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0: return renderUserSearchUI()
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
            {
                isAuthenticated ? (
                    <>
                        { loading ? (
                            <LoadingSpinner caption={'Application...'} clsTextColor={"text-primary"} />
                        ) : (
                            <div className={`card my-3 border ${cardBorderColor} shadow-lg`}>
                                <div className={`card-header text-white position-sticky ${headerBgColor}`}  style={{ top: '56px', zIndex: 100 }}>
                                    <h5 className="card-title">{title}</h5>
                                    <span>App No.: {formData.applicationNumber}</span>
                                </div>
                                <div className='card-body px-1 px-sm-3'>
                                    {/* Progress Bar */}
                                    <ApplicationProgressBar steps={steps} currentStep={currentStep} />

                                    {/* Form Content */}
                                    <div className="p-6">
                                        <fieldset disabled={loading || saving}> {/* Disable form interactions when loading or saving */}
                                            {renderStep()}
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="text-center my-2">
                                        <button type="button" onClick={prevStep} className="btn btn-outline-primary mx-2 mx-xl-3" disabled={(currentStep === 1) || loading || saving} title='Previous Step'>
                                            <ArrowLeftCircleFill size={20} className="m-0 me-sm-1 mb-1" />
                                            <span className="d-none d-sm-inline-block">Prev</span>
                                        </button>
                                        <button type='button' onClick={cancel} className="btn btn-outline-danger mx-2 mx-xl-3" disabled={loading || saving} title='Cancel Membership Application'>
                                            <span className="d-none d-sm-inline-block">Cancel</span>
                                            <XCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                                        </button>
                                        <button type="submit" onClick={(e) => onSave(e)} className="btn btn-primary mx-2 mx-xl-3" disabled={loading || saving} title='Save Membership Application'>
                                            <span className="d-none d-sm-inline-block">
                                                { saving ? 'Saving...' : 'Save' }
                                            </span>
                                            <Floppy2 size={20} className="m-0 ms-sm-1 mb-1" />
                                        </button>
                                        <ConfirmationModal
                                            show={show}
                                            message={confirmMsg}
                                            onConfirm={handleConfirm}
                                            onCancel={handleCancel}
                                        />
                                        {currentStep < (steps.length) ? (
                                            <button type="button" onClick={nextStep} className="btn btn-outline-primary mx-2 mx-xl-3" disabled={loading || saving} title='Next Step'>
                                                <span className="d-none d-sm-inline-block">Next</span>
                                                <ArrowRightCircleFill size={20} className="m-0 ms-sm-1 mb-1" />
                                            </button>
                                        ) : (
                                            <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-success mx-2 mx-xl-3" disabled={loading || saving} title='Submit Membership Application'>
                                                <span className="d-none d-sm-inline-block">
                                                    { loading ? 'Sending...' : 'Submit' }
                                                </span>
                                                <SendCheck size={20} className="m-0 ms-sm-1 mb-1" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </>
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Loading...</h3>
                    </div>
                )
            }
            
        </>
    );
}

NewApplication.propTypes = {
    title: PropTypes.string,
    headerBgColor: PropTypes.string,
    cardBorderColor: PropTypes.string,
    formData: PropTypes.object,
    setFormData: PropTypes.func,
};

export default NewApplication

