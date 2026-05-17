export default function ProductCard({ product }) {
  const { title, description, price, badge, imageUrl, checkoutUrl, category } = product;

  const categoryColors = {
    antiparasitarios: '#3CB3C0',
    florais: '#84C165',
    suplementos: '#9FD983',
    dermatologia: '#D6D37F',
    oncologia: '#1A7175',
    default: '#3CB3C0',
  };

  const bgColor = categoryColors[category] || categoryColors.default;

  const handleCheckout = () => {
    if (checkoutUrl) window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article style={styles.card}>
      <div style={{ ...styles.imageWrapper, background: bgColor }}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={{ fontSize: '48px' }}>🐾</span>
          </div>
        )}
        {badge && (
          <div style={styles.badge}>
            <span style={styles.badgeText}>{badge}</span>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        {description && <p style={styles.description}>{description}</p>}

        <div style={styles.footer}>
          {price && <span style={styles.price}>{price}</span>}
          <button
            style={styles.btn}
            onClick={handleCheckout}
            disabled={!checkoutUrl}
            aria-label={`Comprar ${title}`}
          >
            {checkoutUrl ? 'Comprar' : 'Indisponível'}
          </button>
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: {
    minWidth: '240px',
    maxWidth: '260px',
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    flexShrink: 0,
    transition: 'transform 0.3s, box-shadow 0.3s',
    scrollSnapAlign: 'start',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '20px',
  },
  image: {
    width: '140px',
    height: '140px',
    objectFit: 'contain',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
  },
  imagePlaceholder: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'white',
    borderRadius: '50px',
    padding: '4px 10px',
  },
  badgeText: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#333',
    fontFamily: 'var(--font-title)',
  },
  content: {
    padding: '16px',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: '15px',
    color: 'var(--color-text)',
    marginBottom: '6px',
    lineHeight: 1.3,
  },
  description: {
    fontSize: '12px',
    color: '#666',
    lineHeight: 1.5,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  price: {
    fontFamily: 'var(--font-title)',
    fontWeight: 900,
    fontSize: '16px',
    color: 'var(--color-turquesa-dark)',
  },
  btn: {
    background: 'var(--color-turquesa)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: 'var(--font-body)',
  },
};
