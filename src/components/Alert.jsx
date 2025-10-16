export default function Alert({ open, title, message, actions = [], onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card glass" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        {message && <p className="modal-message">{message}</p>}
        <div className="modal-actions">
          {actions.length > 0 ? (
            actions.map((a, i) => (
              <button
                key={i}
                className={`btn ${a.primary ? 'btn-glow' : ''}`}
                onClick={() => {
                  a.onClick?.();
                  onClose?.();
                }}
              >
                {a.label}
              </button>
            ))
          ) : (
            <button className="btn" onClick={onClose}>Cerrar</button>
          )}
        </div>
      </div>
    </div>
  );
}
