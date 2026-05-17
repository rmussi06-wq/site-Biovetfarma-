import { useRef } from 'react';
import ProductCard from './ProductCard.jsx';

export default function ProductCarousel({ products, category }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (!products || products.length === 0) {
    return (
      <div style={styles.empty}>
        <p>Produtos em breve...</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper} aria-label={`Carrossel de ${category}`}>
      <button
        style={styles.arrow('left')}
        onClick={() => scroll(-1)}
        aria-label="Produto anterior"
      >
        ‹
      </button>

      <div ref={trackRef} style={styles.track} tabIndex={0}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <button
        style={styles.arrow('right')}
        onClick={() => scroll(1)}
        aria-label="Próximo produto"
      >
        ›
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  track: {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    padding: '10px 4px',
    flex: 1,
  },
  arrow: (side) => ({
    flexShrink: 0,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'white',
    border: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-turquesa-dark)',
    fontWeight: 700,
    transition: 'box-shadow 0.2s, transform 0.2s',
    lineHeight: 1,
  }),
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '16px',
  },
};
