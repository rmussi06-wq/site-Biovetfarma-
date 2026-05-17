import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, firebaseConfigured } from '../firebase.js';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import ScrollSection from '../components/ScrollSection.jsx';
import AboutSection from '../components/AboutSection.jsx';
import CategoryMenu, { CATEGORIES } from '../components/CategoryMenu.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import Footer from '../components/Footer.jsx';

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');

  useEffect(() => {
    if (!firebaseConfigured) return;
    const q = query(
      collection(db, 'products'),
      where('active', '==', true),
      orderBy('order')
    );
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const filtered = activeCategory === 'todos'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <ScrollSection id="sobre" bgColor="#CFF9B9" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AboutSection />
        </ScrollSection>

        <ScrollSection id="produtos" bgColor="#9FD983">
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <div style={styles.pill}>Produtos</div>
              <h2 style={styles.sectionTitle}>Nossos medicamentos</h2>
              <p style={styles.sectionSubtitle}>
                Fórmulas manipuladas com precisão para o bem-estar do seu pet.
              </p>
            </div>

            <CategoryMenu active={activeCategory} onSelect={setActiveCategory} />

            {filtered.length === 0 && products.length > 0 && (
              <p style={styles.noProducts}>Nenhum produto nesta categoria ainda.</p>
            )}

            {filtered.length > 0 && (
              <ProductCarousel
                products={filtered}
                category={activeCategory}
              />
            )}

            {products.length === 0 && (
              <div style={styles.loadingProducts}>
                <div style={styles.spinner} />
                <p>Carregando produtos...</p>
              </div>
            )}
          </div>
        </ScrollSection>

        <ScrollSection id="categorias" bgColor="#84C165">
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <div style={{ ...styles.pill, background: 'rgba(255,255,255,0.3)' }}>Categorias</div>
              <h2 style={{ ...styles.sectionTitle, color: 'white' }}>
                Encontre pelo tipo
              </h2>
            </div>
            <div style={styles.catGrid}>
              {CATEGORIES.filter((c) => c.id !== 'todos').map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    style={styles.catCard}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label={`Ver produtos de ${cat.name}`}
                  >
                    <span style={styles.catName}>{cat.name}</span>
                    {count > 0 && (
                      <span style={styles.catCount}>{count} produto{count !== 1 ? 's' : ''}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollSection>

        <ScrollSection id="footer-section" bgColor="#FEFED3" style={{ padding: 0 }}>
          <Footer />
        </ScrollSection>
      </main>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionHeader: {
    marginBottom: '40px',
  },
  pill: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.4)',
    color: 'var(--color-text)',
    padding: '6px 18px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '12px',
    transform: 'rotate(-2deg)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: 'clamp(26px, 4vw, 40px)',
    fontWeight: 900,
    color: 'var(--color-text)',
    marginBottom: '10px',
    lineHeight: 1.2,
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: 'rgba(0,0,0,0.6)',
    maxWidth: '480px',
  },
  noProducts: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: '15px',
    padding: '30px 0',
  },
  loadingProducts: {
    textAlign: 'center',
    padding: '60px 0',
    color: 'rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid rgba(0,0,0,0.1)',
    borderTop: '3px solid var(--color-turquesa-dark)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  catCard: {
    background: 'rgba(255,255,255,0.25)',
    border: '2px solid rgba(255,255,255,0.4)',
    borderRadius: '16px',
    padding: '24px 20px',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    backdropFilter: 'blur(8px)',
  },
  catName: {
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: '16px',
    color: 'white',
  },
  catCount: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
  },
};
