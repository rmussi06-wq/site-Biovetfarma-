import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'hero', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'produtos', label: 'Produtos' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'contato', label: 'Contato' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={styles.nav(scrolled)}>
        <div style={styles.pill}>
          <button style={styles.logoBtn} onClick={() => scrollTo('hero')} aria-label="Ir para o início">
            <span style={styles.logoText}>BIOVET</span>
            <span style={{ ...styles.logoText, color: 'var(--color-verde)' }}>FARMA</span>
          </button>

          <ul style={styles.navLinks}>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button style={styles.navLink} onClick={() => scrollTo(s.id)}>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          <div style={styles.actions}>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.whatsappBtn}
              aria-label="WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            <button
              style={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span style={styles.bar(menuOpen, 0)} />
              <span style={styles.bar(menuOpen, 1)} />
              <span style={styles.bar(menuOpen, 2)} />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileTop}>
            {SECTIONS.map((s) => (
              <button key={s.id} style={styles.mobileLink} onClick={() => scrollTo(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <div style={styles.mobileBottom}>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mobileWhatsapp}
            >
              Fale no WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: (scrolled) => ({
    position: 'fixed',
    top: scrolled ? '12px' : '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    width: '90%',
    maxWidth: '900px',
  }),
  pill: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--color-white)',
    borderRadius: '50px',
    padding: '10px 20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
  logoBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    gap: '2px',
    cursor: 'pointer',
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontWeight: 900,
    fontSize: '18px',
    color: 'var(--color-turquesa-dark)',
    lineHeight: 1,
  },
  navLinks: {
    display: 'flex',
    gap: '4px',
    listStyle: 'none',
    '@media (max-width: 768px)': { display: 'none' },
  },
  navLink: {
    background: 'none',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '20px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  whatsappBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--color-verde)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: 600,
    transition: 'background 0.2s',
    textDecoration: 'none',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '4px',
    cursor: 'pointer',
  },
  bar: (open, i) => ({
    display: 'block',
    width: '22px',
    height: '2px',
    background: 'var(--color-text)',
    borderRadius: '2px',
    transition: 'all 0.3s',
    transform: open
      ? i === 0 ? 'rotate(45deg) translateY(7px)' : i === 1 ? 'scaleX(0)' : 'rotate(-45deg) translateY(-7px)'
      : 'none',
    opacity: open && i === 1 ? 0 : 1,
  }),
  mobileMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
  },
  mobileTop: {
    flex: 1,
    background: 'var(--color-turquesa-dark)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    padding: '80px 40px 40px',
  },
  mobileBottom: {
    background: 'var(--color-verde)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  mobileLink: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '28px',
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  mobileWhatsapp: {
    color: 'white',
    fontSize: '20px',
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    textDecoration: 'none',
  },
};
