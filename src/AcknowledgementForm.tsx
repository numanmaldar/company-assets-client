// company-assets-client/src/AcknowledgementForm.tsx
import { useEffect, type CSSProperties } from "react";
import type { Assignment } from "./api/assets";

interface Props {
  assignment: Assignment;
  onClose: () => void;
}

export default function AcknowledgementForm({ assignment, onClose }: Props) {
  const { employees: emp, devices: dev, assigned_at, notes } = assignment;

  // Handle print with proper document body class management
  const handlePrint = () => {
    document.body.classList.add("printing-ack");
    window.print();
    // Fallback cleanup in case afterprint doesn't fire
    setTimeout(() => {
      document.body.classList.remove("printing-ack");
    }, 1500);
  };

  // Manage Ctrl+P and browser print preview triggers
  useEffect(() => {
    const handleBeforePrint = () => {
      document.body.classList.add("printing-ack");
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-ack");
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      document.body.classList.remove("printing-ack");
    };
  }, []);

  const deviceLabel = () => {
    switch (dev.type) {
      case "phone":   return "Mobile Phone:";
      case "laptop":  return "Laptop:";
      case "tablet":  return "Tablet:";
      case "monitor": return "Monitor:";
      default:        return "Device:";
    }
  };

  const dateStr = new Date(assigned_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Dark backdrop */}
      <div className="ack-backdrop ack-no-print" style={s.backdrop} onClick={onClose} />

      {/* Modal Shell */}
      <div className="ack-modal-shell" style={s.shell}>

        {/* Toolbar (Hidden when printing) */}
        <div style={s.toolbar} className="ack-no-print">
          <div style={s.toolbarLeft}>
            <span style={s.toolbarTitle}>Acknowledgement Form Preview</span>
            <span style={s.toolbarSub}>A4 • Official Company Document</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={s.btnPrint} onClick={handlePrint}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / Save as PDF
            </button>
            <button style={s.btnClose} onClick={onClose}>Close</button>
          </div>
        </div>

        {/* ======= PRINTABLE A4 PAGE ======= */}
        <div style={s.page} id="ack-form-print">

          {/* --- WATERMARK BACKGROUND --- */}
          <div style={s.watermark} className="ack-watermark" aria-hidden="true">
            <img src="/hla-watermark.png" alt="" style={s.watermarkImg} />
          </div>

          {/* Foreground content wrapper */}
          <div style={s.contentWrapper}>

            {/* --- HEADER --- */}
            <div style={s.pageHeader}>
              <div style={s.logoCol}>
                <img
                  src="/hla-logo-dark.png"
                  alt="Holistic Legacy Accounting"
                  style={s.logo}
                />
              </div>

              {/* QR Code linking to company website */}
              <a
                href="https://www.hlauae.com"
                target="_blank"
                rel="noopener noreferrer"
                style={s.qrLink}
                title="Scan or click to visit www.hlauae.com"
                className="ack-qr-link"
              >
                <img
                  src="/hla-qr.png"
                  alt="QR Code - www.hlauae.com"
                  style={s.qrImg}
                />
              </a>
            </div>

            {/* --- CONTACT STRIP --- */}
            <div style={s.contactStrip}>
              <div style={s.contactItem}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s.contactIcon}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>800 452 829</span>
              </div>

              <div style={s.contactItem}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s.contactIcon}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>PO BOX: 3633</span>
              </div>

              <div style={s.contactItem}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s.contactIcon}>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                </svg>
                <span>info@hlauae.com</span>
              </div>

              <div style={s.contactItem}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s.contactIcon}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>www.hlauae.com</span>
              </div>
            </div>

            {/* --- TOP DIVIDER RULE --- */}
            <div style={s.topRule} />

            {/* --- DOCUMENT TITLE --- */}
            <h1 style={s.docTitle}>
              Acknowledgement of Receipt of Company Property<br />
              and Financial Obligation Form
            </h1>

            {/* --- EMPLOYEE NAME --- */}
            <p style={s.empLine}>
              Employee Name:&nbsp;<strong>{emp.name}</strong>
            </p>

            {/* --- BODY PARAGRAPH --- */}
            <p style={s.bodyPara}>
              I hereby acknowledge receipt and assignment of the following company property. I agree
              to keep the equipment in good condition and promise to report any loss or damage
              immediately. I agree to assume all financial responsibility for damages other than
              malfunctions beyond my control. I further agree to use the said property only for
              work-related purposes during work hours.
            </p>

            {/* --- CHECKLIST ITEMS --- */}
            <div style={s.checklist}>
              {/* Row 1: Mobile Phone or Device Type */}
              <div style={s.checkRow}>
                <span style={s.checkboxSquare} />
                <span style={s.checkLabel}>{deviceLabel()}</span>
                <div style={s.underlineBox}>
                  <span style={s.checkValue}>
                    {dev.type === "phone" ? `${dev.brand} ${dev.model}` : (dev.type !== "laptop" ? `${dev.brand} ${dev.model}` : "")}
                  </span>
                </div>
              </div>

              {/* Row 2: Laptop (if laptop) or Serial Number */}
              {dev.type === "laptop" && (
                <div style={s.checkRow}>
                  <span style={s.checkboxSquare} />
                  <span style={s.checkLabel}>Laptop:</span>
                  <div style={s.underlineBox}>
                    <span style={s.checkValue}>{dev.brand} {dev.model}</span>
                  </div>
                </div>
              )}

              {/* Row 3: Serial number */}
              <div style={s.checkRow}>
                <span style={s.checkboxSquare} />
                <span style={s.checkLabel}>Serial number:</span>
                <div style={s.underlineBox}>
                  <span style={s.checkValue}>{dev.serial_number}</span>
                </div>
              </div>

              {/* Row 4: Phone number */}
              <div style={s.checkRow}>
                <span style={s.checkboxSquare} />
                <span style={s.checkLabel}>Phone number</span>
                <div style={s.underlineBox}>
                  <span style={s.checkValue}></span>
                </div>
              </div>

              {/* Row 5: Others */}
              <div style={s.checkRow}>
                <span style={s.checkboxSquare} />
                <span style={s.checkLabel}>Others</span>
                <div style={s.underlineBox}>
                  <span style={s.checkValue}>{notes || ""}</span>
                </div>
              </div>
            </div>

            {/* --- RETURN OF PROPERTY CLAUSE --- */}
            <p style={s.returnPara}>
              <strong>Return of Property:</strong> In the event of my termination from employment,
              I will return all company property (specified above or on attached sheet), upon my
              last day of work (or as specified by my supervisor). If any property is not returned,
              I authorize a reasonable value for such items to be deducted from my final paycheck.
            </p>

            {/* --- SIGNATURES --- */}
            <div style={s.sigSection}>
              {/* Employee Signature */}
              <div style={s.sigRow}>
                <div style={s.sigLeft}>
                  <span style={s.sigTitle}>Employee Signature</span>
                </div>
                <div style={s.sigRight}>
                  <span style={s.sigDate}>Date: {dateStr}</span>
                </div>
              </div>

              {/* IT Signature */}
              <div style={s.sigRow}>
                <div style={s.sigLeft}>
                  <span style={s.sigTitle}>IT Signature</span>
                </div>
                <div style={s.sigRight}>
                  <span style={s.sigDate}>Date: {dateStr}</span>
                </div>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div style={s.footer}>
              <p style={s.footerTagline}>
                Every Invoices Tells a Story, And We are Excited to be a Part of Yours
              </p>
              <div style={s.footerRule} />
              
              {/* Social Media Badges */}
              <div style={s.socialRow}>
                {/* 1. Instagram */}
                <div style={{ ...s.socialBadge, background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }} title="Instagram">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>

                {/* 2. Facebook */}
                <div style={{ ...s.socialBadge, background: "#1877f2" }} title="Facebook">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>

                {/* 3. LinkedIn */}
                <div style={{ ...s.socialBadge, background: "#0a66c2" }} title="LinkedIn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.72a1.62 1.62 0 1 0 1.62 1.62c0-.9-.72-1.62-1.62-1.62z" />
                  </svg>
                </div>

                {/* 4. TikTok - Official, Crisp Music Note */}
                <div style={{ ...s.socialBadge, background: "#000000" }} title="TikTok">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Official TikTok Note SVG Path */}
                    <path
                      d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.887 2.887 2.896 2.896 0 0 1-2.888-2.887 2.896 2.896 0 0 1 2.888-2.888c.348 0 .68.062.989.176V9.458a6.34 6.34 0 0 0-.989-.078C5.975 9.38 3 12.355 3 15.872 3 19.388 5.975 22 9.487 22c3.513 0 6.363-2.85 6.363-6.363V9.178a8.163 8.163 0 0 0 4.887 1.614V7.347a4.845 4.845 0 0 1-1.148-.661z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>

                {/* 5. X / Twitter */}
                <div style={{ ...s.socialBadge, background: "#000000" }} title="X">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>

                {/* 6. Threads */}
                <div style={{ ...s.socialBadge, background: "#000000" }} title="Threads">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12.186 24C5.452 24 0 18.625 0 12.001 0 5.376 5.452 0 12.186 0c6.643 0 11.753 5.093 11.814 11.854v.147h-3.654c-.055-4.832-3.79-8.47-8.16-8.47-4.667 0-8.527 3.824-8.527 8.47 0 4.644 3.86 8.468 8.527 8.468 3.535 0 6.44-2.222 7.734-5.385l.137-.348 3.447 1.257-.144.372C21.666 21.05 17.29 24 12.186 24zm2.148-12.87c-.33-.07-.678-.106-1.034-.106-2.158 0-3.914 1.74-3.914 3.88 0 2.138 1.756 3.878 3.914 3.878 1.54 0 2.89-.884 3.53-2.185.348-.707.545-1.554.545-2.454 0-.177-.015-.353-.041-.527l-.022-.143a4.015 4.015 0 0 0-2.978-2.343z" />
                  </svg>
                </div>

                {/* 7. YouTube */}
                <div style={{ ...s.socialBadge, background: "#ff0000" }} title="YouTube">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>{/* /contentWrapper */}

        </div>{/* /page */}
      </div>{/* /shell */}

      {/* Print media styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 12mm;
          }

          /* Reset html and body */
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide background app when printing acknowledgment */
          body.printing-ack > #root > div:not(.ack-modal-shell) {
            display: none !important;
          }

          /* Hide backdrop and toolbars */
          .ack-no-print,
          .ack-backdrop {
            display: none !important;
          }

          /* Reset modal shell so it flows naturally in print document */
          .ack-modal-shell {
            position: static !important;
            inset: auto !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }

          /* Universal visibility control */
          body * {
            visibility: hidden;
          }

          #ack-form-print,
          #ack-form-print * {
            visibility: visible !important;
          }

          /* Print page positioning */
          #ack-form-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            display: block !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            padding: 4mm 6mm !important;
            margin: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .ack-watermark {
            display: block !important;
            opacity: 0.08 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .ack-qr-link {
            text-decoration: none !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}

const s: Record<string, CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: "0",
    background: "rgba(10,18,32,0.82)",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  shell: {
    position: "fixed",
    inset: "0",
    zIndex: 1001,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 16px 60px",
  },
  toolbar: {
    width: "794px",
    maxWidth: "calc(100vw - 32px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  toolbarLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  toolbarTitle: {
    color: "#f8fafc",
    fontWeight: 600,
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
  },
  toolbarSub: {
    color: "#94a3b8",
    fontSize: "11.5px",
    fontFamily: "system-ui, sans-serif",
  },
  btnPrint: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 18px",
    background: "#0f172a",
    color: "#f8fafc",
    border: "1px solid #cda758",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    fontFamily: "system-ui, sans-serif",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    transition: "all 0.15s ease",
  },
  btnClose: {
    padding: "8px 14px",
    background: "transparent",
    color: "#cbd5e1",
    border: "1px solid #334155",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "13px",
    fontFamily: "system-ui, sans-serif",
  },
  page: {
    position: "relative",
    width: "794px",
    minHeight: "1080px",
    maxWidth: "calc(100vw - 32px)",
    background: "#ffffff",
    boxShadow: "0 8px 36px rgba(0,0,0,0.45)",
    padding: "36px 46px 32px",
    boxSizing: "border-box",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#1a1a1a",
    borderRadius: "2px",
    overflow: "hidden",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -46%)",
    width: "490px",
    pointerEvents: "none",
    opacity: 0.065,
    zIndex: 0,
    userSelect: "none",
  },
  watermarkImg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 1,
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  logoCol: {
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    height: "48px",
    width: "auto",
    objectFit: "contain",
    display: "block",
  },
  qrLink: {
    display: "inline-block",
    textDecoration: "none",
    cursor: "pointer",
    padding: "2px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  qrImg: {
    width: "68px",
    height: "68px",
    display: "block",
  },
  contactStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "11px",
    fontWeight: 500,
    color: "#2d3748",
    fontFamily: "Arial, sans-serif",
    padding: "6px 4px 4px",
  },
  contactItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  contactIcon: {
    color: "#4a5568",
  },
  topRule: {
    borderTop: "1.5px solid #1a202c",
    margin: "4px 0 16px",
  },
  docTitle: {
    textAlign: "center",
    fontSize: "16.5px",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 16px",
    lineHeight: "1.4",
    fontFamily: "Georgia, 'Times New Roman', serif",
    letterSpacing: "0.2px",
  },
  empLine: {
    fontSize: "13px",
    margin: "0 0 10px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#111827",
    lineHeight: "1.5",
  },
  bodyPara: {
    fontSize: "12.8px",
    lineHeight: "1.65",
    textAlign: "justify",
    margin: "0 0 20px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#1f2937",
  },
  checklist: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    margin: "0 0 24px 20px",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  checkboxSquare: {
    display: "inline-block",
    width: "13px",
    height: "13px",
    border: "1.5px solid #222",
    marginRight: "10px",
    flexShrink: 0,
    background: "#ffffff",
  },
  checkLabel: {
    fontSize: "13px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#111",
    width: "120px",
    flexShrink: 0,
  },
  underlineBox: {
    flex: 1,
    borderBottom: "1px solid #4a5568",
    minHeight: "18px",
    display: "flex",
    alignItems: "flex-end",
    paddingLeft: "6px",
    paddingBottom: "1px",
  },
  checkValue: {
    fontSize: "13px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#111",
    fontWeight: 600,
  },
  returnPara: {
    fontSize: "12.2px",
    lineHeight: "1.65",
    color: "#1f2937",
    margin: "0 0 46px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    textAlign: "justify",
  },
  sigSection: {
    display: "flex",
    flexDirection: "column",
    gap: "42px",
    marginBottom: "52px",
    paddingLeft: "8px",
  },
  sigRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sigLeft: {
    flex: 1,
  },
  sigRight: {
    width: "220px",
    textAlign: "left",
  },
  sigTitle: {
    fontSize: "13px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#111",
  },
  sigDate: {
    fontSize: "13px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#111",
  },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    paddingTop: "10px",
  },
  footerTagline: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#1a202c",
    margin: "0 0 6px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: "1.4",
  },
  footerRule: {
    borderTop: "1.2px solid #1a202c",
    marginBottom: "10px",
  },
  socialRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  socialBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
  },
};