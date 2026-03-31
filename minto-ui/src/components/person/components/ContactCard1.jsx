/**
 * AddressForm.jsx — Light theme, React-Bootstrap layout, Claude AI geo
 *
 * Install deps:
 *   npm install react-bootstrap bootstrap
 *
 * In your app entry (e.g. main.jsx / index.jsx) add:
 *   import 'bootstrap/dist/css/bootstrap.min.css';
 *
 * Google Font (add to index.html <head>):
 *   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Mulish:wght@300;400;500;600&display=swap" rel="stylesheet">
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Container, Row, Col, Card, Badge, Button,
  Form, InputGroup, Spinner, Nav,
} from "react-bootstrap";

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
  shell: {
    minHeight: "100vh",
    background: `radial-gradient(ellipse 80% 50% at 20% -10%, #ccfbf140, transparent 60%),
                 radial-gradient(ellipse 60% 40% at 100% 80%, #fef3c740, transparent 60%),
                 ${TOKEN.sand}`,
    fontFamily: "'Mulish', sans-serif",
    paddingTop: 48,
    paddingBottom: 80,
  },
  card: {
    border: `1px solid ${TOKEN.border}`,
    borderRadius: 20,
    boxShadow: "0 8px 48px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.9) inset",
    overflow: "hidden",
    background: TOKEN.white,
  },
  cardHeader: {
    background: `linear-gradient(135deg, ${TOKEN.tealSoft} 0%, ${TOKEN.white} 55%)`,
    borderBottom: `1px solid ${TOKEN.border}`,
    padding: "24px 28px",
  },
  avatarRing: {
    display: "inline-flex",
    padding: 2,
    borderRadius: "50%",
    background: `conic-gradient(${TOKEN.teal}, #f59e0b, ${TOKEN.teal})`,
    flexShrink: 0,
  },
  avatar: {
    width: 46, height: 46,
    borderRadius: "50%",
    background: TOKEN.tealSoft,
    color: TOKEN.teal,
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600,
    fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  contactName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600,
    fontSize: 19,
    color: TOKEN.ink,
    letterSpacing: "-.01em",
    margin: 0,
  },
  contactRole: {
    fontSize: 12,
    color: TOKEN.ink3,
    margin: 0,
    marginTop: 2,
  },
  sectionBar: {
    padding: "16px 28px 0",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: TOKEN.ink3,
    display: "flex", alignItems: "center", gap: 6,
  },
  addBtn: {
    fontSize: 12, fontWeight: 500,
    color: TOKEN.teal,
    background: TOKEN.tealSoft,
    border: `1px solid ${TOKEN.tealBord}`,
    borderRadius: 20,
    padding: "5px 14px",
    cursor: "pointer",
    display: "flex", alignItems: "center", gap: 5,
    transition: "all .15s ease",
    fontFamily: "'Mulish', sans-serif",
  },
  tabsWrap: {
    display: "flex", gap: 4,
    padding: "12px 28px 0",
    overflowX: "auto",
    borderBottom: `1px solid ${TOKEN.border}`,
  },
  tab: (active) => ({
    display: "flex", alignItems: "center",
    border: `1px solid ${active ? TOKEN.border : "transparent"}`,
    borderBottom: active ? `1px solid ${TOKEN.white}` : "1px solid transparent",
    borderRadius: "8px 8px 0 0",
    background: active ? TOKEN.white : "transparent",
    marginBottom: -1,
    transition: "all .15s ease",
  }),
  tabBtn: (active) => ({
    fontFamily: "'Mulish', sans-serif",
    fontSize: 12.5, fontWeight: active ? 600 : 400,
    color: active ? TOKEN.ink : TOKEN.ink3,
    background: "none", border: "none",
    padding: "8px 12px",
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
  footer: {
    padding: "18px 28px",
    borderTop: `1px solid ${TOKEN.border}`,
    display: "flex", justifyContent: "flex-end", gap: 10,
  },
  poweredBy: {
    marginTop: 14,
    display: "flex", alignItems: "center", gap: 7,
    fontSize: 11, color: TOKEN.ink3, letterSpacing: ".04em",
  },
  poweredDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: TOKEN.teal,
    boxShadow: `0 0 8px ${TOKEN.teal}`,
    animation: "pulse 2s ease-in-out infinite",
  },

  // AddressForm
  typeRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  typeBtn: (active) => ({
    fontFamily: "'Mulish', sans-serif",
    fontSize: 12.5, fontWeight: active ? 600 : 400,
    color: active ? TOKEN.teal : TOKEN.ink2,
    background: active ? TOKEN.tealSoft : TOKEN.white,
    border: `1px solid ${active ? TOKEN.teal : TOKEN.border}`,
    borderRadius: 20,
    padding: "6px 16px",
    cursor: "pointer",
    transition: "all .15s ease",
    display: "flex", alignItems: "center", gap: 6,
  }),
  aiBadge: (visible) => ({
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 11.5, color: TOKEN.ink2,
    background: TOKEN.white,
    border: `1px solid ${TOKEN.border}`,
    borderRadius: 20,
    padding: "6px 14px",
    width: "fit-content",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(-4px)",
    transition: "opacity .25s ease, transform .25s ease",
    pointerEvents: "none",
  }),
  aiPulse: {
    width: 7, height: 7, borderRadius: "50%",
    background: TOKEN.teal,
    boxShadow: `0 0 8px ${TOKEN.teal}`,
    animation: "pulse 1s ease-in-out infinite",
    flexShrink: 0,
  },
  label: {
    fontSize: 11, fontWeight: 600,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: TOKEN.ink2,
    marginBottom: 4,
    display: "flex", alignItems: "center", gap: 6,
  },
  input: (focused) => ({
    fontFamily: "'Mulish', sans-serif",
    fontSize: 14, color: TOKEN.ink,
    background: TOKEN.white,
    border: `1px solid ${focused ? TOKEN.teal : TOKEN.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    width: "100%", outline: "none",
    boxShadow: focused ? TOKEN.tealGlow : "none",
    transition: "border-color .15s ease, box-shadow .15s ease",
  }),

  // SmartSelect
  ssWrap: { position: "relative" },
  ssField: (focused) => ({
    display: "flex", alignItems: "center",
    background: TOKEN.white,
    border: `1px solid ${focused ? TOKEN.teal : TOKEN.border}`,
    borderRadius: 8,
    boxShadow: focused ? TOKEN.tealGlow : "none",
    transition: "border-color .15s ease, box-shadow .15s ease",
    cursor: "text", overflow: "hidden",
  }),
  ssInput: {
    flex: 1,
    fontFamily: "'Mulish', sans-serif",
    fontSize: 14, color: TOKEN.ink,
    background: "transparent",
    border: "none", outline: "none",
    padding: "10px 14px", width: "100%",
    cursor: "pointer",
  },
  ssChevron: {
    padding: "0 12px", color: TOKEN.ink3,
    display: "flex", alignItems: "center", flexShrink: 0,
  },
  ssClear: {
    background: "none", border: "none",
    color: TOKEN.ink3, padding: "0 10px",
    cursor: "pointer", display: "flex", alignItems: "center",
    transition: "color .15s ease",
  },
  ssMenu: {
    position: "absolute",
    top: "calc(100% + 4px)", left: 0, right: 0,
    background: TOKEN.white,
    border: `1px solid ${TOKEN.borderHi}`,
    borderRadius: 8,
    boxShadow: "0 8px 32px rgba(0,0,0,.12)",
    maxHeight: 220, overflowY: "auto",
    zIndex: 300,
  },
  ssOpt: (active) => ({
    fontFamily: "'Mulish', sans-serif",
    fontSize: 13.5,
    color: active ? TOKEN.teal : TOKEN.ink2,
    background: active ? TOKEN.tealSoft : "transparent",
    padding: "9px 14px", cursor: "pointer",
    transition: "background .12s ease, color .12s ease",
  }),
  ssEmpty: {
    fontSize: 13, color: TOKEN.ink3,
    padding: "12px 14px", textAlign: "center", fontStyle: "italic",
  },
};

// ─── Global keyframes injected once ──────────────────────────────────────────
const KEYFRAMES = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  .ss-opt-hover:hover { background: ${TOKEN.stone} !important; color: ${TOKEN.ink} !important; }
  .add-btn-hover:hover { background: #ccfbf1 !important; }
  .tab-x-hover:hover { color: ${TOKEN.danger} !important; }
  .icon-btn-hover:hover { border-color: ${TOKEN.teal} !important; color: ${TOKEN.teal} !important; }
  ::placeholder { color: ${TOKEN.ink3} !important; opacity: 1; }
`;

// ─── Claude AI geo lookup ─────────────────────────────────────────────────────
async function claudeGeoFetch(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://api.anthropic.com" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "You are a geography data API. Respond ONLY with a valid JSON array of strings. No explanation, no markdown, no backticks. Just the raw JSON array.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text?.trim() ?? "[]";
  try { return JSON.parse(text); } catch { return []; }
}

const geoCache = {};
const getCountries = async () => {
  if (geoCache.countries) return geoCache.countries;
  const r = await claudeGeoFetch('Return a JSON array of the 50 most populated countries, each as "CountryName|ISO2". Sort alphabetically.');
  return (geoCache.countries = r);
};
const getStates = async (country) => {
  const k = `s:${country}`;
  if (geoCache[k]) return geoCache[k];
  const r = await claudeGeoFetch(`Return a JSON array of up to 60 states/provinces for "${country}", each a plain string. Sort alphabetically. Return [] if none.`);
  return (geoCache[k] = r);
};
const getCities = async (country, state) => {
  const k = `c:${country}:${state}`;
  if (geoCache[k]) return geoCache[k];
  const r = await claudeGeoFetch(`Return a JSON array of 40 well-known cities in "${state}", ${country}, each a plain string. Sort alphabetically. Return [] if none.`);
  return (geoCache[k] = r);
};

// ─── SmartSelect ──────────────────────────────────────────────────────────────
function SmartSelect({ placeholder, options, value, onChange, disabled, loading }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const ref      = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) { setOpen(false); setFocused(false); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));
  const select   = (opt) => { onChange(opt); setQuery(""); setOpen(false); setFocused(false); };
  const displayValue = open ? query : (value || "");

  if (disabled) {
    return (
      <div style={{ ...S.ssField(false), opacity: .45, pointerEvents: "none" }}>
        <input style={S.ssInput} placeholder={placeholder} readOnly value="" />
        <span style={S.ssChevron}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
    );
  }

  return (
    <div style={S.ssWrap} ref={ref}>
      <div style={S.ssField(focused || open)}
        onClick={() => { setOpen(true); setFocused(true); setTimeout(() => inputRef.current?.focus(), 20); }}>
        <input
          ref={inputRef}
          style={S.ssInput}
          placeholder={loading ? "Loading…" : placeholder}
          value={displayValue}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); setFocused(true); }}
          autoComplete="off"
        />
        <span style={S.ssChevron}>
          {loading
            ? <span style={{ display:"inline-block", width:14, height:14, border:`2px solid ${TOKEN.border}`, borderTopColor: TOKEN.teal, borderRadius:"50%", animation:"spin .7s linear infinite" }} />
            : <svg style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform .15s" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TOKEN.ink3} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          }
        </span>
        {value && !open && (
          <button style={S.ssClear} onMouseDown={(e) => { e.stopPropagation(); onChange(""); setQuery(""); }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>
      {open && (
        <div style={S.ssMenu}>
          {filtered.length === 0
            ? <div style={S.ssEmpty}>{loading ? "Fetching…" : "No results"}</div>
            : filtered.map((opt) => (
              <div key={opt}
                className="ss-opt-hover"
                style={S.ssOpt(opt === value)}
                onMouseDown={() => select(opt)}>
                {opt}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ─── AddressForm ──────────────────────────────────────────────────────────────
function AddressForm({ address = {}, onChange }) {
  const [countries,       setCountries]       = useState([]);
  const [states,          setStates]          = useState([]);
  const [cities,          setCities]          = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates,   setLoadingStates]   = useState(false);
  const [loadingCities,   setLoadingCities]   = useState(false);
  const [country,         setCountry]         = useState(address.country || "");
  const [state,           setState]           = useState(address.state   || "");
  const [city,            setCity]            = useState(address.city    || "");
  const [aiNote,          setAiNote]          = useState("");
  const [fields, setFields] = useState({
    line1: address.line1 || "", line2: address.line2 || "",
    postalCode: address.postalCode || "", type: address.type || "home",
  });
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    setLoadingCountries(true);
    setAiNote("Asking Claude for countries…");
    getCountries().then((list) => { setCountries(list); setLoadingCountries(false); setAiNote(""); });
  }, []);

  useEffect(() => {
    if (!country) { setStates([]); setCities([]); return; }
    const name = country.split("|")[0];
    setLoadingStates(true);
    setAiNote(`Fetching states for ${name}…`);
    getStates(name).then((list) => { setStates(list); setLoadingStates(false); setAiNote(""); });
    setState(""); setCity(""); setCities([]);
  }, [country]);

  useEffect(() => {
    if (!state || !country) { setCities([]); return; }
    const cName = country.split("|")[0];
    setLoadingCities(true);
    setAiNote(`Fetching cities in ${state}…`);
    getCities(cName, state).then((list) => { setCities(list); setLoadingCities(false); setAiNote(""); });
    setCity("");
  }, [state]);

  const notify = useCallback((patch) => {
    const cName = (country || "").split("|")[0];
    const code  = (country || "").split("|")[1] || "";
    onChange?.({ ...fields, country: cName, countryCode: code, state, city, ...patch });
  }, [fields, country, state, city, onChange]);

  const handleField = (e) => {
    const updated = { ...fields, [e.target.name]: e.target.value };
    setFields(updated); notify(updated);
  };

  const handleCountry = (val) => {
    const match = countries.find((c) => c.split("|")[0] === val) || val;
    setCountry(match);
    notify({ country: match.split("|")[0], countryCode: match.split("|")[1] || "", state: "", city: "" });
  };

  const countryDisplay = country ? country.split("|")[0] : "";
  const countryIso     = country ? country.split("|")[1] : "";

  const textField = (name, placeholder, label, optional = false, autoComplete = "") => (
    <Form.Group className="mb-0">
      <div style={S.label}>
        {label}
        {optional && (
          <span style={{ fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0,
            color: TOKEN.ink3, background: TOKEN.stone, border: `1px solid ${TOKEN.border}`,
            borderRadius: 4, padding: "1px 6px" }}>
            optional
          </span>
        )}
      </div>
      <input
        style={S.input(focusedField === name)}
        name={name}
        value={fields[name]}
        onChange={handleField}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
      />
    </Form.Group>
  );

  return (
    <div className="d-flex flex-column gap-3">

      {/* Address type */}
      <div style={S.typeRow}>
        {[{ key:"home",icon:"⌂",label:"Home"},{ key:"work",icon:"⬡",label:"Work"},{ key:"other",icon:"◈",label:"Other"}]
          .map(({ key, icon, label }) => (
          <button key={key} type="button" style={S.typeBtn(fields.type === key)}
            onClick={() => { const u = { ...fields, type: key }; setFields(u); notify(u); }}>
            <span style={{ fontSize: 14 }}>{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* AI status */}
      <div style={S.aiBadge(!!aiNote)}>
        <span style={S.aiPulse} />
        <span style={{ color: TOKEN.teal, fontWeight: 600 }}>✦ Claude</span>
        <span style={{ color: TOKEN.ink2, fontSize: 11 }}>{aiNote}</span>
      </div>

      {/* Street lines */}
      <Row className="g-3">
        <Col xs={12}>{textField("line1","123 Main Street","Street address","",  "address-line1")}</Col>
        <Col xs={12}>{textField("line2","Suite 200","Apartment, suite, etc.", true, "address-line2")}</Col>
      </Row>

      {/* Country */}
      <Row className="g-3">
        <Col xs={12}>
          <div style={S.label}>
            Country
            {countryIso && (
              <span style={{ fontSize: 10, fontWeight: 700, color: TOKEN.teal,
                background: TOKEN.tealSoft, border: `1px solid ${TOKEN.tealBord}`,
                borderRadius: 4, padding: "1px 6px", letterSpacing: ".08em" }}>
                {countryIso}
              </span>
            )}
          </div>
          <SmartSelect
            placeholder="Search countries…"
            options={countries.map((c) => c.split("|")[0])}
            value={countryDisplay}
            onChange={handleCountry}
            loading={loadingCountries}
          />
        </Col>
      </Row>

      {/* State + City */}
      <Row className="g-3">
        <Col xs={12} sm={6}>
          <div style={S.label}>State / Province</div>
          <SmartSelect
            placeholder={country ? "Search states…" : "Select country first"}
            options={states}
            value={state}
            onChange={(v) => { setState(v); notify({ state: v, city: "" }); }}
            loading={loadingStates}
            disabled={!country || loadingStates}
          />
        </Col>
        <Col xs={12} sm={6}>
          <div style={S.label}>City</div>
          <SmartSelect
            placeholder={state ? "Search cities…" : "Select state first"}
            options={cities}
            value={city}
            onChange={(v) => { setCity(v); notify({ city: v }); }}
            loading={loadingCities}
            disabled={!state || loadingCities}
          />
        </Col>
      </Row>

      {/* Postal code */}
      <Row className="g-3">
        <Col xs={12} sm={5}>
          {textField("postalCode","10001","Postal / ZIP code","","postal-code")}
        </Col>
      </Row>
    </div>
  );
}

// ─── ContactCard ──────────────────────────────────────────────────────────────
function ContactCard1() {
  const [addresses, setAddresses] = useState([{}]);
  const [activeTab, setActiveTab]  = useState(0);

  const addAddress = () => { setAddresses((p) => [...p, {}]); setActiveTab(addresses.length); };
  const removeAddress = (i) => {
    if (addresses.length === 1) return;
    const next = addresses.filter((_, idx) => idx !== i);
    setAddresses(next);
    setActiveTab(Math.min(activeTab, next.length - 1));
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={S.shell}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <div style={S.card}>

                {/* ── Header ── */}
                <div style={S.cardHeader}>
                  <Row className="align-items-center g-0">
                    <Col xs="auto" className="me-3">
                      <div style={S.avatarRing}>
                        <div style={S.avatar}>JD</div>
                      </div>
                    </Col>
                    <Col>
                      <p style={S.contactName}>Jane Doe</p>
                      <p style={S.contactRole}>Product Designer · San Francisco</p>
                    </Col>
                    <Col xs="auto">
                      <button className="icon-btn-hover" style={{
                        background: TOKEN.white, border: `1px solid ${TOKEN.border}`,
                        color: TOKEN.ink2, borderRadius: 8,
                        width: 34, height: 34, display:"flex", alignItems:"center", justifyContent:"center",
                        cursor:"pointer", transition:"all .15s ease",
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </Col>
                  </Row>
                </div>

                {/* ── Section bar ── */}
                <div style={S.sectionBar}>
                  <span style={S.sectionLabel}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    Addresses
                  </span>
                  <button className="add-btn-hover" style={S.addBtn} type="button" onClick={addAddress}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add address
                  </button>
                </div>

                {/* ── Tabs ── */}
                <div style={S.tabsWrap}>
                  {addresses.map((_, i) => (
                    <div key={i} style={S.tab(activeTab === i)}>
                      <button type="button" style={S.tabBtn(activeTab === i)} onClick={() => setActiveTab(i)}>
                        <span style={S.tabDot(activeTab === i)} />
                        Address {i + 1}
                      </button>
                      {addresses.length > 1 && (
                        <button type="button" className="tab-x-hover" style={S.tabX} onClick={() => removeAddress(i)}>×</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* ── Form area ── */}
                <div style={S.formArea}>
                  <AddressForm
                    key={activeTab}
                    address={addresses[activeTab]}
                    onChange={(data) => {
                      const next = [...addresses];
                      next[activeTab] = data;
                      setAddresses(next);
                    }}
                  />
                </div>

                {/* ── Footer ── */}
                <div style={S.footer}>
                  <Button variant="outline-secondary" size="sm"
                    style={{ fontFamily:"'Mulish',sans-serif", fontSize:13, borderRadius:8, padding:"8px 20px", color: TOKEN.ink2, borderColor: TOKEN.border }}>
                    Discard
                  </Button>
                  <Button size="sm"
                    style={{ fontFamily:"'Mulish',sans-serif", fontSize:13, fontWeight:600, borderRadius:8,
                      padding:"8px 20px", background: TOKEN.teal, borderColor: TOKEN.teal,
                      color:"#fff", display:"flex", alignItems:"center", gap:6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Save changes
                  </Button>
                </div>
              </div>

              {/* Powered by */}
              <div style={S.poweredBy}>
                <span style={S.poweredDot} />
                Location data powered by Claude AI
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ContactCard1;