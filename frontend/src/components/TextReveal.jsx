import { useEffect, useRef } from 'react';

/**
 * Text Reveal Effect clássico:
 * O texto sobe a partir de uma linha invisível (overflow hidden no wrapper).
 * Só usado em títulos — em outros blocos o texto fica normal.
 *
 * Props:
 *   children — conteúdo a revelar
 *   delay    — ms de delay antes de animar (para escalonamento entre linhas)
 *   as       — tag do wrapper externo (default: 'div')
 */
export default function TextReveal({ children, delay = 0, as: Tag = 'div', style = {}, className = '' }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const show = () => {
      inner.style.transitionDelay = `${delay}ms`;
      inner.style.transform = 'translateY(0)';
    };

    const hide = () => {
      inner.style.transitionDelay = '0ms';
      inner.style.transform = 'translateY(110%)';
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
        } else {
          // Só oculta se o elemento está ABAIXO da viewport (usuário subiu)
          if (entry.boundingClientRect.top > 0) hide();
          // Se está acima (passou), mantém visível
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={wrapRef}
      style={{ overflow: 'hidden', display: 'block', ...style }}
      className={className}
    >
      <span
        ref={innerRef}
        style={{
          display: 'block',
          transform: 'translateY(110%)',
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
