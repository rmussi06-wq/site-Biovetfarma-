import { useEffect, useRef } from 'react';

export default function ScrollSection({ id, bgColor, children, style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.style.backgroundColor = bgColor;
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [bgColor]);

  return (
    <section
      id={id}
      ref={ref}
      data-bg={bgColor}
      className="scroll-section-inner"
      style={{
        padding: '80px 40px',
        transition: 'background-color 0.8s ease',
        ...style,
      }}
    >
      {children}
    </section>
  );
}
