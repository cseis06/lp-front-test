import { useState, useEffect } from "react";
import Header from "./components/Header";
import ClientForm from "./components/ClientForm";
import ProductTable from "./components/ProductTable";
import Summary from "./components/Summary";
import Alert from "./components/Alert";
import InvoiceModal from "./components/InvoiceModal";
import "./styles.css";
import catalog from "../productos.json";

function App() {
  const [client, setClient] = useState(() => {
    const saved = localStorage.getItem("invoice_draft_client");
    return saved
      ? JSON.parse(saved)
      : { nombre: "", documento: "", fecha: new Date().toISOString().slice(0, 10) };
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("invoice_draft_products");
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("invoice_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [alert, setAlert] = useState({ open: false, title: "", message: "", actions: [] });
  const [preview, setPreview] = useState({ open: false, invoice: null, autoPrint: false });
  const [originalDraft, setOriginalDraft] = useState(null); // snapshot para descartar cambios

  // Persistencia
  useEffect(() => {
    localStorage.setItem("invoice_draft_client", JSON.stringify(client));
  }, [client]);
  useEffect(() => {
    localStorage.setItem("invoice_draft_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("invoice_history", JSON.stringify(history));
  }, [history]);

  // Cuando el modal de factura está abierto, agregamos una clase al body para ajustar impresión
  useEffect(() => {
    const cls = "print-modal-open";
    if (preview.open) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => document.body.classList.remove(cls);
  }, [preview.open]);

  const computeTotals = () => {
    const subtotal = products.reduce(
      (acc, p) => acc + (Number(p.cantidad) || 0) * (Number(p.precio) || 0),
      0
    );
    const iva = subtotal * 0.1;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  // Utilidad: detectar si hay cambios en el borrador actual
  const isDirty = () => {
    const hasClient = (client?.nombre?.trim() || client?.documento?.trim() || "") !== "";
    const hasProducts = products.length > 0;
    return hasClient || hasProducts;
  };

  // Nueva factura con confirmación si hay cambios sin emitir
  const handleNew = () => {
    const doReset = () => {
      setClient({ nombre: "", documento: "", fecha: new Date().toISOString().slice(0, 10) });
      setProducts([]);
      setOriginalDraft(null);
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { window.scrollTo(0, 0); }
    };
    if (isDirty()) {
      setAlert({
        open: true,
        title: "Descartar cambios",
        message: "Tienes cambios sin emitir. Si continúas, se descartarán.",
        actions: [
          { label: "Cancelar" },
          { label: "Aceptar", primary: true, onClick: doReset },
        ],
      });
    } else {
      doReset();
    }
  };

  const handleEmit = () => {
    const { total } = computeTotals();
    // fecha no futura
    const today = new Date().toISOString().slice(0, 10);
    if (client.fecha && client.fecha > today) {
      setAlert({
        open: true,
        title: "Fecha inválida",
        message: "La fecha no puede ser futura.",
        actions: [{ label: "Corregir", primary: true }],
      });
      return;
    }
    if (!client.nombre) {
      setAlert({
        open: true,
        title: "Falta información",
        message: "Por favor, ingrese el nombre del cliente.",
        actions: [{ label: "Entendido", primary: true }],
      });
      return;
    }
    if (products.length === 0) {
      setAlert({
        open: true,
        title: "Sin productos",
        message: "Agregue al menos un producto para emitir la factura.",
        actions: [{ label: "Agregar producto", primary: true }],
      });
      return;
    }
    const invoice = {
      id: Date.now(),
      client,
      products,
      totals: computeTotals(),
      createdAt: new Date().toISOString(),
    };
    setHistory([invoice, ...history]);
    setAlert({
      open: true,
      title: "Factura emitida",
      message: `Factura emitida para ${client.nombre}. Total: Gs. ${total.toLocaleString("es-PY")}`,
      actions: [{ label: "OK", primary: true }],
    });
    // limpiar para nueva factura
    setClient({ nombre: "", documento: "", fecha: new Date().toISOString().slice(0, 10) });
    setProducts([]);
    setOriginalDraft(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const viewInvoice = (inv) => {
    setPreview({ open: true, invoice: inv, autoPrint: false });
  };

  const printInvoice = (inv) => {
    setPreview({ open: true, invoice: inv, autoPrint: true });
  };

  const restoreInvoice = (inv) => {
    // Guardamos snapshot para poder descartar cambios
    setOriginalDraft({ client, products });
    setClient(inv.client);
    setProducts(inv.products);
    // Llevar la vista al inicio para editar cómodamente
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  // Descartar cambios: vuelve al snapshot si existe; si no, limpia
  const discardChanges = () => {
    if (originalDraft) {
      setClient(originalDraft.client);
      setProducts(originalDraft.products);
      setOriginalDraft(null);
    } else {
      setClient({ nombre: "", documento: "", fecha: new Date().toISOString().slice(0, 10) });
      setProducts([]);
    }
  };

  const confirmDiscardChanges = () => {
    if (!isDirty()) return; // nada para descartar
    setAlert({
      open: true,
      title: "Descartar cambios",
      message: "Esta acción revertirá los cambios no emitidos.",
      actions: [
        { label: "Cancelar" },
        { label: "Aceptar", primary: true, onClick: discardChanges },
      ],
    });
  };

  return (
    <div className="app-container">
      <Alert
        open={alert.open}
        title={alert.title}
        message={alert.message}
        actions={alert.actions}
        onClose={() => setAlert((a) => ({ ...a, open: false }))}
      />
      <Header />
      <div className="grid-layout">
        <section className="card glass">
          <ClientForm client={client} setClient={setClient} />
        </section>
        <section className="card glass">
          <ProductTable products={products} setProducts={setProducts} catalog={catalog} />
        </section>
        <section className="card glass">
          <Summary
            client={client}
            products={products}
            onEmit={handleEmit}
            onPrint={handlePrint}
            onDiscard={confirmDiscardChanges}
          />
        </section>
        <section className="card glass history">
          <h3>Historial de facturas</h3>
          <div className="history-list">
            {history.length === 0 && <p className="muted">No hay facturas aún.</p>}
            {history.map((inv) => (
              <div key={inv.id} className="history-item">
                <div>
                  <div className="history-title">{inv.client.nombre}</div>
                  <div className="history-meta">
                    <span>{new Date(inv.createdAt).toLocaleString()}</span>
                    <span> · {inv.products.length} items</span>
                    <span>
                      {" "}· Total Gs. {inv.totals.total.toLocaleString("es-PY")}
                    </span>
                  </div>
                </div>
                <div className="history-actions">
                  <button className="btn" onClick={() => restoreInvoice(inv)}>Modificar</button>
                  <button className="btn" onClick={() => viewInvoice(inv)}>Ver</button>
                  <button className="btn btn-glow" onClick={() => printInvoice(inv)}>Imprimir</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <InvoiceModal
        open={preview.open}
        invoice={preview.invoice}
        onClose={() => setPreview({ open: false, invoice: null, autoPrint: false })}
        onAfterOpen={() => {
          if (preview.autoPrint) {
            setTimeout(() => window.print(), 100);
          }
        }}
      />

      <button className="fab" aria-label="Nueva factura" title="Nueva factura" onClick={handleNew}>＋</button>
    </div>
  );
}

export default App;
