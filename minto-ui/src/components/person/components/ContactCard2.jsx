import { useState } from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

/* ─── Styles ─────────────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  :root {
    --bg:           #f5f3ef;
    --surface:      #ffffff;
    --border:       #e2ddd6;
    --border-focus: #b5a898;
    --text:         #2a2420;
    --muted:        #9e9188;
    --accent:       #c17a4a;
    --accent-dim:   #f0e6da;
    --shadow-sm:    0 1px 3px rgba(42,36,32,.06);
    --shadow-md:    0 4px 20px rgba(42,36,32,.10);
    --radius:       12px;
    --radius-sm:    8px;
    --transition:   .18s ease;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
  }

  /* ── Contact card ── */
  .contact-card {
    background: var(--surface);
    border-radius: 20px;
    box-shadow: var(--shadow-md);
    width: 100%;
    max-width: 680px;
    overflow: hidden;
  }

  .contact-header {
    background: linear-gradient(135deg, #2a2420 0%, #4a3830 100%);
    padding: 28px 32px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .contact-avatar {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(193,122,74,.35);
  }

  .contact-header-info h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: #f5f3ef;
    letter-spacing: .01em;
  }
  .contact-header-info p {
    font-size: 13px;
    color: #9e9188;
    margin-top: 2px;
  }

  /* ── Tabs ── */
  .contact-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    gap: 4px;
  }
  .tab-btn {
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color var(--transition), border-color var(--transition);
    white-space: nowrap;
    margin-bottom: -1px;
  }
  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* ── Address panel ── */
  .address-panel { padding: 28px 32px 32px; }

  .address-section-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--muted);
    margin-bottom: 18px;
  }

  /* ── Field grid ── */
  .field-grid { display: grid; gap: 16px; }
  .field-grid.cols-2 { grid-template-columns: 1fr 1fr; }
  .field-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

  @media (max-width: 520px) {
    .contact-header { padding: 22px 20px 18px; }
    .contact-tabs   { padding: 0 20px; }
    .address-panel  { padding: 22px 20px 28px; }
    .field-grid.cols-2, .field-grid.cols-3 { grid-template-columns: 1fr; }
  }

  /* ── Text input ── */
  .field-wrap { display: flex; flex-direction: column; gap: 5px; }
  .field-label {
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: var(--muted);
  }
  .field-input {
    height: 44px;
    padding: 0 14px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
    width: 100%;
  }
  .field-input::placeholder { color: var(--muted); }
  .field-input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(181,168,152,.18);
  }

  .field-divider { height: 1px; background: var(--border); margin: 8px 0; }

  /* ── react-country-state-city overrides ── */
  .stdropdown-container { width: 100% !important; position: relative !important; }
  .stdropdown-input {
    height: 44px !important;
    padding: 0 14px !important;
    background: var(--bg) !important;
    border: 1.5px solid var(--border) !important;
    border-radius: var(--radius-sm) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 14px !important;
    color: var(--text) !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    transition: border-color var(--transition), box-shadow var(--transition) !important;
    box-shadow: none !important;
  }
  .stdropdown-input:hover, .stdropdown-input.open {
    border-color: var(--border-focus) !important;
    box-shadow: 0 0 0 3px rgba(181,168,152,.18) !important;
  }
  .stdropdown-input input {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 14px !important;
    color: var(--text) !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    width: 100% !important;
    padding: 0 !important;
    height: auto !important;
  }
  .stdropdown-input input::placeholder { color: var(--muted) !important; }
  .stdropdown-menu {
    border: 1.5px solid var(--border-focus) !important;
    border-radius: var(--radius-sm) !important;
    box-shadow: var(--shadow-md) !important;
    background: var(--surface) !important;
    margin-top: 4px !important;
    overflow: hidden !important;
    z-index: 999 !important;
  }
  .stdropdown-item {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 13.5px !important;
    color: var(--text) !important;
    padding: 10px 14px !important;
    cursor: pointer !important;
    transition: background var(--transition) !important;
  }
  .stdropdown-item:hover { background: var(--accent-dim) !important; color: var(--accent) !important; }

  /* ── Buttons ── */
  .save-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
  .btn {
    height: 42px;
    padding: 0 22px;
    border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all var(--transition);
  }
  .btn-ghost {
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--muted);
  }
  .btn-ghost:hover { border-color: var(--border-focus); color: var(--text); }
  .btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 2px 8px rgba(193,122,74,.30);
  }
  .btn-primary:hover {
    background: #a8673e;
    box-shadow: 0 4px 14px rgba(193,122,74,.40);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(12px);
    background: #2a2420;
    color: #f5f3ef;
    padding: 12px 22px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
    transition: opacity .25s, transform .25s;
    white-space: nowrap;
    z-index: 9999;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

/* ─── Helpers ─── */
const TABS = ["Overview", "Addresses", "Notes", "Activity"];

const emptyAddress = () => ({
  street: "", suite: "", postal: "",
  country: null, state: null, city: null,
});

function Field({ label, placeholder, value, onChange }) {
  return (
    <div className="field-wrap">
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ─── AddressForm ─────────────────────────────────────────────── */
function AddressForm({ title, address, onChange }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p className="address-section-title">{title}</p>

      <div className="field-grid" style={{ marginBottom: 16 }}>
        <Field
          label="Street"
          placeholder="123 Main St"
          value={address.street}
          onChange={(v) => onChange({ ...address, street: v })}
        />
      </div>

      <div className="field-grid cols-2" style={{ marginBottom: 16 }}>
        <Field
          label="Suite / Unit"
          placeholder="Apt 4B"
          value={address.suite}
          onChange={(v) => onChange({ ...address, suite: v })}
        />
        <Field
          label="Postal Code"
          placeholder="10001"
          value={address.postal}
          onChange={(v) => onChange({ ...address, postal: v })}
        />
      </div>

      <div className="field-grid cols-3">
        <div className="field-wrap">
          <span className="field-label">Country</span>
          <CountrySelect
            defaultValue={address.country || undefined}
            onChange={(c) =>
              onChange({ ...address, country: c, state: null, city: null })
            }
            placeHolder="Select country"
          />
        </div>

        <div className="field-wrap">
          <span className="field-label">State / Region</span>
          <StateSelect
            countryid={address.country?.id}
            defaultValue={address.state || undefined}
            onChange={(s) => onChange({ ...address, state: s, city: null })}
            placeHolder="Select state"
          />
        </div>

        <div className="field-wrap">
          <span className="field-label">City</span>
          <CitySelect
            countryid={address.country?.id}
            stateid={address.state?.id}
            defaultValue={address.city || undefined}
            onChange={(c) => onChange({ ...address, city: c })}
            placeHolder="Select city"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── AddressesTab ────────────────────────────────────────────── */
function AddressesTab() {
  const [billing, setBilling] = useState(emptyAddress());
  const [shipping, setShipping] = useState(emptyAddress());
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [toast, setToast] = useState(false);

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2600);
  };

  const handleSameToggle = (e) => {
    setSameAsBilling(e.target.checked);
    if (e.target.checked) setShipping({ ...billing });
  };

  return (
    <div className="address-panel">
      <AddressForm title="Billing Address" address={billing} onChange={setBilling} />

      <div className="field-divider" />

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 18px" }}>
        <input
          type="checkbox"
          id="same-check"
          checked={sameAsBilling}
          onChange={handleSameToggle}
          style={{ accentColor: "var(--accent)", width: 15, height: 15, cursor: "pointer" }}
        />
        <label
          htmlFor="same-check"
          style={{ fontSize: 13, color: "var(--muted)", cursor: "pointer", userSelect: "none" }}
        >
          Shipping address same as billing
        </label>
      </div>

      {!sameAsBilling && (
        <AddressForm title="Shipping Address" address={shipping} onChange={setShipping} />
      )}

      <div className="save-row">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save addresses</button>
      </div>

      <div className={`toast${toast ? " show" : ""}`}>✓ Addresses saved successfully</div>
    </div>
  );
}

/* ─── ContactCard (shell) ─────────────────────────────────────── */
export default function ContactCard2() {
  const [activeTab, setActiveTab] = useState("Addresses");

  return (
    <>
      <style>{STYLE}</style>
      <div className="contact-card">
        <div className="contact-header">
          <div className="contact-avatar">A</div>
          <div className="contact-header-info">
            <h2>Alexandra Chen</h2>
            <p>alexandra.chen@example.com · +1 (415) 555-0192</p>
          </div>
        </div>

        <div className="contact-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab-btn${activeTab === t ? " active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Addresses" ? (
          <AddressesTab />
        ) : (
          <div style={{ padding: "48px 32px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
            {activeTab} tab content
          </div>
        )}
      </div>
    </>
  );
}