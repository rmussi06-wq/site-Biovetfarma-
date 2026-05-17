import { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase.js';

export default function ProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'products', id));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (id, active) => {
    await updateDoc(doc(db, 'products', id), { active: !active });
  };

  if (loading) {
    return <p style={styles.loading}>Carregando produtos...</p>;
  }

  if (products.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={{ fontSize: '48px' }}>📦</span>
        <p>Nenhum produto cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.count}>{products.length} produto{products.length !== 1 ? 's' : ''}</p>
      <div style={styles.table}>
        <div style={styles.thead}>
          <span>Produto</span>
          <span>Categoria</span>
          <span>Preço</span>
          <span>Status</span>
          <span>Ações</span>
        </div>
        {products.map((p) => (
          <div key={p.id} style={{ ...styles.row, opacity: deletingId === p.id ? 0.4 : 1 }}>
            <div style={styles.productCell}>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} style={styles.thumb} />
              )}
              <div>
                <p style={styles.productName}>{p.title}</p>
                {p.badge && <span style={styles.badge}>{p.badge}</span>}
              </div>
            </div>
            <span style={styles.cell}>{p.category || '—'}</span>
            <span style={styles.cell}>{p.price || '—'}</span>
            <div style={styles.cell}>
              <button
                style={{ ...styles.statusBtn, background: p.active ? '#e8f8e8' : '#f8e8e8', color: p.active ? '#27ae60' : '#c0392b' }}
                onClick={() => toggleActive(p.id, p.active)}
                aria-label={p.active ? 'Desativar produto' : 'Ativar produto'}
              >
                {p.active ? 'Ativo' : 'Inativo'}
              </button>
            </div>
            <div style={{ ...styles.cell, display: 'flex', gap: '8px' }}>
              <button style={styles.editBtn} onClick={() => onEdit(p)} aria-label={`Editar ${p.title}`}>
                Editar
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(p.id, p.title)}
                disabled={deletingId === p.id}
                aria-label={`Excluir ${p.title}`}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {},
  count: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '16px',
  },
  loading: {
    color: '#888',
    padding: '40px',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  table: {
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'white',
  },
  thead: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    padding: '12px 20px',
    background: '#f5f5f5',
    fontSize: '12px',
    fontWeight: 700,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    gap: '12px',
    borderBottom: '1px solid #e0e0e0',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    padding: '14px 20px',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #f0f0f0',
    transition: 'opacity 0.3s',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  thumb: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    objectFit: 'cover',
    background: '#f0f0f0',
    flexShrink: 0,
  },
  productName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#222',
    lineHeight: 1.3,
  },
  badge: {
    fontSize: '11px',
    background: 'var(--color-verde-claro)',
    color: 'var(--color-turquesa-dark)',
    padding: '2px 8px',
    borderRadius: '50px',
    fontWeight: 600,
    display: 'inline-block',
    marginTop: '2px',
  },
  cell: {
    fontSize: '13px',
    color: '#555',
  },
  statusBtn: {
    border: 'none',
    borderRadius: '50px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  editBtn: {
    background: 'var(--color-turquesa)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  deleteBtn: {
    background: 'none',
    color: '#c0392b',
    border: '1px solid #ffd5d5',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
};
