import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const address = {
    street: "", 
    suite: "", 
    postal: "",
    country: null, 
    state: null, 
    city: null,
}

function Field({ label, placeholder, value, onChange }) {
    return (
        <div className="form-floating">
            <input
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <label htmlFor={`field-${label}`}>{label}*</label>
        </div>
    );
}

/* ─── AddressForm ─────────────────────────────────────────────── */
const AddressForm = ({ title, address, onChange }) => {
    return (
        <div style={{ marginBottom: 28 }}>
            <p className="text-muted mb-3">{title}</p>

            <div className="form-group row" style={{ marginBottom: 16 }}>
                <div className="col-sm-5 mb-3">
                    <div className="form-floating">
                        <select
                            id={`address-type`}
                            value={address.addressType || ''}
                            onChange={(v) => onChange({ ...address, addressType: v })}
                            className={`form-select`}
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
                        <label htmlFor={`address-type`}>Type*</label>
                    </div>
                </div>
                <div className="col-sm-7 mb-1">
                    <Field
                        label="Street Address"
                        placeholder="123 Main St"
                        value={address.street}
                        onChange={(v) => onChange({ ...address, street: v })}
                    />
                </div>
            </div>
            <div className="d-flex row">
                <div className="col-sm-6 mb-3">
                    <div className="form-floating">
                        <CountrySelect
                            defaultValue={address.country || undefined}
                            onChange={(c) => onChange({ ...address, country: c, state: null, city: null })}
                            placeHolder="Select country"
                            className="form-control"
                        />
                        <label htmlFor="country">Country*</label>
                    </div>
                </div>
                <div className="col-sm-6 mb-3">
                    <div className="form-floating">
                        <StateSelect
                            countryid={address.country?.id}
                            defaultValue={address.state || undefined}
                            onChange={(s) => onChange({ ...address, state: s, city: null })}
                            placeHolder="Select state"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-sm-6 mb-3">
                    <CitySelect
                        countryid={address.country?.id}
                        stateid={address.state?.id}
                        defaultValue={address.city || undefined}
                        onChange={(c) => onChange({ ...address, city: c })}
                        placeHolder="Select city"
                    />
                </div>
                <div className="col-sm-6">
                    <Field
                        label="Postal Code"
                        placeholder="10001"
                        value={address.postal}
                        onChange={(v) => onChange({ ...address, postal: v })}
                    />
                </div>
            </div>
        </div>
    );
}

export default AddressForm