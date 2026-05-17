import { useEffect, useRef } from 'react';

export default function Hero() {
  const titleRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('fade-in-up');
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" style={styles.section}>
      <div style={styles.container}>
        <div ref={titleRef} style={styles.content}>
          <div style={styles.badge}>
            <span>Farmácia Veterinária</span>
          </div>
          <h1 style={styles.title}>
            Saúde e bem-estar<br />
            <span style={styles.titleHighlight}>para o seu pet</span>
          </h1>
          <p style={styles.subtitle}>
            Medicamentos manipulados com precisão e carinho para cães, gatos e outras espécies.
            Qualidade veterinária que você pode confiar.
          </p>
          <div style={styles.ctas}>
            <button
              style={styles.primaryBtn}
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Produtos
            </button>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.secondaryBtn}
            >
              Falar com especialista
            </a>
          </div>
        </div>

        <div style={styles.illustration}>
          <div style={styles.circle1} />
          <div style={styles.circle2} />
          <div style={styles.mainCircle}>
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
              <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.15)" />
              <text x="100" y="85" textAnchor="middle" style={{ fontSize: '60px' }}>🐾</text>
              <text x="100" y="145" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="16" fill="white">
                Biovetfarma
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div style={styles.scrollIndicator} aria-hidden="true">
        <div style={styles.scrollDot} />
      </div>
    </section>
  );
}

const styles = {
  section: {
    minHeight: '100vh',
    background: 'var(--color-turquesa)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '120px 40px 60px',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    opacity: 0,
  },
  badge: {
    display: 'inline-flex',
    marginBottom: '20px',
  },
  badgeInner: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 'clamp(36px, 5vw, 60px)',
    fontWeight: 900,
    color: 'white',
    lineHeight: 1.1,
    marginBottom: '20px',
  },
  titleHighlight: {
    color: 'var(--color-verde-claro)',
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
    marginBottom: '36px',
    maxWidth: '480px',
  },
  ctas: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: 'white',
    color: 'var(--color-turquesa-dark)',
    padding: '14px 32px',
    borderRadius: '50px',
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  secondaryBtn: {
    background: 'transparent',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '50px',
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: '16px',
    border: '2px solid rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  illustration: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  mainCircle: {
    width: '280px',
    height: '280px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid rgba(255,255,255,0.3)',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(10px)',
  },
  circle1: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.1)',
    animation: 'spin 20s linear infinite',
  },
  circle2: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    border: '2px dashed rgba(255,255,255,0.08)',
    animation: 'spin 30s linear infinite reverse',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'center',
  },
  scrollDot: {
    width: '6px',
    height: '40px',
    background: 'rgba(255,255,255,0.4)',
    borderRadius: '3px',
    animation: 'pulse 2s ease-in-out infinite',
  },
};
