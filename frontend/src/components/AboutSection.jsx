import { useEffect, useRef } from 'react';

const DIFERENCIAIS = [
  {
    icon: '🔬',
    title: 'Manipulação especializada',
    text: 'Fórmulas desenvolvidas por farmacêuticos veterinários com expertise em cada espécie.',
  },
  {
    icon: '🐾',
    title: 'Para todas as espécies',
    text: 'Cães, gatos, aves, répteis e animais exóticos. Temos a fórmula certa para cada um.',
  },
  {
    icon: '🚚',
    title: 'Entrega rápida',
    text: 'Enviamos para todo o Brasil com embalagem segura e rastreamento em tempo real.',
  },
  {
    icon: '👨‍⚕️',
    title: 'Equipe qualificada',
    text: 'Farmacêuticos e veterinários prontos para orientar você na escolha do medicamento ideal.',
  },
];

export default function AboutSection() {
  const itemRefs = useRef([]);

  useEffect(() => {
    const observers = itemRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('fade-in-up'), i * 120);
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.pill}>Sobre nós</div>
        <h2 style={styles.title}>
          A farmácia veterinária<br />que cuida do seu pet
        </h2>
        <p style={styles.subtitle}>
          A Biovetfarma é especializada em manipulação veterinária, oferecendo medicamentos
          de alta qualidade com atendimento personalizado para tutores e médicos veterinários.
        </p>
      </div>

      <div style={styles.grid}>
        {DIFERENCIAIS.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            style={{ ...styles.card, opacity: 0 }}
          >
            <span style={styles.icon} aria-hidden="true">{item.icon}</span>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardText}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  pill: {
    display: 'inline-block',
    background: 'var(--color-turquesa)',
    color: 'white',
    padding: '6px 20px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
    transform: 'rotate(-2deg)',
  },
  title: {
    fontSize: 'clamp(28px, 4vw, 44px)',
    fontWeight: 900,
    color: 'var(--color-text)',
    lineHeight: 1.2,
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    lineHeight: 1.7,
    maxWidth: '560px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  icon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '16px',
  },
  cardTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: '17px',
    color: 'var(--color-text)',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.6,
  },
};
