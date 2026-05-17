import { useEffect, useRef } from 'react';

/**
 * Revela o texto letra a letra conforme o bloco entra na viewport,
 * proporcional ao scroll. Desfaz na mesma proporção ao subir.
 *
 * progress = 0 → bloco aparecendo na base da tela (nenhuma letra)
 * progress = 1 → bloco saindo pelo topo (todas as letras reveladas)
 *
 * Um fator de velocidade faz com que todas as letras apareçam antes
 * do bloco sair de vista.
 */
export default function TextReveal({ children, as: Tag = 'div', style = {}, className = '', pixelDelay = 0 }) {
  const ref = useRef(null);
  const text = typeof children === 'string' ? children : '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = Array.from(el.querySelectorAll('[data-c]'));
    let raf = null;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const wh = window.innerHeight;

      // pixelDelay desloca o "topo virtual" do elemento para baixo,
      // fazendo o efeito começar mais tarde no scroll.
      const effectiveTop = rect.top + pixelDelay;
      const raw = (wh - effectiveTop) / (wh + rect.height);
      const progress = Math.max(0, Math.min(1, raw * 1.6));
      const revealed = Math.round(progress * spans.length);

      for (let i = 0; i < spans.length; i++) {
        spans[i].style.opacity = i < revealed ? '1' : '0.18';
      }
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // estado inicial

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          data-c
          aria-hidden="true"
          style={{
            display: 'inline-block',
            opacity: 0.18,
            transition: 'opacity 0.06s linear',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </Tag>
  );
}
