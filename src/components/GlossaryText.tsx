import React, { useEffect, useState } from 'react';
import { ExternalLink, PlayCircle, Search, X } from 'lucide-react';
import { GLOSSARY_MAP, SA_GLOSSARY, type GlossaryEntry } from '../data/glossary';
import { getYouTubeSearchUrl, TERM_VIDEO_MAP } from '../data/videoResources';
import type { Lang } from '../data/i18n';
import { YouTubeEmbedCard } from './YouTubeEmbedCard';

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

export const GlossaryTooltip: React.FC<{ lang?: Lang }> = ({ lang = 'vi' }) => {
  const isVi = lang === 'vi';
  const [tip, setTip] = useState<TooltipState>({
    visible: false,
    entry: null,
    x: 0,
    y: 0
  });
  const [modalEntry, setModalEntry] = useState<GlossaryEntry | null>(null);

  useEffect(() => {
    let currentEl: HTMLElement | null = null;

    const computePos = (clientX: number, clientY: number) => {
      const maxWidth = 360;
      const estHeight = 165;
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

    const handleClick = (e: MouseEvent) => {
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

      e.stopPropagation();
      currentEl = null;
      setTip((prev) => ({ ...prev, visible: false }));
      setModalEntry(entry);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalEntry(null);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const mappedVideo = modalEntry ? TERM_VIDEO_MAP[modalEntry.term.toLowerCase()] : undefined;

  return (
    <>
      {tip.visible && tip.entry && !modalEntry && (
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
          <div className="glossary-tip-footer">
            <PlayCircle size={12} />
            <span>
              {isVi
                ? 'Nhấn vào thuật ngữ để xem Video giải thích sâu'
                : 'Click term for Deep-Dive & YouTube Video'}
            </span>
          </div>
        </div>
      )}

      {modalEntry && (
        <div
          className="glossary-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={modalEntry.term}
          onClick={() => setModalEntry(null)}
        >
          <div
            className="glossary-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glossary-modal-header">
              <div>
                <span className="glossary-modal-badge">{modalEntry.term}</span>
                <h3>{modalEntry.fullName}</h3>
              </div>
              <button
                type="button"
                className="glossary-modal-close"
                onClick={() => setModalEntry(null)}
                aria-label={isVi ? 'Đóng' : 'Close'}
              >
                <X size={18} />
              </button>
            </div>

            <p className="glossary-modal-desc">{modalEntry.explanation}</p>

            {mappedVideo ? (
              <div className="glossary-modal-video-wrap">
                <div className="glossary-modal-section-label">
                  <PlayCircle size={14} />
                  <span>
                    {isVi ? 'Video giải thích chi tiết (Đề xuất)' : 'Curated Deep-Dive Video'}
                  </span>
                </div>
                <YouTubeEmbedCard video={mappedVideo} lang={lang} compact />
              </div>
            ) : null}

            <div className="glossary-modal-actions">
              <a
                href={getYouTubeSearchUrl(`${modalEntry.term} ${modalEntry.fullName}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary glossary-yt-search-btn"
              >
                <Search size={14} />
                <span>
                  {isVi
                    ? `Tìm thêm video "${modalEntry.term}" trên YouTube`
                    : `Search "${modalEntry.term}" videos on YouTube`}
                </span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
