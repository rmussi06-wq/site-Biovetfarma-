import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.js';
import ImageUpload from './ImageUpload.jsx';
import { CATEGORIES } from '../CategoryMenu.jsx';

const EMPTY = {
  title: '',
  description: '',
  price: '',
  badge: '',
  category: 'antiparasitarios',
  checkoutUrl: '',
  imageUrl: '',
  active: true,
  order: 0,
};

export default function ProductForm({ product, onDone }) {
  const isEdit = !!product?.id;
  const [data, setData] = useState(isEdit ? product : EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));
  const setImg = (url) => setData((d) => ({ ...d, imageUrl: url }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.title.trim()) { setError('Título é obrigatório.'); return; }
    setError('');
    setSaving(true);
    try {
      const payload = { ...data, updatedAt: serverTimestamp() };
      if (isEdit) {
        await updateDoc(doc(db, 'products', product.id), payload);
      } else {
        await addDoc(collection(db, 'products'), { ...payload, createdAt: serverTimestamp() });
      }
      onDone();
    } catch {
      setError('Erro ao salvar produto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const cats = CATEGORIES.filter((c) => c.id !== 'todos');

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <h2 style={styles.heading}>{isEdit ? 'Editar produto' : 'Novo produto'}</h2>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Título *</label>
          <input style={styles.input} value={data.title} onChange={set('title')} placeholder="Ex: Ivermectina 1%" required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Preço</label>
          <input style={styles.input} value={data.price} onChange={set('price')} placeholder="R$ 38,90" />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Descrição</label>
        <textarea style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }} value={data.description} onChange={set('description')} placeholder="Breve descrição do produto..." />
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Categoria</label>
          <select style={styles.input} value={data.category} onChange={set('category')}>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Badge (ex: 10ml, 30cp)</label>
          <input style={styles.input} value={data.badge} onChange={set('badge')} placeholder="10ml" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Ordem</label>
          <input style={styles.input} type="number" value={data.order} onChange={(e) => setData((d) => ({ ...d, order: Number(e.target.value) }))} min={0} />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Link de checkout</label>
        <input style={styles.input} type="url" value={data.checkoutUrl} onChange={set('checkoutUrl')} placeholder="https://..." />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Imagem do produto</label>
        <ImageUpload onUpload={setImg} currentUrl={data.imageUrl} />
      </div>

      <div style={styles.checkRow}>
        <label style={styles.checkLabel}>
          <input
            type="checkbox"
            checked={data.active}
            onChange={(e) => setData((d) => ({ ...d, active: e.target.checked }))}
            style={styles.checkbox}
          />
          Produto ativo (visível na landing page)
        </label>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.actions}>
        <button type="button" style={styles.cancelBtn} onClick={onDone} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" style={styles.saveBtn} disabled={saving}>
          {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar produto'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '700px',
  },
  heading: {
    fontFamily: 'var(--font-title)',
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '4px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#555',
    fontFamily: 'var(--font-body)',
  },
  input: {
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
    background: 'white',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#444',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--color-turquesa)',
  },
  error: {
    color: '#c0392b',
    fontSize: '13px',
    background: '#fff0f0',
    padding: '10px 14px',
    borderRadius: '8px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelBtn: {
    background: 'none',
    border: '2px solid #e0e0e0',
    borderRadius: '50px',
    padding: '10px 24px',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    color: '#666',
  },
  saveBtn: {
    background: 'var(--color-turquesa)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'var(--font-title)',
    cursor: 'pointer',
    transition: 'background 0.2s, opacity 0.2s',
  },
};
