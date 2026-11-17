import { useState, useEffect } from 'react';
import { TOPICS } from './data/architectureData';
import { PillarMasteryExplorer } from './components/PillarMasteryExplorer';
import { InteractiveSimulators } from './components/InteractiveSimulators';
import { CapstoneArena } from './components/CapstoneArena';
import { AdrAndBoardroomStudio } from './components/AdrAndBoardroomStudio';
import {
  Award,
  Compass,
  FileCheck2,
  Layers,
  Sliders
} from 'lucide-react';

type WorkbenchTab = 'pillars' | 'simulators' | 'capstone' | 'adr-boardroom';

export function App() {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('pillars');
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

  const handleToggleMastered = (topicId: string) => {
    setMasteredTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const masteryPercentage = Math.round((masteredTopicIds.length / TOPICS.length) * 100);

  return (
    <div className="app-shell">
      {/* Top Enterprise Workbench Header */}
      <header className="top-workbench-header">
        <div className="header-inner">
          <div className="brand-cluster">
            <div className="brand-mark">
              <Compass size={22} />
            </div>
            <div>
              <div className="brand-title-row">
                <h1>SA-LAB // ENTERPRISE ARCHITECTURE WORKBENCH</h1>
                <span className="version-tag">5-PILLAR SIMULATOR &amp; AI SYSTEMS ENGINEERING</span>
              </div>
              <p className="brand-tagline">
                Trade-off Analysis · Design Boundaries · Day-2 Operational Feasibility · Zero-Trust Governance
              </p>
            </div>
          </div>

          <div className="mastery-hud">
            <div className="hud-stat">
              <span>5-PILLAR MASTERY</span>
              <strong>
                {masteredTopicIds.length}/{TOPICS.length} Modules ({masteryPercentage}%)
              </strong>
            </div>
            <div className="hud-progress-bar">
              <div className="hud-progress-fill" style={{ width: `${masteryPercentage}%` }} />
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
              <strong>1. 5-Pillar Mastery Library</strong>
              <span>Trade-offs, Boundaries, Anti-Patterns &amp; Day-2 Ops</span>
            </div>
          </button>

          <button
            id="nav-tab-simulators"
            className={`mode-nav-btn ${activeTab === 'simulators' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulators')}
          >
            <Sliders size={17} />
            <div>
              <strong>2. Chaos &amp; FinOps Flight Simulators</strong>
              <span>100x Flash Sale, Bulkhead, CQRS, SLM Router &amp; M365 ACL Lab</span>
            </div>
          </button>

          <button
            id="nav-tab-capstone"
            className={`mode-nav-btn ${activeTab === 'capstone' ? 'active' : ''}`}
            onClick={() => setActiveTab('capstone')}
          >
            <Award size={17} />
            <div>
              <strong>3. End-to-End Capstone &amp; 7-Gate Checklist</strong>
              <span>Project Horizon 5-Stage Scenario + SA Gatekeeper</span>
            </div>
          </button>

          <button
            id="nav-tab-adr"
            className={`mode-nav-btn ${activeTab === 'adr-boardroom' ? 'active' : ''}`}
            onClick={() => setActiveTab('adr-boardroom')}
          >
            <FileCheck2 size={17} />
            <div>
              <strong>4. ADR Studio, 3Y TCO &amp; Live LLM Boardroom</strong>
              <span>Plug in API Key for Live ARB Grading &amp; CxO Defense</span>
            </div>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="workbench-main">
        {activeTab === 'pillars' && (
          <PillarMasteryExplorer
            masteredTopicIds={masteredTopicIds}
            onToggleMastered={handleToggleMastered}
          />
        )}
        {activeTab === 'simulators' && <InteractiveSimulators />}
        {activeTab === 'capstone' && <CapstoneArena />}
        {activeTab === 'adr-boardroom' && <AdrAndBoardroomStudio />}
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
