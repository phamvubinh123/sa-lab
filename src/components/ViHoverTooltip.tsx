import React, { useEffect, useState } from 'react';

interface TooltipState {
  visible: boolean;
  title?: string;
  text: string;
  x: number;
  y: number;
}

export const ViHoverTooltip: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [tip, setTip] = useState<TooltipState>({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (!enabled) {
      setTip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    let currentTarget: HTMLElement | null = null;

    const computePos = (clientX: number, clientY: number) => {
      const maxWidth = 370;
      const estHeight = 160;
      const offset = 16;

      let x = clientX + offset;
      let y = clientY + offset;

      if (x + maxWidth > window.innerWidth - 12) {
        x = Math.max(12, clientX - maxWidth - offset);
      }
      if (y + estHeight > window.innerHeight - 12) {
        y = Math.max(12, clientY - estHeight - offset);
      }
      return { x, y };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-vi-tip]');
      if (!target) {
        if (currentTarget) {
          currentTarget = null;
          setTip((prev) => ({ ...prev, visible: false }));
        }
        return;
      }

      const text = target.getAttribute('data-vi-tip');
      if (!text) return;
      const title = target.getAttribute('data-vi-title') || undefined;
      currentTarget = target;

      const { x, y } = computePos(e.clientX, e.clientY);
      setTip({ visible: true, title, text, x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!currentTarget) return;
      const { x, y } = computePos(e.clientX, e.clientY);
      setTip((prev) => (prev.visible ? { ...prev, x, y } : prev));
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!currentTarget) return;
      const related = (e.relatedTarget as HTMLElement | null)?.closest<HTMLElement>('[data-vi-tip]');
      if (related !== currentTarget) {
        if (!related) {
          currentTarget = null;
          setTip((prev) => ({ ...prev, visible: false }));
        }
      }
    };

    const handleScroll = () => {
      if (currentTarget) {
        currentTarget = null;
        setTip((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [enabled]);

  if (!enabled || !tip.visible) return null;

  return (
    <div
      className="vi-hover-tooltip"
      role="tooltip"
      style={{ left: `${tip.x}px`, top: `${tip.y}px` }}
    >
      <div className="vi-tip-badge">🇻🇳 Giải thích Tiếng Việt</div>
      {tip.title && <strong className="vi-tip-title">{tip.title}</strong>}
      <p className="vi-tip-body">{tip.text}</p>
    </div>
  );
};
