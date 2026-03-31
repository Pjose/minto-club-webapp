import { EnvelopeAt, EnvelopeFill, GeoAlt, Plus, Telephone } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import { useState } from "react";
import { toast } from "sonner";
import AddressesForm from "./AddressesForm";
import EmailsForm from "./EmailsForm";
import PhonesForm from "./PhonesForm";
import { defaultApplication } from "../../../model/defaultApplication";
import { defaultErrors } from "../../../model/defaultErrors";
import useConfirmation from "../../hooks/useConfirmation";
import ConfirmationModal from "../../misc/modals/ConfirmationModal";

const ContactsCard = (props) => {
    //const { formData } = props
    //const [addresses, setAddresses] = useState([{}]);
    const [addressActiveTab, setAddressActiveTab] = useState(0);
    const [emailActiveTab, setEmailActiveTab] = useState(0);
    const [phoneActiveTab, setPhoneActiveTab] = useState(0);
    const [formData, setFormData] = useState({ ...defaultApplication })
    const [formErrors, setFormErrors] = useState({ ...defaultErrors })
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()

    const deleteContact = async (contactType, index) => {
        const typeStr = contactType === 'addresses' ? 'address' 
            : contactType === 'emails' ? 'email' 
            : 'phone';
        const confirmation = await showConfirmation(`Are you sure you want to delete this ${typeStr} record?`)
        if(confirmation) {
            removeContact(contactType, index);
            if(contactType === 'addresses') {
                removeAddress(index);
            } else if(contactType === 'emails') {
                removeEmail(index);
            } else if(contactType === 'phones') {
                removePhone(index);
            }
            console.log(`${typeStr} record deleted!.`)
            toast.info("Delete successful!", {
                description: `${typeStr} record deleted.`,
            })
        } else {
            console.log(`Delete Aborted! Continue working on the ${typeStr} record.`)
            toast.info(`Delete -> Aborted!`, {
                description: `Continue working on the ${typeStr} record.`,
            })
        }
    }

    const removeAddress = (i) => {
        if (formData.person.contact.addresses.length === 1) return;
        const next = formData.person.contact.addresses.filter((_, idx) => idx !== i);
        setAddressActiveTab(Math.min(addressActiveTab, next.length - 1));
    };

    const removeEmail = (i) => {
        if (formData.person.contact.emails.length === 1) return;
        const next = formData.person.contact.emails.filter((_, idx) => idx !== i);
        setEmailActiveTab(Math.min(emailActiveTab, next.length - 1));
    };

    const removePhone = (i) => {
        if (formData.person.contact.phones.length === 1) return;
        const next = formData.person.contact.phones.filter((_, idx) => idx !== i);
        setPhoneActiveTab(Math.min(phoneActiveTab, next.length - 1));
    };

    //For testing purposes
    let testFormData = { ...defaultApplication }

    const addAddress = () => { 
        setAddresses((p) => [...p, {addressType: '', street: '', city: '', state: '', zipcode: '', country: ''}]); 
        setActiveTab(formData.person.contact.addresses.length); 
    };

    const addContact = (contactType) => {
        //if(validateStep(currentStep)) {
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
        /* } else {
            console.log('Invalid form! Please correct the errors and try again.')
            toast.error('Invalid form! Please correct the errors and try again.')
        } */
        if(contactType === 'addresses') {
            setAddressActiveTab(formData.person.contact.addresses.length);
        } else if(contactType === 'emails') {
            setEmailActiveTab(formData.person.contact.emails.length);
        } else if(contactType === 'phones') {
            setPhoneActiveTab(formData.person.contact.phones.length);
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

  return (
    <>
        <div className='card'>
            <div className="card-header bg-light">
                <div className="d-flex">
                    <EnvelopeFill size={28} className='me-2 text-primary' />
                    <span className="fs-5 text-primary" style={{ fontWeight: '700'}}>Contact Details</span>
                </div>
            </div>
            <div className="card-body px-1 px-sm-3">
                {/* ── Section bar: Addresses ── */}
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <GeoAlt size={22} className='mt-1 mx-1' />
                        <span className="fs-5" style={{ fontWeight: '600'}}>Addresses</span>
                    </div>
                    <button 
                        type="button" 
                        className="d-flex btn text-center" 
                        onClick={() => addContact('addresses')}
                        style={{ backgroundColor: 'black' }}
                        title={`Add Address`}
                    >
                        <Plus className="mb-1" color="white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Address</span>
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div style={S.tabsWrap}>
                    {formData.person.contact.addresses.map((_, i) => (
                        <div key={i} style={S.tab(addressActiveTab === i)}>
                            <button type="button" style={S.tabBtn(addressActiveTab === i)} onClick={() => setAddressActiveTab(i)}>
                                <span style={S.tabDot(addressActiveTab === i)} />
                                Address {i + 1}
                            </button>
                            {formData.person.contact.addresses.length > 0 && (
                                <button type="button" className="tab-x-hover" style={S.tabX} onClick={() => deleteContact('addresses', i)}>×</button>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Addresses Form area ── */}
                <div>
                    <AddressesForm 
                        key={addressActiveTab}
                        address={formData.person.contact.addresses[addressActiveTab]}
                        index={addressActiveTab}
                        updateContact={updateContact} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />
                </div>

                {/* ── Section bar: Emails ── */}
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <EnvelopeAt size={22} className='mt-1 mx-1' />
                        <span className="fs-5" style={{ fontWeight: '600'}}>Emails</span>
                    </div>
                    <button 
                        type="button" 
                        className="d-flex btn text-center" 
                        onClick={() => addContact('emails')}
                        style={{ backgroundColor: 'black' }}
                        title={`Add Email`}
                    >
                        <Plus className="mb-1" color="white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Email</span>
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div style={S.tabsWrap}>
                    {formData.person.contact.emails.map((_, i) => (
                        <div key={i} style={S.tab(emailActiveTab === i)}>
                            <button type="button" style={S.tabBtn(emailActiveTab === i)} onClick={() => setEmailActiveTab(i)}>
                                <span style={S.tabDot(emailActiveTab === i)} />
                                Email {i + 1}
                            </button>
                            {formData.person.contact.emails.length > 0 && (
                                <button type="button" className="tab-x-hover" style={S.tabX} onClick={() => deleteContact('emails', i)}>×</button>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* ── Emails Form area ── */}
                <div>
                    <EmailsForm
                        key={emailActiveTab}
                        email={formData.person.contact.emails[emailActiveTab]}
                        index={emailActiveTab}
                        updateContact={updateContact} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />
                </div>

                {/* ── Section bar: Phones ── */}
                <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                    <div className="d-flex items-center">
                        <Telephone size={22} className='mt-1 mx-1' />
                        <span className="fs-5" style={{ fontWeight: '600'}}>Phones</span>
                    </div>
                    <button 
                        type="button" 
                        className="d-flex btn text-center" 
                        onClick={() => addContact('phones')}
                        style={{ backgroundColor: 'black' }}
                        title={`Add Phone`}
                    >
                        <Plus className="mb-1" color="white" size={21} />
                        <span className='d-none d-sm-flex text-white'>Phone</span>
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div style={S.tabsWrap}>
                    {formData.person.contact.phones.map((_, i) => (
                        <div key={i} style={S.tab(phoneActiveTab === i)}>
                            <button type="button" style={S.tabBtn(phoneActiveTab === i)} onClick={() => setPhoneActiveTab(i)}>
                                <span style={S.tabDot(phoneActiveTab === i)} />
                                Phone {i + 1}
                            </button>
                            {formData.person.contact.phones.length > 0 && (
                                <button type="button" className="tab-x-hover" style={S.tabX} onClick={() => deleteContact('phones', i)}>×</button>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* ── Phones Form area ── */}
                <div>
                    <PhonesForm
                        key={phoneActiveTab}
                        phone={formData.person.contact.phones[phoneActiveTab]}
                        index={phoneActiveTab}
                        updateContact={updateContact} 
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />
                </div>

                <ConfirmationModal
                    show={show}
                    message={confirmMsg}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    </>
  )
}

ContactsCard.propTypes = {
    formData: PropTypes.object,
}

// ─── Design tokens (light palette) ───────────────────────────────────────────
const TOKEN = {
    sand:     "#faf8f5",
    white:    "#ffffff",
    stone:    "#f0ede8",
    border:   "#e2ddd6",
    borderHi: "#c8c0b4",
    ink:      "#1c1917",
    ink2:     "#57534e",
    ink3:     "#a8a29e",
    teal:     "#0d9488",
    tealSoft: "#f0fdfa",
    tealBord: "#99f6e4",
    tealGlow: "0 0 0 3px rgba(13,148,136,.14)",
    danger:   "#dc2626",
};

// ─── Inline style helpers (supplements Bootstrap) ────────────────────────────
const S = {
    tabsWrap: {
        display: "flex", gap: 4,
        padding: "0.75rem 1.75rem 0",
        overflowX: "auto",
        borderBottom: `1px solid ${TOKEN.border}`,
    },
    tab: (active) => ({
        display: "flex", alignItems: "center",
        border: `1px solid ${active ? TOKEN.border : "transparent"}`,
        borderBottom: active ? `1px solid ${TOKEN.white}` : "1px solid transparent",
        borderRadius: ".5rem .5rem 0 0",
        background: active ? TOKEN.white : "transparent",
        marginBottom: -1,
        transition: "all .15s ease",
    }),
    tabBtn: (active) => ({
        fontFamily: "'Mulish', sans-serif",
        fontSize: '.875rem', fontWeight: active ? 600 : 400,
        color: active ? TOKEN.ink : TOKEN.ink3,
        background: "none", border: "none",
        padding: ".5rem .75rem",
        cursor: "pointer", whiteSpace: "nowrap",
        display: "flex", alignItems: "center", gap: 6,
    }),
    tabDot: (active) => ({
        width: 6, height: 6, borderRadius: "50%",
        background: active ? TOKEN.teal : TOKEN.ink3,
        boxShadow: active ? `0 0 6px ${TOKEN.teal}` : "none",
        flexShrink: 0,
        transition: "all .15s ease",
    }),
    tabX: {
        background: "none", border: "none",
        color: TOKEN.ink3, fontSize: 15,
        padding: "4px 8px 4px 2px",
        cursor: "pointer", lineHeight: 1,
        transition: "color .15s ease",
    },
    formArea: {
        background: TOKEN.stone,
        padding: "24px 28px",
    },
}

export default ContactsCard