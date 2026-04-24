import PropTypes from 'prop-types';

const ContactTab = (props) => {
    const { id, title, arrayName, list, activeTab, setActiveTab, deleteContact } = props;

    return (
        <>
            {/* ── Tabs ── */}
            <div key={id} className='d-flex gap-1' style={{ padding: '.75rem 1.75rem 0', overflowX: 'auto', borderBottom: '1px solid #e2ddd6' }}>
                {list.map((_, i) => (
                    <div key={`${arrayName}-${i}`} style={S.tab(activeTab === i)} className="tab-hover">
                        <button type="button" style={S.tabBtn(activeTab === i)} onClick={() => setActiveTab(i)}>
                            <span style={S.tabDot(activeTab === i)} />
                            {title} {i + 1}
                        </button>
                        {list.length > 0 && (
                            <button type="button" className="tab-x-hover" style={S.tabX} onClick={() => deleteContact(arrayName, i)}>×</button>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

ContactTab.prototype = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    arrayName: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    activeTab: PropTypes.number.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired
};

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

export default ContactTab