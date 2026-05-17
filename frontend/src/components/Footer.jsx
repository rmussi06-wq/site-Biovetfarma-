export default function Footer() {
  return (
    <footer id="contato" style={styles.footer}>
      <div className="footer-grid">
        <div className="footer-brand">
          <p style={styles.logo}>
            <span style={{ color: 'var(--color-turquesa-dark)' }}>BIOVET</span>
            <span style={{ color: 'var(--color-verde)' }}>FARMA</span>
          </p>
          <p style={styles.tagline}>Manipulação Veterinária</p>
          <p style={styles.desc}>
            Cuidando da saúde dos seus pets com ciência, carinho e responsabilidade.
          </p>
        </div>

        <div>
          <h4 style={styles.colTitle}>Contato</h4>
          <ul style={styles.list}>
            <li>
              <a href="https://wa.me/5500000000000" style={styles.link} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:contato@biovetfarma.com.br" style={styles.link}>
                contato@biovetfarma.com.br
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={styles.colTitle}>Redes Sociais</h4>
          <ul style={styles.list}>
            <li>
              <a href="https://instagram.com/biovetfarma" style={styles.link} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com/biovetfarma" style={styles.link} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={styles.colTitle}>Navegação</h4>
          <ul style={styles.list}>
            {['hero', 'sobre', 'produtos', 'categorias'].map((id) => (
              <li key={id}>
                <button
                  style={styles.navBtn}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {id === 'hero' ? 'Início' : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p style={styles.copy}>
          © {new Date().getFullYear()} Biovetfarma — Manipulação Veterinária. Todos os direitos reservados.
        </p>
        <p style={styles.cfmv}>
          Consulte sempre um médico veterinário.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'var(--color-creme)',
    padding: '60px 40px 0',
  },
  logo: {
    fontFamily: 'var(--font-title)',
    fontWeight: 900,
    fontSize: '28px',
    marginBottom: '4px',
  },
  tagline: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: '#888',
    marginBottom: '12px',
  },
  desc: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.6,
    maxWidth: '260px',
  },
  colTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--color-text)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    fontSize: '14px',
    color: '#555',
    textDecoration: 'none',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#555',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'var(--font-body)',
  },
  copy: {
    fontSize: '13px',
    color: '#888',
  },
  cfmv: {
    fontSize: '12px',
    color: '#aaa',
  },
};
