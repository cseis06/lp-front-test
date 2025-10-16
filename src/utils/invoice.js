export function getNextInvoiceNumber() {
  try {
    const raw = localStorage.getItem("invoice_history");
    const list = raw ? JSON.parse(raw) : [];
    const next = (Array.isArray(list) ? list.length : 0) + 1;
    return `001-001-${String(next).padStart(6, "0")}`;
  } catch {
    return "001-001-000001";
  }
}
