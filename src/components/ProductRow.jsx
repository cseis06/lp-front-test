export default function ProductRow({ item, onChange, onDelete }) {
  const handleChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const subtotal = (item.cantidad || 0) * (item.precio || 0);

  return (
    <tr>
      <td>
        <input
          type="text"
          value={item.descripcion}
          placeholder="Descripción"
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />
      </td>
      <td className="num">
        <input
          type="number"
          min="0"
          step="1"
          value={item.cantidad}
          onChange={(e) => handleChange("cantidad", Math.max(0, Number(e.target.value)))}
        />
      </td>
      <td className="num">
        <input
          type="number"
          min="0"
          step="1000"
          value={item.precio}
          onChange={(e) => handleChange("precio", Math.max(0, Number(e.target.value)))}
        />
      </td>
      <td className="num mono">{subtotal.toLocaleString("es-PY")}</td>
      <td>
        <button className="icon-btn" onClick={onDelete} title="Eliminar fila">🗑️</button>
      </td>
    </tr>
  );
}
