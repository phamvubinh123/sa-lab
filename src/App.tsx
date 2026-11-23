import { useState, useEffect } from 'react';
import { UI_COPY, type Lang } from './data/i18n';
import { PillarMasteryExplorer } from './components/PillarMasteryExplorer';
import { InteractiveSimulators } from './components/InteractiveSimulators';
import { CapstoneArena } from './components/CapstoneArena';
import { AdrAndBoardroomStudio } from './components/AdrAndBoardroomStudio';
import { GlossaryTooltip } from './components/GlossaryText';
import { QuickTutorChat } from './components/QuickTutorChat';
import {
  Award,
  FileCheck2,
  Globe,
  Layers,
  MessageCircleQuestion,
  Sliders
} from 'lucide-react';

type WorkbenchTab = 'pillars' | 'simulators' | 'capstone' | 'adr-boardroom';

export function App() {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('pillars');
  const [activeTopicId, setActiveTopicId] = useState<string>('p1-edge-gateway');
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('salab_lang');
      return saved === 'vi' ? 'vi' : 'en';
    } catch {
      return 'en';
    }
  });
  const [masteredTopicIds, setMasteredTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('salab_mastered_topics');
      return saved ? JSON.parse(saved) : ['p1-edge-gateway'];
    } catch {
      return ['p1-edge-gateway'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('salab_mastered_topics', JSON.stringify(masteredTopicIds));
    } catch {
      // ignore storage errors
    }
  }, [masteredTopicIds]);

  useEffect(() => {
    try {
      localStorage.setItem('salab_lang', lang);
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  const handleToggleMastered = (topicId: string) => {
    setMasteredTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const t = UI_COPY[lang];

  return (
    <div className={`app-shell ${isTutorOpen ? 'tutor-open' : ''}`}>
      <GlossaryTooltip />
      {/* Top Enterprise Workbench Header */}
      <header className="top-workbench-header">
        <div className="header-inner">
          <div className="brand-cluster">
            <div className="brand-mark brand-mark-logo">
              <img src="./sa-lab-logo.svg" alt="SA-Lab Logo" width={40} height={40} />
            </div>
            <div className="brand-title-row">
              <h1>{t.headerTitle}</h1>
              <span className="version-tag">{t.headerTag}</span>
            </div>
          </div>

          <div className="header-right-cluster">
            <button
              id="btn-toggle-tutor"
              type="button"
              className={`tutor-header-btn ${isTutorOpen ? 'active' : ''}`}
              onClick={() => setIsTutorOpen((prev) => !prev)}
            >
              <MessageCircleQuestion size={15} />
              <span>{lang === 'vi' ? 'Hỏi nhanh Tutor' : 'Ask SA Tutor'}</span>
            </button>

            <span className="app-version-pill" title="SA-Lab Current Release">
              v1.7.6
            </span>

            <div className="lang-switcher" role="group" aria-label="Language Switcher">
              <Globe size={14} className="lang-icon" />
              <button
                id="btn-lang-en"
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                id="btn-lang-vi"
                type="button"
                className={`lang-btn ${lang === 'vi' ? 'active' : ''}`}
                onClick={() => setLang('vi')}
              >
                VI
              </button>
            </div>
          </div>
        </div>

        {/* Primary Mode Navigation Bar */}
        <nav className="primary-mode-nav" aria-label="Main Workbench Modes">
          <button
            id="nav-tab-pillars"
            className={`mode-nav-btn ${activeTab === 'pillars' ? 'active' : ''}`}
            onClick={() => setActiveTab('pillars')}
          >
            <Layers size={17} />
            <div>
              <strong>{t.nav.t1Title}</strong>
              <span>{t.nav.t1Sub}</span>
            </div>
          </button>

          <button
            id="nav-tab-simulators"
            className={`mode-nav-btn ${activeTab === 'simulators' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulators')}
          >
            <Sliders size={17} />
            <div>
              <strong>{t.nav.t2Title}</strong>
              <span>{t.nav.t2Sub}</span>
            </div>
          </button>

          <button
            id="nav-tab-capstone"
            className={`mode-nav-btn ${activeTab === 'capstone' ? 'active' : ''}`}
            onClick={() => setActiveTab('capstone')}
          >
            <Award size={17} />
            <div>
              <strong>{t.nav.t3Title}</strong>
              <span>{t.nav.t3Sub}</span>
            </div>
          </button>

          <button
            id="nav-tab-adr"
            className={`mode-nav-btn ${activeTab === 'adr-boardroom' ? 'active' : ''}`}
            onClick={() => setActiveTab('adr-boardroom')}
          >
            <FileCheck2 size={17} />
            <div>
              <strong>{t.nav.t4Title}</strong>
              <span>{t.nav.t4Sub}</span>
            </div>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="workbench-main">
        {activeTab === 'pillars' && (
          <PillarMasteryExplorer
            lang={lang}
            masteredTopicIds={masteredTopicIds}
            onToggleMastered={handleToggleMastered}
            onTopicChange={setActiveTopicId}
          />
        )}
        {activeTab === 'simulators' && <InteractiveSimulators lang={lang} />}
        {activeTab === 'capstone' && <CapstoneArena lang={lang} />}
        {activeTab === 'adr-boardroom' && <AdrAndBoardroomStudio lang={lang} />}
      </main>

      <footer className="workbench-footer">
        <div className="footer-inner">
          <span>
            <strong>SA-Lab Enterprise Architecture Mastery Workbench</strong> · Built on the 5 Enterprise Pillars &amp; AI Systems Engineering Handbook
          </span>
          <span>
            Golden Rules: Bypass CDN for Dynamic State · Mutex Lock Cache-Aside · FE Generates / BE Enforces Idempotency · CQRS &gt;50:1 · 75/25 SLM Model Router · Finetuning for Form, RAG for Facts · Entra ID OBO Trimming
          </span>
        </div>
      </footer>

      {/* Floating Quick-Ask Button when side chat is closed */}
      {!isTutorOpen && (
        <button
          type="button"
          className="tutor-fab-btn"
          onClick={() => setIsTutorOpen(true)}
          aria-label="Open SA Tutor Chat"
        >
          <MessageCircleQuestion size={20} />
          <span>{lang === 'vi' ? 'Hỏi nhanh' : 'Ask Tutor'}</span>
        </button>
      )}

      {/* Dockable Right-Side SA Tutor Chat */}
      <QuickTutorChat
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        lang={lang}
        activeTab={activeTab}
        activeTopicId={activeTopicId}
      />
    </div>
  );
}

export default App;
