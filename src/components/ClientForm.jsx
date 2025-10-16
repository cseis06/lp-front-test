export default function ClientForm({ client, setClient }) {
  const update = (field, value) => setClient({ ...client, [field]: value });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="client-form">
      <div className="field">
        <label>Nombre</label>
        <input
          type="text"
          value={client.nombre}
          placeholder="Nombre del cliente"
          onChange={(e) => update("nombre", e.target.value)}
        />
      </div>
      <div className="field">
        <label>Documento (RUC/CI)</label>
        <input
          type="text"
          value={client.documento}
          placeholder="RUC o CI"
          onChange={(e) => update("documento", e.target.value)}
        />
      </div>
      <div className="field">
        <label>Fecha</label>
        <input
          type="date"
          value={client.fecha}
          max={today}
          onChange={(e) => update("fecha", e.target.value)}
        />
      </div>
    </div>
  );
}
