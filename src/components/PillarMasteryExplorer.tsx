import React, { useState } from 'react';
import { PILLARS, TOPICS, type ArchitectureTopic } from '../data/architectureData';
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

interface Props {
  masteredTopicIds: string[];
  onToggleMastered: (topicId: string) => void;
}

export const PillarMasteryExplorer: React.FC<Props> = ({ masteredTopicIds, onToggleMastered }) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pillar-1');
  const pillarTopics = TOPICS.filter((t) => t.pillarId === selectedPillarId);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(pillarTopics[0]?.id || TOPICS[0].id);

  const handleSelectPillar = (pillarId: string) => {
    setSelectedPillarId(pillarId);
    const firstTopic = TOPICS.find((t) => t.pillarId === pillarId);
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
    }
  };

  const currentPillar = PILLARS.find((p) => p.id === selectedPillarId) || PILLARS[0];
  const currentTopic: ArchitectureTopic =
    TOPICS.find((t) => t.id === selectedTopicId) || pillarTopics[0] || TOPICS[0];

  const isMastered = masteredTopicIds.includes(currentTopic.id);

  return (
    <div className="explorer-wrapper">
      {/* 5 Pillars Selector Strip */}
      <div className="pillars-strip">
        {PILLARS.map((pillar) => {
          const topicsInPillar = TOPICS.filter((t) => t.pillarId === pillar.id);
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
                <span className="pillar-num-badge">PILLAR {pillar.number}</span>
                <span className="pillar-progress-pill">
                  {doneCount}/{topicsInPillar.length} Mastered
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
            <span className="eyebrow-tag">PILLAR {currentPillar.number} MODULES</span>
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
            <h4>Core Pillar Mandates</h4>
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
                  MODULE {currentTopic.code} · {currentPillar.shortTitle.toUpperCase()}
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
                {isMastered ? 'Mastered (Completed)' : 'Mark Module Mastered'}
              </button>
            </div>

            <div className="golden-rule-callout">
              <Compass size={20} />
              <div>
                <strong>SA Golden Rule &amp; Decision Threshold:</strong>
                <p>{currentTopic.goldenRule}</p>
              </div>
            </div>

            <p className="business-context-p">
              <strong>Enterprise Context:</strong> {currentTopic.businessContext}
            </p>
          </div>

          {/* Architecture Flow Topology */}
          <div className="detail-section-card">
            <div className="card-heading">
              <Terminal size={18} />
              <h3>Reference Architecture Flow &amp; Control Points</h3>
            </div>
            <pre className="ascii-box">{currentTopic.asciiFlow}</pre>
          </div>

          {/* Dimension 1: Quantitative Trade-Off Matrix & Option Comparison */}
          <div className="detail-section-card">
            <div className="card-heading">
              <Scale size={18} />
              <h3>Dimension 1: Architectural Trade-Off Matrix &amp; Option Evaluation</h3>
            </div>

            <div className="options-grid-3">
              {currentTopic.optionsComparison.options.map((opt, idx) => (
                <div key={opt.id} className={`arch-option-card ${idx === 0 ? 'recommended' : ''}`}>
                  <div className="option-card-header">
                    <span className="option-rank-badge">
                      {idx === 0 ? 'SA RECOMMENDED PATTERN' : `ALTERNATIVE ${idx}`}
                    </span>
                    <div className="option-meta-tags">
                      <span>Cost: {opt.costProfile}</span>
                      <span>Ops: {opt.opsComplexity}</span>
                    </div>
                  </div>
                  <h4>{opt.name}</h4>
                  <p className="option-tagline">{opt.tagline}</p>

                  <div className="pros-cons-block">
                    <strong>Strengths:</strong>
                    <ul className="pros-list">
                      {opt.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pros-cons-block">
                    <strong>Trade-offs / Risks:</strong>
                    <ul className="cons-list">
                      {opt.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="when-to-use-footer">
                    <strong>When to Use:</strong> {opt.whenToUse}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantitative 5-Axis Comparison Bars */}
            <div className="tradeoff-bars-panel">
              <div className="bars-legend">
                <h4>Quantitative Multi-Axis Trade-Off Comparison (0–100 Score)</h4>
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
                <h3>Dimension 2: Design Boundaries &amp; Red Lines</h3>
              </div>
              <div className="stack-cards">
                {currentTopic.boundaries.map((b, i) => (
                  <div key={i} className="boundary-item-card">
                    <h4>{b.zone}</h4>
                    <p>
                      <strong>Core Responsibility:</strong> {b.responsibility}
                    </p>
                    <p className="redline-text">
                      <strong>Boundary Violation (Never Cross):</strong> {b.mustNeverCross}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section-card">
              <div className="card-heading">
                <AlertOctagon size={18} />
                <h3>Fatal Anti-Patterns (&quot;Tử Huyệt Kiến Trúc&quot;)</h3>
              </div>
              <div className="stack-cards">
                {currentTopic.antiPatterns.map((ap, i) => (
                  <div key={i} className="antipattern-item-card">
                    <h4>{ap.name}</h4>
                    <p>
                      <strong>Symptom:</strong> {ap.symptom}
                    </p>
                    <p className="impact-text">
                      <strong>Business Impact:</strong> {ap.businessImpact}
                    </p>
                    <p className="fix-text">
                      <strong>SA Remediation:</strong> {ap.remediation}
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
                <h3>Dimension 3: Day-2 Operational Feasibility</h3>
              </div>
              {currentTopic.day2Ops.map((op, i) => (
                <div key={i} className="day2-card">
                  <h4>Failure Scenario: {op.failureMode}</h4>
                  <p>
                    <strong>Blast Radius:</strong> {op.blastRadius}
                  </p>
                  <p>
                    <strong>Day-2 Mitigation:</strong> {op.mitigationMechanism}
                  </p>
                  <div className="sla-badge-box">
                    <strong>Key Production SLI/SLO:</strong> {op.keyMetric}
                  </div>
                </div>
              ))}
            </div>

            <div className="detail-section-card">
              <div className="card-heading">
                <Shield size={18} />
                <h3>Dimension 4: Architecture Governance Mandates</h3>
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
