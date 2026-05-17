import { useEffect, useRef } from 'react';

/**
 * Revela o texto letra por letra ao entrar na viewport.
 * Desfaz a revelação (letras somem de trás pra frente) ao sair pelo topo ao subir.
 *
 * Props:
 *  text    — string a revelar
 *  as      — tag HTML (default: 'span')
 *  mode    — 'letter' | 'word'
 *  speed   — ms entre cada letra/palavra (default: 30)
 *  style   — estilos inline adicionais
 *  className — classes adicionais
 */
export default function TextReveal({
  text,
  as: Tag = 'span',
  mode = 'letter',
  speed = 30,
  style = {},
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const spans = Array.from(container.querySelectorAll('[data-unit]'));
    let timers = [];

    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const reveal = (reverse = false) => {
      clearTimers();
      const ordered = reverse ? [...spans].reverse() : spans;
      ordered.forEach((span, i) => {
        const t = setTimeout(() => {
          if (reverse) span.classList.remove('tr-revealed');
          else span.classList.add('tr-revealed');
        }, i * speed);
        timers.push(t);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal(false);
        } else {
          // Saindo pelo TOPO = usuário subiu = desfaz letras
          if (entry.boundingClientRect.top > 0) {
            reveal(true);
          }
          // Saindo pela PARTE DE BAIXO (rolou além) = mantém revelado
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [text, speed]);

  const tokens = mode === 'letter' ? text.split('') : text.split(' ');

  return (
    <Tag ref={ref} style={style} className={className} aria-label={text}>
      {tokens.map((token, i) => (
        <span
          key={i}
          data-unit
          aria-hidden="true"
          className={`tr-unit${mode === 'word' ? ' tr-word' : ''}`}
        >
          {token === ' ' || mode === 'word'
            ? (mode === 'word' ? token + (i < tokens.length - 1 ? ' ' : '') : ' ')
            : token}
        </span>
      ))}
    </Tag>
  );
}
