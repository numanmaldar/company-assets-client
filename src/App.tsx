// company-assets-client/src/App.tsx
import { useEffect, useState, type FormEvent, type CSSProperties } from "react";
import {
  getEmployees, createEmployee, deleteEmployee,
  getDevices, createDevice, deleteDevice,
  getAssignments, createAssignment, returnDevice,
  type Employee, type Device, type Assignment,
} from "./api/assets";

type Tab = "assignments" | "employees" | "devices";

export default function App() {
  const [tab, setTab] = useState<Tab>("assignments");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Employee form
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empDept, setEmpDept] = useState("");
  const [empError, setEmpError] = useState("");
  const [empLoading, setEmpLoading] = useState(false);

  // Device form
  const [devType, setDevType] = useState("laptop");
  const [devBrand, setDevBrand] = useState("");
  const [devModel, setDevModel] = useState("");
  const [devSerial, setDevSerial] = useState("");
  const [devError, setDevError] = useState("");
  const [devLoading, setDevLoading] = useState(false);

  // Assignment form
  const [selEmployee, setSelEmployee] = useState("");
  const [selDevice, setSelDevice] = useState("");
  const [assignNotes, setAssignNotes] = useState("");
  const [assignError, setAssignError] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const loadAll = async () => {
    try {
      const [empRes, devRes, asnRes] = await Promise.allSettled([
        getEmployees(), getDevices(), getAssignments(),
      ]);
      if (empRes.status === "fulfilled") setEmployees(empRes.value);
      if (devRes.status === "fulfilled") setDevices(devRes.value);
      if (asnRes.status === "fulfilled") setAssignments(asnRes.value);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleAddEmployee = async (e: FormEvent) => {
    e.preventDefault();
    setEmpError("");
    setEmpLoading(true);
    try {
      await createEmployee({ employee_id: empId, name: empName, email: empEmail, department: empDept });
      setEmpId(""); setEmpName(""); setEmpEmail(""); setEmpDept("");
      await loadAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? (err as Error)?.message ?? "Failed to add employee";
      setEmpError(msg);
    } finally {
      setEmpLoading(false);
    }
  };

  const handleAddDevice = async (e: FormEvent) => {
    e.preventDefault();
    setDevError("");
    setDevLoading(true);
    try {
      await createDevice({ type: devType, brand: devBrand, model: devModel, serial_number: devSerial });
      setDevBrand(""); setDevModel(""); setDevSerial("");
      await loadAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? (err as Error)?.message ?? "Failed to add device";
      setDevError(msg);
    } finally {
      setDevLoading(false);
    }
  };

  const handleAssign = async (e: FormEvent) => {
    e.preventDefault();
    setAssignError("");
    setAssignLoading(true);
    try {
      await createAssignment({ employee_id: selEmployee, device_id: selDevice, notes: assignNotes });
      setSelEmployee(""); setSelDevice(""); setAssignNotes("");
      await loadAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Assignment failed";
      setAssignError(msg);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleReturn = async (assignmentId: string) => {
    if (!confirm("Mark this device as returned?")) return;
    try {
      await returnDevice(assignmentId);
      await loadAll();
    } catch (err) {
      alert("Failed to return device: " + ((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Error"));
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete employee "${name}"?`)) return;
    try {
      await deleteEmployee(id);
      await loadAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? (err as Error)?.message ?? "Failed to delete employee";
      alert("Failed to delete employee: " + msg);
    }
  };

  const handleDeleteDevice = async (id: string, brand: string, model: string) => {
    if (!confirm(`Are you sure you want to delete device "${brand} ${model}"?`)) return;
    try {
      await deleteDevice(id);
      await loadAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? (err as Error)?.message ?? "Failed to delete device";
      alert("Failed to delete device: " + msg);
    }
  };

  const availableDevices = devices.filter(d => d.status === "in-stock");
  const activeAssignments = assignments.filter(a => !a.returned_at);
  const history = assignments.filter(a => a.returned_at);

  // Group active assignments by employee for summary view
  const byEmployee = activeAssignments.reduce<Record<string, { emp: Assignment["employees"]; devices: Assignment[] }>>(
    (acc, a) => {
      const key = a.employees.id;
      if (!acc[key]) acc[key] = { emp: a.employees, devices: [] };
      acc[key].devices.push(a);
      return acc;
    }, {}
  );

  const s = styles;

  return (
    <div style={s.page}>
      {/* ── HLA UAE TOP HEADER ──────────────────────────── */}
      <header style={s.header}>
        <div style={s.headerTop}>
          <div style={s.brandGroup}>
            <img 
              src="/hla-logo.png" 
              alt="Holistic Legacy Accounting" 
              style={s.logoImg} 
            />
            <div style={s.brandDivider} />
            <div>
              <div style={s.brandRow}>
                <span style={s.brandBadge}>HLA UAE</span>
                <span style={s.brandPortalText}>Asset & Inventory Portal</span>
              </div>
              <div style={s.brandSubtitle}>Holistic Legacy Accounting • IT Assets Management</div>
            </div>
          </div>

          <div style={s.headerRight}>
            <div style={s.portalBadge}>
              <span>🇦🇪</span>
              <span>Enterprise IT Assets</span>
            </div>
            <a 
              href="https://www.hlauae.net/" 
              target="_blank" 
              rel="noreferrer" 
              style={s.websiteLink}
              title="Visit HLA UAE official website"
            >
              hlauae.net ↗
            </a>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav style={s.nav}>
          {(["assignments", "employees", "devices"] as Tab[]).map(t => (
            <button 
              key={t} 
              style={{ ...s.navBtn, ...(tab === t ? s.navActive : {}) }} 
              onClick={() => setTab(t)}
            >
              {t === "assignments" ? "📋 Device Assignments" : t === "employees" ? "👥 Employees Directory" : "💻 Hardware Inventory"}
            </button>
          ))}
        </nav>
      </header>

      <div style={s.content}>
        {/* ── METRICS OVERVIEW BAR ────────────────────────── */}
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statLabel}>Total Workforce</div>
            <div style={s.statValue}>{employees.length}</div>
            <div style={s.statSub}>Registered Employees</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>Total Hardware</div>
            <div style={s.statValue}>{devices.length}</div>
            <div style={s.statSub}>Registered Devices</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>Active Deployments</div>
            <div style={{ ...s.statValue, color: "#d97706" }}>{activeAssignments.length}</div>
            <div style={s.statSub}>Devices in Hand</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>Available Stock</div>
            <div style={{ ...s.statValue, color: "#059669" }}>{availableDevices.length}</div>
            <div style={s.statSub}>Ready for Handover</div>
          </div>
        </div>

        {/* ── ASSIGNMENTS TAB ─────────────────────────────── */}
        {tab === "assignments" && (
          <div style={s.tabSection}>
            {/* Assign form */}
            <section style={s.card}>
              <h2 style={s.cardTitle}>Assign Hardware to Employee</h2>
              <form onSubmit={handleAssign} style={s.form}>
                <div style={s.formRow}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Employee</label>
                    <select style={s.select} value={selEmployee} onChange={e => setSelEmployee(e.target.value)} required>
                      <option value="">— Select employee —</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          [{emp.employee_id}] {emp.name} ({emp.department || "General"})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Available Device</label>
                    <select style={s.select} value={selDevice} onChange={e => setSelDevice(e.target.value)} required>
                      <option value="">— Select device —</option>
                      {availableDevices.map(dev => (
                        <option key={dev.id} value={dev.id}>
                          {dev.brand} {dev.model} [{dev.serial_number}]
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <input style={s.input} placeholder="Notes / Handover remarks (optional)" value={assignNotes} onChange={e => setAssignNotes(e.target.value)} />
                {assignError && <p style={{ color: "#ef4444", margin: 0, fontSize: "14px" }}>⚠ {assignError}</p>}
                <button style={s.btnPrimary} type="submit" disabled={assignLoading}>
                  {assignLoading ? "Assigning..." : "Assign Device"}
                </button>
              </form>
            </section>

            {/* Active assignments by employee */}
            <section style={s.card}>
              <h2 style={s.cardTitle}>Current Hardware Holders ({activeAssignments.length} active)</h2>
              {Object.keys(byEmployee).length === 0
                ? <p style={{ color: "#94a3b8", margin: 0, padding: "12px 0" }}>No active hardware assignments currently.</p>
                : Object.values(byEmployee).map(({ emp, devices: devs }) => (
                  <div key={emp.id} style={s.empBlock}>
                    <div style={s.empHeader}>
                      <span style={s.empBadge}>{emp.employee_id}</span>
                      <strong style={{ color: "#0d2238", fontSize: "15px" }}>{emp.name}</strong>
                      <span style={{ color: "#64748b", fontSize: "13px" }}>• {emp.department || "General"}</span>
                      <span style={s.heldCounter}>{devs.length} device{devs.length > 1 ? "s" : ""}</span>
                    </div>
                    <div style={s.devList}>
                      {devs.map(a => (
                        <div key={a.id} style={s.devChip}>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>{a.devices.brand} {a.devices.model}</span>
                          <span style={s.serial}>SN: {a.devices.serial_number}</span>
                          <span style={s.typeTag}>{a.devices.type}</span>
                          <span style={{ color: "#64748b", fontSize: "12px" }}>Assigned: {new Date(a.assigned_at).toLocaleDateString()}</span>
                          {a.notes && <span style={s.notesTag}>📝 {a.notes}</span>}
                          <button style={s.returnBtn} onClick={() => handleReturn(a.id)}>Mark Returned</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </section>

            {/* History */}
            {history.length > 0 && (
              <section style={s.card}>
                <h2 style={s.cardTitle}>Return & Handover History ({history.length})</h2>
                <div style={{ overflowX: "auto" }}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        {["Employee", "Device", "Assigned Date", "Returned Date", "Remarks"].map(h => (
                          <th key={h} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(a => (
                        <tr key={a.id}>
                          <td style={s.td}><strong>{a.employees.name}</strong> <span style={{ color: "#64748b", fontSize: "12px" }}>[{a.employees.employee_id}]</span></td>
                          <td style={s.td}>{a.devices.brand} {a.devices.model}</td>
                          <td style={s.td}>{new Date(a.assigned_at).toLocaleDateString()}</td>
                          <td style={s.td}>{a.returned_at ? new Date(a.returned_at).toLocaleDateString() : "—"}</td>
                          <td style={s.td}>{a.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── EMPLOYEES TAB ─────────────────────────────── */}
        {tab === "employees" && (
          <div style={s.tabSection}>
            <section style={s.card}>
              <h2 style={s.cardTitle}>Register New Employee</h2>
              <form onSubmit={handleAddEmployee} style={s.form}>
                <div style={s.formRow}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Employee ID</label>
                    <input style={s.input} placeholder="e.g. HLA-101" value={empId} onChange={e => setEmpId(e.target.value)} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Full Name</label>
                    <input style={s.input} placeholder="e.g. Fatima Al Mansoori" value={empName} onChange={e => setEmpName(e.target.value)} required />
                  </div>
                </div>
                <div style={s.formRow}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Email Address</label>
                    <input style={s.input} type="email" placeholder="name@hlauae.net" value={empEmail} onChange={e => setEmpEmail(e.target.value)} />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Department</label>
                    <input style={s.input} placeholder="Accounting / Tax / Audit / IT" value={empDept} onChange={e => setEmpDept(e.target.value)} />
                  </div>
                </div>
                {empError && <p style={{ color: "#ef4444", margin: 0, fontSize: "14px" }}>⚠ {empError}</p>}
                <button style={s.btnPrimary} type="submit" disabled={empLoading}>
                  {empLoading ? "Registering..." : "Add Employee"}
                </button>
              </form>
            </section>

            <section style={s.card}>
              <h2 style={s.cardTitle}>Company Directory ({employees.length} Staff)</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>{["ID", "Name", "Email", "Department", "Devices Held", "Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => {
                      const held = activeAssignments.filter(a => a.employees.id === emp.id).length;
                      return (
                        <tr key={emp.id}>
                          <td style={s.td}><span style={s.empBadge}>{emp.employee_id}</span></td>
                          <td style={s.td}><strong style={{ color: "#0d2238" }}>{emp.name}</strong></td>
                          <td style={s.td}>{emp.email || "—"}</td>
                          <td style={s.td}>{emp.department || "—"}</td>
                          <td style={s.td}>{held > 0 ? <span style={{ color: "#b45309", fontWeight: 700, background: "#fef3c7", padding: "3px 8px", borderRadius: "12px", fontSize: "12px" }}>{held} device{held > 1 ? "s" : ""}</span> : <span style={{ color: "#94a3b8" }}>None</span>}</td>
                          <td style={s.td}>
                            <button
                              style={held > 0 ? { ...s.deleteBtn, opacity: 0.5, cursor: "not-allowed" } : s.deleteBtn}
                              disabled={held > 0}
                              title={held > 0 ? "Cannot delete employee while holding devices" : "Delete employee"}
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                            >
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ── DEVICES TAB ─────────────────────────────── */}
        {tab === "devices" && (
          <div style={s.tabSection}>
            <section style={s.card}>
              <h2 style={s.cardTitle}>Register New Hardware Device</h2>
              <form onSubmit={handleAddDevice} style={s.form}>
                <div style={s.formRow}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Device Category</label>
                    <select style={s.select} value={devType} onChange={e => setDevType(e.target.value)}>
                      <option value="laptop">Laptop / Workstation</option>
                      <option value="phone">Corporate Smartphone</option>
                      <option value="tablet">Tablet / iPad</option>
                      <option value="monitor">External Monitor</option>
                      <option value="other">Other Peripheral</option>
                    </select>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Brand</label>
                    <input style={s.input} placeholder="e.g. Apple, Dell, Lenovo" value={devBrand} onChange={e => setDevBrand(e.target.value)} />
                  </div>
                </div>
                <div style={s.formRow}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Model</label>
                    <input style={s.input} placeholder="e.g. MacBook Pro 16 / ThinkPad T14" value={devModel} onChange={e => setDevModel(e.target.value)} />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Serial Number</label>
                    <input style={s.input} placeholder="e.g. SN-DXB-9842" value={devSerial} onChange={e => setDevSerial(e.target.value)} required />
                  </div>
                </div>
                {devError && <p style={{ color: "#ef4444", margin: 0, fontSize: "14px" }}>⚠ {devError}</p>}
                <button style={s.btnPrimary} type="submit" disabled={devLoading}>
                  {devLoading ? "Registering..." : "Add Device"}
                </button>
              </form>
            </section>

            <section style={s.card}>
              <h2 style={s.cardTitle}>Hardware Inventory ({devices.length} Devices)</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>{["Type", "Brand / Model", "Serial Number", "Status", "Held By", "Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {devices.map(dev => {
                      const assignment = activeAssignments.find(a => a.devices.id === dev.id);
                      return (
                        <tr key={dev.id}>
                          <td style={s.td}><span style={s.typeTag}>{dev.type}</span></td>
                          <td style={s.td}><strong style={{ color: "#0d2238" }}>{dev.brand}</strong> {dev.model}</td>
                          <td style={s.td}><code style={{ fontSize: "12px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{dev.serial_number}</code></td>
                          <td style={s.td}>
                            <span style={{ ...s.statusBadge, background: dev.status === "in-stock" ? "#ecfdf5" : "#fffbeb", color: dev.status === "in-stock" ? "#047857" : "#b45309", border: dev.status === "in-stock" ? "1px solid #a7f3d0" : "1px solid #fde68a" }}>
                              {dev.status === "in-stock" ? "● In Stock" : "● Assigned"}
                            </span>
                          </td>
                          <td style={s.td}>{assignment ? <span style={{ fontWeight: 600, color: "#0d2238" }}>{assignment.employees.name} <span style={{ color: "#64748b", fontSize: "12px" }}>[{assignment.employees.employee_id}]</span></span> : <span style={{ color: "#94a3b8" }}>—</span>}</td>
                          <td style={s.td}>
                            <button
                              style={assignment ? { ...s.deleteBtn, opacity: 0.5, cursor: "not-allowed" } : s.deleteBtn}
                              disabled={!!assignment}
                              title={assignment ? "Cannot delete device while assigned" : "Delete device"}
                              onClick={() => handleDeleteDevice(dev.id, dev.brand, dev.model)}
                            >
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

// ── HLA UAE Corporate Styles ──────────────────────────────────
const styles: Record<string, CSSProperties> = {
  page:         { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  header:       { background: "linear-gradient(180deg, #0d2238 0%, #112d4a 100%)", borderTop: "3px solid #c59b27", borderBottom: "1px solid rgba(197, 155, 39, 0.3)", padding: "18px 36px 0 36px", display: "flex", flexDirection: "column", gap: "18px" },
  headerTop:    { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
  brandGroup:      { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  logoImg:         { height: "46px", width: "auto", objectFit: "contain", display: "block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" },
  brandDivider:    { width: "1px", height: "36px", background: "rgba(197, 155, 39, 0.4)", margin: "0 2px" },
  brandRow:        { display: "flex", alignItems: "center", gap: "10px" },
  brandBadge:      { background: "linear-gradient(135deg, #c59b27 0%, #dfb547 100%)", color: "#0d2238", fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.5px" },
  brandPortalText: { color: "#ffffff", fontSize: "16px", fontWeight: 700, letterSpacing: "0.3px" },
  brandSubtitle:   { color: "#94a3b8", fontSize: "12px", marginTop: "2px", letterSpacing: "0.2px" },
  headerRight:  { display: "flex", alignItems: "center", gap: "12px" },
  portalBadge:  { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "6px 14px", color: "#e2e8f0", fontSize: "12px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" },
  websiteLink:  { background: "rgba(197, 155, 39, 0.15)", border: "1px solid #c59b27", color: "#facc15", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 700, textDecoration: "none", transition: "all 0.2s" },
  nav:          { display: "flex", gap: "6px" },
  navBtn:       { padding: "10px 22px", border: "none", borderBottom: "3px solid transparent", cursor: "pointer", background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: "14px", transition: "all 0.2s" },
  navActive:    { color: "#ffffff", borderBottom: "3px solid #c59b27", background: "rgba(255,255,255,0.06)", borderRadius: "6px 6px 0 0" },
  content:      { padding: "28px 36px", display: "flex", flexDirection: "column", gap: "24px" },
  statsGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" },
  statCard:     { background: "#ffffff", padding: "16px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderTop: "3px solid #0d2238" },
  statLabel:    { fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  statValue:    { fontSize: "26px", fontWeight: 800, color: "#0d2238", margin: "4px 0" },
  statSub:      { fontSize: "12px", color: "#94a3b8" },
  tabSection:   { display: "flex", flexDirection: "column", gap: "24px" },
  card:         { background: "#ffffff", borderRadius: "10px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  cardTitle:    { margin: "0 0 18px", fontSize: "16px", fontWeight: 700, color: "#0d2238", borderLeft: "4px solid #c59b27", paddingLeft: "12px" },
  form:         { display: "flex", flexDirection: "column", gap: "14px" },
  formRow:      { display: "flex", gap: "16px", flexWrap: "wrap" },
  formGroup:    { display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "220px" },
  label:        { fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.3px" },
  input:        { padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", outline: "none", background: "#fdfefe" },
  select:       { padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", background: "#fdfefe" },
  btnPrimary:   { padding: "10px 24px", background: "linear-gradient(135deg, #0d2238 0%, #173859 100%)", color: "#ffffff", border: "1px solid #c59b27", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "14px", alignSelf: "flex-start", boxShadow: "0 2px 4px rgba(13,34,56,0.25)" },
  empBlock:     { borderLeft: "3px solid #c59b27", marginBottom: "16px", background: "#fbfcfe", padding: "16px", borderRadius: "8px", border: "1px solid #f1f5f9" },
  empHeader:    { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" },
  empBadge:     { background: "#eff6ff", color: "#0d2238", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 800 },
  heldCounter:  { marginLeft: "auto", background: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: 700 },
  devList:      { display: "flex", flexDirection: "column", gap: "8px" },
  devChip:      { display: "flex", alignItems: "center", gap: "12px", background: "#ffffff", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", flexWrap: "wrap" },
  serial:       { color: "#64748b", fontSize: "12px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" },
  typeTag:      { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, textTransform: "capitalize" },
  notesTag:     { color: "#64748b", fontSize: "12px", fontStyle: "italic" },
  returnBtn:    { marginLeft: "auto", padding: "5px 12px", background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: 700, fontSize: "12px" },
  table:        { width: "100%", borderCollapse: "collapse" },
  th:           { textAlign: "left", padding: "12px 14px", background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "12px", color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" },
  td:           { padding: "12px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "14px", verticalAlign: "middle" },
  statusBadge:  { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 },
  deleteBtn:    { padding: "5px 12px", background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: 700, fontSize: "12px" },
};