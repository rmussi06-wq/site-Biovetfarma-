import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase.js';
import LoginForm from '../components/admin/LoginForm.jsx';
import ProductList from '../components/admin/ProductList.jsx';
import ProductForm from '../components/admin/ProductForm.jsx';

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const [view, setView] = useState('list');
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  if (user === undefined) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) return <LoginForm />;

  const handleEdit = (product) => {
    setEditProduct(product);
    setView('form');
  };

  const handleNew = () => {
    setEditProduct(null);
    setView('form');
  };

  const handleDone = () => {
    setEditProduct(null);
    setView('list');
  };

  const handleLogout = async () => {
    if (confirm('Deseja sair do painel?')) {
      await signOut(auth);
    }
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <p style={styles.logo}>
              <span style={{ color: 'var(--color-turquesa-dark)' }}>BIOVET</span>
              <span style={{ color: 'var(--color-verde)' }}>FARMA</span>
            </p>
            <span style={styles.adminLabel}>Painel Admin</span>
          </div>
          <div style={styles.headerActions}>
            <a href="/" style={styles.siteLink} target="_blank" rel="noopener noreferrer">
              Ver site
            </a>
            <button onClick={handleLogout} style={styles.logoutBtn} aria-label="Sair">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          {view === 'list' && (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Produtos</h1>
                <button style={styles.newBtn} onClick={handleNew}>
                  + Novo produto
                </button>
              </div>
              <ProductList onEdit={handleEdit} />
            </>
          )}

          {view === 'form' && (
            <ProductForm product={editProduct} onDone={handleDone} />
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'var(--font-body)',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f5f5',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e0e0e0',
    borderTop: '3px solid var(--color-turquesa)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  header: {
    background: 'white',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontFamily: 'var(--font-title)',
    fontWeight: 900,
    fontSize: '20px',
    lineHeight: 1,
  },
  adminLabel: {
    background: 'var(--color-verde-claro)',
    color: 'var(--color-turquesa-dark)',
    padding: '3px 10px',
    borderRadius: '50px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  siteLink: {
    color: 'var(--color-turquesa)',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '7px 16px',
    fontSize: '13px',
    color: '#666',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  main: {
    padding: '40px 24px',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  pageTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  newBtn: {
    background: 'var(--color-turquesa)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'var(--font-title)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
