import { useEffect } from 'react';

// RGB das cores de cada seção
const SECTIONS = [
  { id: 'hero',           rgb: [60, 179, 192]  },  // #3CB3C0
  { id: 'sobre',          rgb: [207, 249, 185] },  // #CFF9B9
  { id: 'produtos',       rgb: [159, 217, 131] },  // #9FD983
  { id: 'categorias',     rgb: [132, 193, 101] },  // #84C165
  { id: 'footer-section', rgb: [254, 254, 211] },  // #FEFED3
];

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function lerpRgb(c1, c2, t) {
  const clamped = Math.max(0, Math.min(1, t));
  return [lerp(c1[0], c2[0], clamped), lerp(c1[1], c2[1], clamped), lerp(c1[2], c2[2], clamped)];
}

export function useScrollBackground() {
  useEffect(() => {
    let raf = null;

    const update = () => {
      // Ponto de referência: 60% da tela (olho do usuário)
      const viewMid = window.scrollY + window.innerHeight * 0.6;

      const positions = SECTIONS.map(({ id, rgb }) => {
        const el = document.getElementById(id);
        return { rgb, top: el ? el.offsetTop : 0 };
      });

      let result = positions[0].rgb;

      for (let i = 0; i < positions.length - 1; i++) {
        const curr = positions[i];
        const next = positions[i + 1];

        if (viewMid >= curr.top && viewMid < next.top) {
          const t = (viewMid - curr.top) / (next.top - curr.top);
          result = lerpRgb(curr.rgb, next.rgb, t);
          break;
        } else if (viewMid >= next.top) {
          result = next.rgb;
        }
      }

      document.body.style.backgroundColor = `rgb(${result.join(',')})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}
