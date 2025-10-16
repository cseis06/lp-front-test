import { getNextInvoiceNumber } from "../utils/invoice";

export default function Summary({ client, products, onEmit, onPrint, onDiscard }) {
  const subtotal = products.reduce(
    (acc, p) => acc + (Number(p.cantidad) || 0) * (Number(p.precio) || 0),
    0
  );
  const iva = subtotal * 0.1;
  const total = subtotal + iva;

  const formatDate = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  // Número de factura
  const invoiceNumber = getNextInvoiceNumber();

  return (
    <div className="summary">
      <div className="summary-top">
        <div className="client-info">
          <div className="row"><span className="label">Fecha</span><span className="value">{formatDate(client?.fecha)}</span></div>
          <div className="row"><span className="label">Cliente</span><span className="value">{client?.nombre || "—"}</span></div>
          <div className="row"><span className="label">RUC</span><span className="value">{client?.documento || "—"}</span></div>
          <div className="row"><span className="label">Número de factura</span><span className="value mono">{invoiceNumber}</span></div>
        </div>

        <div className="summary-totals">
          <div className="row">
            <span>Subtotal</span>
            <span className="mono">Gs. {subtotal.toLocaleString("es-PY")}</span>
          </div>
          <div className="row">
            <span>IVA 10%</span>
            <span className="mono">Gs. {iva.toLocaleString("es-PY")}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span className="mono">Gs. {total.toLocaleString("es-PY")}</span>
          </div>
        </div>
      </div>

      <div className="actions">
        {onDiscard && (
          <button className="btn" onClick={onDiscard} title="Descartar cambios">Descartar cambios</button>
        )}
        <button className="btn" onClick={onPrint}>Imprimir</button>
        <button className="btn btn-glow" onClick={onEmit}>Emitir</button>
      </div>
    </div>
  );
}
