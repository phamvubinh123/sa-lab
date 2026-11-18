import { useState, useEffect } from 'react';
import { TOPICS } from './data/architectureData';
import { UI_COPY, type Lang } from './data/i18n';
import { PillarMasteryExplorer } from './components/PillarMasteryExplorer';
import { InteractiveSimulators } from './components/InteractiveSimulators';
import { CapstoneArena } from './components/CapstoneArena';
import { AdrAndBoardroomStudio } from './components/AdrAndBoardroomStudio';
import { GlossaryTooltip } from './components/GlossaryText';
import {
  Award,
  Compass,
  FileCheck2,
  Globe,
  Layers,
  Sliders
} from 'lucide-react';

type WorkbenchTab = 'pillars' | 'simulators' | 'capstone' | 'adr-boardroom';

export function App() {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('pillars');
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

  const masteryPercentage = Math.round((masteredTopicIds.length / TOPICS.length) * 100);
  const t = UI_COPY[lang];

  return (
    <div className="app-shell">
      <GlossaryTooltip />
      {/* Top Enterprise Workbench Header */}
      <header className="top-workbench-header">
        <div className="header-inner">
          <div className="brand-cluster">
            <div className="brand-mark">
              <Compass size={22} />
            </div>
            <div>
              <div className="brand-title-row">
                <h1>{t.headerTitle}</h1>
                <span className="version-tag">{t.headerTag}</span>
              </div>
              <p className="brand-tagline">{t.headerTagline}</p>
            </div>
          </div>

          <div className="header-right-cluster">
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

            <div className="mastery-hud">
              <div className="hud-stat">
                <span>{t.masteryLabel}</span>
                <strong>
                  {masteredTopicIds.length}/{TOPICS.length} {t.modulesWord} ({masteryPercentage}%)
                </strong>
              </div>
              <div className="hud-progress-bar">
                <div className="hud-progress-fill" style={{ width: `${masteryPercentage}%` }} />
              </div>
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
    </div>
  );
}

export default App;
