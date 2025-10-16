import { useState, useMemo } from "react";
import ProductRow from "./ProductRow";

export default function ProductTable({ products, setProducts, catalog = [] }) {
  const [query, setQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const addProduct = (prefill) => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        descripcion: prefill?.descripcion || "",
        cantidad: 1,
        precio: prefill?.precio || 0,
      },
    ]);
  };

  const updateProduct = (index, updated) => {
    const newList = [...products];
    newList[index] = updated;
    setProducts(newList);
  };

  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return catalog
      .filter((p) => p.descripcion.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query, catalog]);

  return (
    <div className="product-table">
      <div className="product-toolbar">
        <div className="search">
          <input
            type="text"
            placeholder="Buscar en catálogo (ej: 'Aire', 'Heladera')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggest(true);
            }}
            onFocus={() => setShowSuggest(true)}
            onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          />
          {showSuggest && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="suggestion"
                  onClick={() => {
                    addProduct(s);
                    setQuery("");
                    setShowSuggest(false);
                  }}
                >
                  <span className="s-desc">{s.descripcion}</span>
                  <span className="s-price">Gs. {Number(s.precio).toLocaleString("es-PY")}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-glow" onClick={() => addProduct()}>
          + Agregar producto
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th className="num">Cantidad</th>
              <th className="num">Precio</th>
              <th className="num">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <ProductRow
                key={item.id}
                item={item}
                onChange={(updated) => updateProduct(i, updated)}
                onDelete={() => deleteProduct(i)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
