import React, { useEffect, useState } from 'react';
import { GLOSSARY_MAP, SA_GLOSSARY, type GlossaryEntry } from '../data/glossary';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Sort longest terms first so compound terms (e.g. "Transactional Outbox", "Cache Stampede") match before shorter ones
const SORTED_TERMS = [...SA_GLOSSARY].sort((a, b) => b.term.length - a.term.length);
const TERM_REGEX = new RegExp(
  `\\b(${SORTED_TERMS.map((e) => escapeRegex(e.term)).join('|')})\\b`,
  'g'
);

export const GlossaryText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TERM_REGEX.lastIndex = 0;
  while ((match = TERM_REGEX.exec(text)) !== null) {
    const matchedWord = match[0];
    const start = match.index;
    const entry = GLOSSARY_MAP[matchedWord.toLowerCase()];

    // Respect case-sensitivity for short/uppercase acronyms (e.g. HA, NLB, CDN, OBO, L4, L7)
    const isValidMatch =
      entry && (!entry.caseSensitive || matchedWord === entry.term);

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (isValidMatch) {
      nodes.push(
        <abbr
          key={`${start}-${matchedWord}`}
          className="glossary-term"
          data-term-key={entry.term.toLowerCase()}
        >
          {matchedWord}
        </abbr>
      );
    } else {
      nodes.push(matchedWord);
    }

    lastIndex = start + matchedWord.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes}</>;
};

interface TooltipState {
  visible: boolean;
  entry: GlossaryEntry | null;
  x: number;
  y: number;
}

export const GlossaryTooltip: React.FC = () => {
  const [tip, setTip] = useState<TooltipState>({
    visible: false,
    entry: null,
    x: 0,
    y: 0
  });

  useEffect(() => {
    let currentEl: HTMLElement | null = null;

    const computePos = (clientX: number, clientY: number) => {
      const maxWidth = 360;
      const estHeight = 145;
      const offset = 14;

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
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-term-key]');
      if (!target) {
        if (currentEl) {
          currentEl = null;
          setTip((prev) => ({ ...prev, visible: false }));
        }
        return;
      }

      const key = target.getAttribute('data-term-key');
      const entry = key ? GLOSSARY_MAP[key] : undefined;
      if (!entry) return;

      currentEl = target;
      const { x, y } = computePos(e.clientX, e.clientY);
      setTip({ visible: true, entry, x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!currentEl) return;
      const { x, y } = computePos(e.clientX, e.clientY);
      setTip((prev) => (prev.visible ? { ...prev, x, y } : prev));
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!currentEl) return;
      const related = (e.relatedTarget as HTMLElement | null)?.closest<HTMLElement>('[data-term-key]');
      if (!related) {
        currentEl = null;
        setTip((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleScroll = () => {
      if (currentEl) {
        currentEl = null;
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
  }, []);

  if (!tip.visible || !tip.entry) return null;

  return (
    <div
      className="glossary-tooltip"
      role="tooltip"
      style={{ left: `${tip.x}px`, top: `${tip.y}px` }}
    >
      <div className="glossary-tip-header">
        <span className="glossary-tip-term">{tip.entry.term}</span>
        <span className="glossary-tip-full">{tip.entry.fullName}</span>
      </div>
      <p className="glossary-tip-body">{tip.entry.explanation}</p>
    </div>
  );
};
