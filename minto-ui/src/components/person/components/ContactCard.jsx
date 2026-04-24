import { EnvelopeAt, EnvelopeFill, GeoAlt, Plus, Telephone } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import { useState } from "react";
import { toast } from "sonner";
import AddressForm from "./AddressForm";
import EmailsForm from "./EmailForm";
import PhonesForm from "./PhoneForm";
import { defaultApplication } from "../../../model/defaultApplication";
import { defaultErrors } from "../../../model/defaultErrors";
import useConfirmation from "../../hooks/useConfirmation";
import ConfirmationModal from "../../misc/modals/ConfirmationModal";
import EmailForm from "./EmailForm";
import PhoneForm from "./PhoneForm";
import { Contact } from "lucide-react";
import ContactTab from "./ContactTab";
import ContactBar from "./ContactBar";

const ContactCard = (props) => {
    const { formData, updateContact, addContact, removeContact, formErrors, setFormErrors } = props
    //const [addresses, setAddresses] = useState([{}]);
    const [addressActiveTab, setAddressActiveTab] = useState(0);
    const [emailActiveTab, setEmailActiveTab] = useState(0);
    const [phoneActiveTab, setPhoneActiveTab] = useState(0);
    //const [formData, setFormData] = useState({ ...defaultApplication });
    //const [formErrors, setFormErrors] = useState({ ...defaultErrors });
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation();

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

    const addNewContact = (contactType) => {
        addContact(contactType);
        if(contactType === 'addresses') {
            setAddressActiveTab(formData.person.contact.addresses.length);
        } else if(contactType === 'emails') {
            setEmailActiveTab(formData.person.contact.emails.length);
        } else if(contactType === 'phones') {
            setPhoneActiveTab(formData.person.contact.phones.length);
        }
    };

  return (
    <>
        <style>{KEYFRAMES}</style>
        <div className='card'>
            <div className="card-header bg-light">
                <div className="d-flex">
                    <EnvelopeFill size={28} className='me-2 text-primary' />
                    <span className="fs-5 fw-semibold text-primary">Contact Details</span>
                </div>
            </div>
            <div className="card-body px-1 px-sm-3">
                {/* ── Addresses Section ── */}
                <ContactBar
                    title="Addresses"
                    subTitle="Address"
                    arrayName="addresses"
                    icon={GeoAlt}
                    addNewContact={addNewContact}
                />
                <ContactTab
                    id={`address-tab-${addressActiveTab}`}
                    title="Address"
                    arrayName="addresses"
                    list={formData.person.contact.addresses}
                    activeTab={addressActiveTab}
                    setActiveTab={setAddressActiveTab}
                    deleteContact={deleteContact}
                />
                <AddressForm 
                    address={formData.person.contact.addresses[addressActiveTab]}
                    index={addressActiveTab}
                    updateContact={updateContact} 
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                />

                {/* ── Emails Section ── */}
                <ContactBar
                    title="Emails"
                    subTitle="Email"
                    arrayName="emails"
                    icon={EnvelopeAt}
                    addNewContact={addNewContact}
                />
                <ContactTab
                    id={`email-tab-${emailActiveTab}`}
                    title="Email"
                    arrayName="emails"
                    list={formData.person.contact.emails}
                    activeTab={emailActiveTab}
                    setActiveTab={setEmailActiveTab}
                    deleteContact={deleteContact}
                />
                <EmailForm
                    email={formData.person.contact.emails[emailActiveTab]}
                    index={emailActiveTab}
                    updateContact={updateContact} 
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                />

                {/* ── Phones Section ── */}
                <ContactBar
                    title="Phones"
                    subTitle="Phone"
                    arrayName="phones"
                    icon={Telephone}
                    addNewContact={addNewContact}
                />
                <ContactTab
                    id={`phone-tab-${phoneActiveTab}`}
                    title="Phone"
                    arrayName="phones"
                    list={formData.person.contact.phones}
                    activeTab={phoneActiveTab}
                    setActiveTab={setPhoneActiveTab}
                    deleteContact={deleteContact}
                />
                <PhoneForm
                    phone={formData.person.contact.phones[phoneActiveTab]}
                    index={phoneActiveTab}
                    updateContact={updateContact} 
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                />

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

ContactCard.propTypes = {
    formData: PropTypes.object,
    updateContact: PropTypes.func,
    addContact: PropTypes.func,
    removeContact: PropTypes.func,
    formErrors: PropTypes.object,
    setFormErrors: PropTypes.func,
}

// ─── Design tokens (light palette) ───────────────────────────────────────────
const TOKEN = {
    sand:     "#faf8f5",
    white:    "#ffffff",
    stone:    "#f0ede8",
    light:    "#f8f9fA",
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
        background: active ? TOKEN.light : "transparent",
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
        color: TOKEN.ink3, fontSize: 15, fontWeight: 700,
        padding: "4px 8px 4px 2px",
        cursor: "pointer", lineHeight: 1,
        transition: "color .15s ease",
    },
    formArea: {
        background: TOKEN.stone,
        padding: "24px 28px",
    },
}

// ─── Global keyframes injected once ──────────────────────────────────────────
const KEYFRAMES = `
  .tab-hover:hover { background: #ccfbf1 !important; border: 1px solid ${TOKEN.border} !important; }
  .tab-x-hover:hover { color: ${TOKEN.danger} !important; }
`;

export default ContactCard