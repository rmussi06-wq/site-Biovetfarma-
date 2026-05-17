// A cor de fundo é gerenciada pelo hook useScrollBackground em Landing.jsx
// — interpolação contínua via requestAnimationFrame.
export default function ScrollSection({ id, children, style = {} }) {
  return (
    <section
      id={id}
      className="scroll-section-inner"
      style={{ padding: '80px 40px', ...style }}
    >
      {children}
    </section>
  );
}
