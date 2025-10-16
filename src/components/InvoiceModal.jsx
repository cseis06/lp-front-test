import { useEffect } from "react";
import { getNextInvoiceNumber } from "../utils/invoice";

export default function InvoiceModal({ open, invoice, onClose, onAfterOpen }) {
  useEffect(() => {
    if (open) {
      onAfterOpen?.();
    }
  }, [open, onAfterOpen]);

  if (!open || !invoice) return null;

  const { client, products, totals, createdAt } = invoice;

  // Número de factura
  const invoiceNumber = getNextInvoiceNumber();

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card glass" onClick={(e) => e.stopPropagation()}>
        <div className="summary-header" style={{ marginBottom: 18 }}>
          <div>
            <div className="muted">Factura <span className="mono">{invoiceNumber}</span></div>
            <div className="summary-client muted">{client?.nombre || "—"} {client?.documento ? `· ${client.documento}` : ""}</div>
          </div>
          <div className="muted" style={{ textAlign: "right" }}>
            <div>{client?.fecha || ""}</div>
            <div>{new Date(createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 6 }}>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th className="qty">Cantidad</th>
                <th className="num">Precio</th>
                <th className="num">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const subtotal = (Number(p.cantidad) || 0) * (Number(p.precio) || 0);
                return (
                  <tr key={p.id}>
                    <td>{p.descripcion}</td>
                    <td className="qty">{p.cantidad}</td>
                    <td className="num mono">Gs. {Number(p.precio).toLocaleString("es-PY")}</td>
                    <td className="num mono">Gs. {subtotal.toLocaleString("es-PY")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="summary-totals" style={{ marginTop: 12 }}>
          <div className="row">
            <span>Subtotal</span>
            <span className="mono">Gs. {Number(totals.subtotal).toLocaleString("es-PY")}</span>
          </div>
          <div className="row">
            <span>IVA 10%</span>
            <span className="mono">Gs. {Number(totals.iva).toLocaleString("es-PY")}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span className="mono">Gs. {Number(totals.total).toLocaleString("es-PY")}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
