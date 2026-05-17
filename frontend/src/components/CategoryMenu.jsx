const CATEGORIES = [
  { id: 'todos', name: 'Todos', color: '#3CB3C0' },
  { id: 'antiparasitarios', name: 'Antiparasitários', color: '#1A7175' },
  { id: 'florais', name: 'Florais de Bach', color: '#84C165' },
  { id: 'suplementos', name: 'Suplementos', color: '#9FD983' },
  { id: 'dermatologia', name: 'Dermatologia', color: '#D6D37F' },
  { id: 'oncologia', name: 'Oncologia', color: '#1A7175' },
];

export default function CategoryMenu({ active, onSelect }) {
  return (
    <nav aria-label="Categorias de produtos" style={styles.nav}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          style={{
            ...styles.btn,
            background: active === cat.id ? cat.color : 'rgba(255,255,255,0.2)',
            color: active === cat.id ? 'white' : 'var(--color-text)',
            transform: active === cat.id ? 'rotate(-2deg) scale(1.05)' : 'none',
            boxShadow: active === cat.id ? '0 4px 15px rgba(0,0,0,0.15)' : 'none',
          }}
          onClick={() => onSelect(cat.id)}
          aria-pressed={active === cat.id}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}

export { CATEGORIES };

const styles = {
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '32px',
  },
  btn: {
    padding: '8px 20px',
    borderRadius: '50px',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
  },
};
