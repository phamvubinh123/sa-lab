import React, { useState } from 'react';
import { type ArchitectureTopic } from '../data/architectureData';
import {
  getLocalizedPillars,
  getLocalizedTopics,
  UI_COPY,
  type Lang
} from '../data/i18n';
import {
  AlertOctagon,
  CheckCircle2,
  Compass,
  Layers,
  Scale,
  Shield,
  Terminal,
  Wrench
} from 'lucide-react';
import { TopicFlowDiagram } from './ArchitectureFlowDiagram';

interface Props {
  lang: Lang;
  masteredTopicIds: string[];
  onToggleMastered: (topicId: string) => void;
}

export const PillarMasteryExplorer: React.FC<Props> = ({ lang, masteredTopicIds, onToggleMastered }) => {
  const pillars = getLocalizedPillars(lang);
  const topics = getLocalizedTopics(lang);
  const copy = UI_COPY[lang].explorer;

  const [selectedPillarId, setSelectedPillarId] = useState<string>('pillar-1');
  const pillarTopics = topics.filter((t) => t.pillarId === selectedPillarId);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(pillarTopics[0]?.id || topics[0].id);

  const handleSelectPillar = (pillarId: string) => {
    setSelectedPillarId(pillarId);
    const firstTopic = topics.find((t) => t.pillarId === pillarId);
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
    }
  };

  const currentPillar = pillars.find((p) => p.id === selectedPillarId) || pillars[0];
  const currentTopic: ArchitectureTopic =
    topics.find((t) => t.id === selectedTopicId) || pillarTopics[0] || topics[0];

  const isMastered = masteredTopicIds.includes(currentTopic.id);

  return (
    <div className="explorer-wrapper">
      {/* 5 Pillars Selector Strip */}
      <div className="pillars-strip">
        {pillars.map((pillar) => {
          const topicsInPillar = topics.filter((t) => t.pillarId === pillar.id);
          const doneCount = topicsInPillar.filter((t) => masteredTopicIds.includes(t.id)).length;
          const isActive = pillar.id === selectedPillarId;

          return (
            <button
              key={pillar.id}
              id={`pillar-btn-${pillar.number}`}
              className={`pillar-card-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectPillar(pillar.id)}
            >
              <div className="pillar-card-top">
                <span className="pillar-num-badge">{copy.pillarWord} {pillar.number}</span>
                <span className="pillar-progress-pill">
                  {doneCount}/{topicsInPillar.length} {copy.masteredWord}
                </span>
              </div>
              <strong className="pillar-card-title">{pillar.title}</strong>
              <p className="pillar-card-sub">{pillar.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Topic Selector + Deep-Dive Workbench */}
      <div className="explorer-main-grid">
        {/* Left Sidebar: Topics in Selected Pillar */}
        <aside className="topic-sidebar">
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
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <div className="topic-nav-top">
                    <span className="topic-code">{topic.code}</span>
                    {done && <CheckCircle2 size={15} className="text-success" />}
                  </div>
                  <strong>{topic.title}</strong>
                  <span>{topic.subtitle}</span>
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

            <div className="golden-rule-callout">
              <Compass size={20} />
              <div>
                <strong>{copy.goldenRuleLabel}</strong>
                <p>{currentTopic.goldenRule}</p>
              </div>
            </div>

            <p className="business-context-p">
              <strong>{copy.contextLabel}</strong> {currentTopic.businessContext}
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

          {/* Dimension 1: Quantitative Trade-Off Matrix & Option Comparison */}
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
                  <h4>{opt.name}</h4>
                  <p className="option-tagline">{opt.tagline}</p>

                  <div className="pros-cons-block">
                    <strong>{copy.strengths}</strong>
                    <ul className="pros-list">
                      {opt.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pros-cons-block">
                    <strong>{copy.tradeOffsRisks}</strong>
                    <ul className="cons-list">
                      {opt.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="when-to-use-footer">
                    <strong>{copy.whenToUse}</strong> {opt.whenToUse}
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

          {/* Dimension 2: Design Boundaries & Anti-Patterns ("Tử huyệt") */}
          <div className="two-col-detail-grid">
            <div className="detail-section-card">
              <div className="card-heading">
                <Layers size={18} />
                <h3>{copy.dim2Heading}</h3>
              </div>
              <div className="stack-cards">
                {currentTopic.boundaries.map((b, i) => (
                  <div key={i} className="boundary-item-card">
                    <h4>{b.zone}</h4>
                    <p>
                      <strong>{copy.coreResp}</strong> {b.responsibility}
                    </p>
                    <p className="redline-text">
                      <strong>{copy.neverCross}</strong> {b.mustNeverCross}
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
                    <h4>{ap.name}</h4>
                    <p>
                      <strong>{copy.symptom}</strong> {ap.symptom}
                    </p>
                    <p className="impact-text">
                      <strong>{copy.impact}</strong> {ap.businessImpact}
                    </p>
                    <p className="fix-text">
                      <strong>{copy.remediation}</strong> {ap.remediation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dimension 3: Day-2 Operational Feasibility & Dimension 4: Governance */}
          <div className="two-col-detail-grid">
            <div className="detail-section-card">
              <div className="card-heading">
                <Wrench size={18} />
                <h3>{copy.dim3Heading}</h3>
              </div>
              {currentTopic.day2Ops.map((op, i) => (
                <div key={i} className="day2-card">
                  <h4>{copy.failureScenario} {op.failureMode}</h4>
                  <p>
                    <strong>{copy.blastRadius}</strong> {op.blastRadius}
                  </p>
                  <p>
                    <strong>{copy.day2Mitigation}</strong> {op.mitigationMechanism}
                  </p>
                  <div className="sla-badge-box">
                    <strong>{copy.keySli}</strong> {op.keyMetric}
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
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
