import React, { useState } from 'react';
import { type ArchitectureTopic } from '../data/architectureData';
import {
  getLocalizedPillars,
  getLocalizedTopics,
  UI_COPY,
  type Lang
} from '../data/i18n';
import { getTopicPracticeGuide } from '../data/learningGuides';
import {
  AlertOctagon,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Layers,
  Lightbulb,
  MessageSquareQuote,
  Scale,
  Shield,
  Terminal,
  Wrench
} from 'lucide-react';
import { TopicFlowDiagram } from './ArchitectureFlowDiagram';
import { GlossaryText } from './GlossaryText';
import { TopicPracticeLab } from './TopicPracticeLab';

interface Props {
  lang: Lang;
  masteredTopicIds: string[];
  onToggleMastered: (topicId: string) => void;
  onTopicChange?: (topicId: string) => void;
}

type DetailTab = 'overview' | 'tradeoffs' | 'boundaries' | 'practice';
type MobileLayer = 'pillars' | 'topics' | 'detail';

export const PillarMasteryExplorer: React.FC<Props> = ({
  lang,
  masteredTopicIds,
  onToggleMastered,
  onTopicChange
}) => {
  const pillars = getLocalizedPillars(lang);
  const topics = getLocalizedTopics(lang);
  const copy = UI_COPY[lang].explorer;
  const isVi = lang === 'vi';

  const [selectedPillarId, setSelectedPillarId] = useState<string>('pillar-1');
  const pillarTopics = topics.filter((t) => t.pillarId === selectedPillarId);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(pillarTopics[0]?.id || topics[0].id);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('overview');
  const [mobileLayer, setMobileLayer] = useState<MobileLayer>('pillars');

  const scrollTopSmooth = () => {
    if (window.innerWidth <= 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPillar = (pillarId: string) => {
    setSelectedPillarId(pillarId);
    const firstTopic = topics.find((t) => t.pillarId === pillarId);
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
      setActiveDetailTab('overview');
      onTopicChange?.(firstTopic.id);
    }
    setMobileLayer('topics');
    scrollTopSmooth();
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveDetailTab('overview');
    onTopicChange?.(topicId);
    setMobileLayer('detail');
    scrollTopSmooth();
  };

  const currentPillar = pillars.find((p) => p.id === selectedPillarId) || pillars[0];
  const currentTopic: ArchitectureTopic =
    topics.find((t) => t.id === selectedTopicId) || pillarTopics[0] || topics[0];
  const currentGuide = getTopicPracticeGuide(currentTopic.id, lang);

  const isMastered = masteredTopicIds.includes(currentTopic.id);

  return (
    <div className={`explorer-wrapper mobile-layer-${mobileLayer}`}>
      {/* Mobile Layer 1 Header Hint */}
      <div className="mobile-layer-banner">
        <strong>{isVi ? 'Bước 1/3: Chọn Trụ cột Kiến trúc' : 'Step 1/3: Choose Architecture Pillar'}</strong>
        <span>{isVi ? 'Chạm vào 1 trụ cột để mở danh sách bài học' : 'Tap a pillar to drill into its modules'}</span>
      </div>

      {/* 5 Pillars Selector Strip */}
      <div className="pillars-strip">
        {pillars.map((pillar) => {
          const topicsInPillar = topics.filter((t) => t.pillarId === pillar.id);
          const doneCount = topicsInPillar.filter((t) => masteredTopicIds.includes(t.id)).length;
          const progressPct = topicsInPillar.length > 0 ? Math.round((doneCount / topicsInPillar.length) * 100) : 0;
          const isActive = pillar.id === selectedPillarId;

          return (
            <button
              key={pillar.id}
              id={`pillar-btn-${pillar.number}`}
              className={`pillar-card-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectPillar(pillar.id)}
              title={pillar.subtitle}
            >
              <div className="pillar-card-top">
                <span className="pillar-num-badge">{copy.pillarWord} {pillar.number}</span>
                <span className={`pillar-progress-pill ${doneCount === topicsInPillar.length && doneCount > 0 ? 'complete' : ''}`}>
                  {doneCount}/{topicsInPillar.length}
                </span>
              </div>
              <strong className="pillar-card-title">{pillar.title}</strong>
              <p className="pillar-card-sub">{pillar.subtitle}</p>
              <div className="pillar-mini-progress" aria-hidden="true">
                <div className="pillar-mini-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="mobile-card-chevron" aria-hidden="true">
                {isVi ? 'Mở bài học' : 'Open modules'} <ChevronRight size={15} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Topic Selector + Deep-Dive Workbench */}
      <div className="explorer-main-grid">
        {/* Left Sidebar: Topics in Selected Pillar */}
        <aside className="topic-sidebar">
          <div className="mobile-nav-backbar">
            <button
              type="button"
              className="mobile-back-btn"
              onClick={() => {
                setMobileLayer('pillars');
                scrollTopSmooth();
              }}
            >
              <ArrowLeft size={16} />
              <span>{isVi ? '5 Trụ cột' : 'All Pillars'}</span>
            </button>
            <span className="mobile-crumb-tag">
              {copy.pillarWord} {currentPillar.number} · {isVi ? 'Bước 2/3' : 'Step 2/3'}
            </span>
          </div>

          <div className="sidebar-header">
            <span className="eyebrow-tag">{copy.pillarWord} {currentPillar.number} {copy.modulesWord}</span>
            <h3>{currentPillar.shortTitle}</h3>
          </div>

          <div className="topic-nav-list">
            {pillarTopics.map((topic) => {
              const done = masteredTopicIds.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  id={`topic-btn-${topic.id}`}
                  className={`topic-nav-item ${topic.id === currentTopic.id ? 'active' : ''}`}
                  onClick={() => handleSelectTopic(topic.id)}
                >
                  <div className="topic-nav-top">
                    <span className="topic-code">{topic.code}</span>
                    {done && <CheckCircle2 size={15} className="text-success" />}
                  </div>
                  <strong>{topic.title}</strong>
                  <span>{topic.subtitle}</span>
                  <span className="mobile-topic-enter">
                    {isVi ? 'Xem chi tiết' : 'Open lesson'} <ChevronRight size={14} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pillar-focus-summary">
            <h4>{copy.coreMandates}</h4>
            <ul>
              {currentPillar.coreFocus.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Detail Canvas */}
        <section className="topic-detail-canvas">
          <div className="mobile-nav-backbar">
            <button
              type="button"
              className="mobile-back-btn"
              onClick={() => {
                setMobileLayer('topics');
                scrollTopSmooth();
              }}
            >
              <ArrowLeft size={16} />
              <span>
                {copy.pillarWord} {currentPillar.number} · {isVi ? 'Danh sách bài' : 'Modules'}
              </span>
            </button>
            <span className="mobile-crumb-tag">{currentTopic.code} · {isVi ? 'Chi tiết' : 'Lesson'}</span>
          </div>

          {/* Compact Topic Header */}
          <div className="topic-header-card">
            <div className="topic-header-top">
              <div>
                <span className="eyebrow-tag">
                  {copy.moduleWord} {currentTopic.code} · {currentPillar.shortTitle.toUpperCase()}
                </span>
                <h2>{currentTopic.title}</h2>
                <p className="subtitle-copy">{currentTopic.subtitle}</p>
              </div>
              <button
                id="btn-toggle-mastery"
                className={isMastered ? 'btn-mastered' : 'btn-primary'}
                onClick={() => onToggleMastered(currentTopic.id)}
              >
                <CheckCircle2 size={16} />
                {isMastered ? copy.markedMastered : copy.markMastered}
              </button>
            </div>

            {/* 4-Step Progressive Disclosure Sub-Tabs */}
            <div className="topic-subtabs" role="tablist" aria-label="Module Learning Steps">
              <button
                type="button"
                role="tab"
                aria-selected={activeDetailTab === 'overview'}
                className={`topic-subtab-btn ${activeDetailTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('overview')}
              >
                <BookOpen size={15} />
                <span>{isVi ? '1. Hiểu nhanh & Sơ đồ' : '1. Plain Guide & Flow'}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDetailTab === 'tradeoffs'}
                className={`topic-subtab-btn ${activeDetailTab === 'tradeoffs' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('tradeoffs')}
              >
                <Scale size={15} />
                <span>{isVi ? '2. Đánh đổi & Phương án' : '2. Trade-offs & Options'}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDetailTab === 'boundaries'}
                className={`topic-subtab-btn ${activeDetailTab === 'boundaries' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('boundaries')}
              >
                <Shield size={15} />
                <span>{isVi ? '3. Ranh giới & Vận hành' : '3. Boundaries & Day-2'}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDetailTab === 'practice'}
                className={`topic-subtab-btn practice-highlight ${activeDetailTab === 'practice' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('practice')}
              >
                <MessageSquareQuote size={15} />
                <span>{isVi ? '4. Thực hành & Phản biện' : '4. Practice & Debate'}</span>
              </button>
            </div>
          </div>

          {/* === SUB-TAB 1: BEGINNER-FRIENDLY OVERVIEW & VISUAL FLOW === */}
          {activeDetailTab === 'overview' && (
            <>
              {/* Plain-Language Guide Card */}
              <div className="detail-section-card plain-guide-card">
                <div className="card-heading">
                  <Lightbulb size={18} />
                  <h3>
                    {isVi
                      ? 'Giải thích dễ hiểu cho người mới (Plain-Language Guide)'
                      : 'Beginner-Friendly Guide (No Jargon Overload)'}
                  </h3>
                </div>

                <div className="analogy-callout-box">
                  <span className="analogy-tag">
                    {isVi ? 'Ví dụ đời thường' : 'Real-World Analogy'}
                  </span>
                  <h4>{currentGuide.analogyTitle}</h4>
                  <p>
                    <GlossaryText text={currentGuide.analogyStory} />
                  </p>
                </div>

                <div className="plain-steps-grid">
                  {currentGuide.plainSteps.map((step, idx) => (
                    <div key={idx} className="plain-step-card">
                      <span className="plain-step-num">{idx + 1}</span>
                      <p>
                        <GlossaryText text={step} />
                      </p>
                    </div>
                  ))}
                </div>

                <div className="key-terms-strip">
                  <span className="key-terms-label">
                    {isVi
                      ? 'Thuật ngữ bài này (rê chuột để xem nghĩa):'
                      : 'Key terms in this module (hover to explain):'}
                  </span>
                  <div className="key-terms-pills">
                    {currentGuide.keyTerms.map((term) => (
                      <span key={term} className="key-term-chip">
                        <GlossaryText text={term} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Golden Rule & Context */}
              <div className="detail-section-card">
                <div className="golden-rule-callout" style={{ marginBottom: '0.85rem' }}>
                  <Compass size={20} />
                  <div>
                    <strong>{copy.goldenRuleLabel}</strong>
                    <p><GlossaryText text={currentTopic.goldenRule} /></p>
                  </div>
                </div>
                <p className="business-context-p">
                  <strong>{copy.contextLabel}</strong> <GlossaryText text={currentTopic.businessContext} />
                </p>
              </div>

              {/* Architecture Flow Topology */}
              <div className="detail-section-card">
                <div className="card-heading">
                  <Terminal size={18} />
                  <h3>{copy.flowHeading}</h3>
                </div>
                <TopicFlowDiagram topicId={currentTopic.id} />
              </div>

              {/* Next-Step CTA Bar */}
              <div className="step-footer-nav">
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={() => setActiveDetailTab('tradeoffs')}
                >
                  {isVi ? 'Tiếp theo: Xem So sánh & Đánh đổi' : 'Next: Compare Trade-offs & Options'}{' '}
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveDetailTab('practice')}
                >
                  <MessageSquareQuote size={15} />
                  {isVi ? 'Làm bài tập & Phản biện ngay' : 'Jump to Practice & Debate'}
                </button>
              </div>
            </>
          )}

          {/* === SUB-TAB 2: TRADE-OFFS & OPTIONS === */}
          {activeDetailTab === 'tradeoffs' && (
            <>
              <div className="detail-section-card">
                <div className="card-heading">
                  <Scale size={18} />
                  <h3>{copy.dim1Heading}</h3>
                </div>

                <div className="options-grid-3">
                  {currentTopic.optionsComparison.options.map((opt, idx) => (
                    <div key={opt.id} className={`arch-option-card ${idx === 0 ? 'recommended' : ''}`}>
                      <div className="option-card-header">
                        <span className="option-rank-badge">
                          {idx === 0 ? copy.recommendedBadge : `${copy.alternativeBadge} ${idx}`}
                        </span>
                        <div className="option-meta-tags">
                          <span>Cost: {opt.costProfile}</span>
                          <span>Ops: {opt.opsComplexity}</span>
                        </div>
                      </div>
                      <h4><GlossaryText text={opt.name} /></h4>
                      <p className="option-tagline"><GlossaryText text={opt.tagline} /></p>

                      <div className="pros-cons-block">
                        <strong>{copy.strengths}</strong>
                        <ul className="pros-list">
                          {opt.pros.map((p, i) => (
                            <li key={i}><GlossaryText text={p} /></li>
                          ))}
                        </ul>
                      </div>

                      <div className="pros-cons-block">
                        <strong>{copy.tradeOffsRisks}</strong>
                        <ul className="cons-list">
                          {opt.cons.map((c, i) => (
                            <li key={i}><GlossaryText text={c} /></li>
                          ))}
                        </ul>
                      </div>

                      <div className="when-to-use-footer">
                        <strong>{copy.whenToUse}</strong> <GlossaryText text={opt.whenToUse} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantitative 5-Axis Comparison Bars */}
                <div className="tradeoff-bars-panel">
                  <div className="bars-legend">
                    <h4>{copy.quantHeading}</h4>
                    <div className="legend-items">
                      <span className="legend-dot opt-a">{currentTopic.optionsComparison.optionALabel}</span>
                      <span className="legend-dot opt-b">{currentTopic.optionsComparison.optionBLabel}</span>
                      {currentTopic.optionsComparison.optionCLabel && (
                        <span className="legend-dot opt-c">{currentTopic.optionsComparison.optionCLabel}</span>
                      )}
                    </div>
                  </div>

                  <div className="axes-stack">
                    {currentTopic.optionsComparison.axes.map((ax) => (
                      <div key={ax.metric} className="axis-row">
                        <div className="axis-name">{ax.metric}</div>
                        <div className="axis-bars-group">
                          <div className="bar-line">
                            <div className="bar-fill opt-a" style={{ width: `${ax.optionA}%` }} />
                            <span>{ax.optionA}%</span>
                          </div>
                          <div className="bar-line">
                            <div className="bar-fill opt-b" style={{ width: `${ax.optionB}%` }} />
                            <span>{ax.optionB}%</span>
                          </div>
                          {ax.optionC !== undefined && (
                            <div className="bar-line">
                              <div className="bar-fill opt-c" style={{ width: `${ax.optionC}%` }} />
                              <span>{ax.optionC}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="step-footer-nav">
                <button
                  type="button"
                  className="btn-ghost-sm"
                  onClick={() => setActiveDetailTab('overview')}
                >
                  {isVi ? '← Quay lại Hiểu nhanh' : '← Back to Plain Guide'}
                </button>
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={() => setActiveDetailTab('boundaries')}
                >
                  {isVi ? 'Tiếp theo: Ranh giới & Vận hành Day-2' : 'Next: Boundaries & Day-2'}{' '}
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}

          {/* === SUB-TAB 3: BOUNDARIES, ANTI-PATTERNS, DAY-2 & GOVERNANCE === */}
          {activeDetailTab === 'boundaries' && (
            <>
              <div className="two-col-detail-grid">
                <div className="detail-section-card">
                  <div className="card-heading">
                    <Layers size={18} />
                    <h3>{copy.dim2Heading}</h3>
                  </div>
                  <div className="stack-cards">
                    {currentTopic.boundaries.map((b, i) => (
                      <div key={i} className="boundary-item-card">
                        <h4><GlossaryText text={b.zone} /></h4>
                        <p>
                          <strong>{copy.coreResp}</strong> <GlossaryText text={b.responsibility} />
                        </p>
                        <p className="redline-text">
                          <strong>{copy.neverCross}</strong> <GlossaryText text={b.mustNeverCross} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-section-card">
                  <div className="card-heading">
                    <AlertOctagon size={18} />
                    <h3>{copy.antiPatternsHeading}</h3>
                  </div>
                  <div className="stack-cards">
                    {currentTopic.antiPatterns.map((ap, i) => (
                      <div key={i} className="antipattern-item-card">
                        <h4><GlossaryText text={ap.name} /></h4>
                        <p>
                          <strong>{copy.symptom}</strong> <GlossaryText text={ap.symptom} />
                        </p>
                        <p className="impact-text">
                          <strong>{copy.impact}</strong> <GlossaryText text={ap.businessImpact} />
                        </p>
                        <p className="fix-text">
                          <strong>{copy.remediation}</strong> <GlossaryText text={ap.remediation} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="two-col-detail-grid">
                <div className="detail-section-card">
                  <div className="card-heading">
                    <Wrench size={18} />
                    <h3>{copy.dim3Heading}</h3>
                  </div>
                  {currentTopic.day2Ops.map((op, i) => (
                    <div key={i} className="day2-card">
                      <h4>{copy.failureScenario} <GlossaryText text={op.failureMode} /></h4>
                      <p>
                        <strong>{copy.blastRadius}</strong> <GlossaryText text={op.blastRadius} />
                      </p>
                      <p>
                        <strong>{copy.day2Mitigation}</strong> <GlossaryText text={op.mitigationMechanism} />
                      </p>
                      <div className="sla-badge-box">
                        <strong>{copy.keySli}</strong> <GlossaryText text={op.keyMetric} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="detail-section-card">
                  <div className="card-heading">
                    <Shield size={18} />
                    <h3>{copy.dim4Heading}</h3>
                  </div>
                  <ul className="governance-checklist">
                    {currentTopic.governanceRules.map((rule, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} className="text-success" />
                        <span><GlossaryText text={rule} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="step-footer-nav">
                <button
                  type="button"
                  className="btn-ghost-sm"
                  onClick={() => setActiveDetailTab('tradeoffs')}
                >
                  {isVi ? '← Quay lại Đánh đổi' : '← Back to Trade-offs'}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveDetailTab('practice')}
                >
                  <MessageSquareQuote size={15} />
                  {isVi ? 'Tiếp theo: Thực hành & Phản biện' : 'Next: Practice & Debate Lab'}
                </button>
              </div>
            </>
          )}

          {/* === SUB-TAB 4: PRACTICE & DEBATE LAB === */}
          {activeDetailTab === 'practice' && (
            <>
              <TopicPracticeLab guide={currentGuide} lang={lang} />
              <div className="step-footer-nav">
                <button
                  type="button"
                  className="btn-ghost-sm"
                  onClick={() => setActiveDetailTab('overview')}
                >
                  {isVi ? '← Xem lại Hiểu nhanh & Sơ đồ' : '← Review Plain Guide & Flow'}
                </button>
                <button
                  type="button"
                  className={isMastered ? 'btn-mastered' : 'btn-primary'}
                  onClick={() => onToggleMastered(currentTopic.id)}
                >
                  <CheckCircle2 size={16} />
                  {isMastered ? copy.markedMastered : copy.markMastered}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
