import React, { useState } from 'react';
import { CAPSTONE_STAGES, SA_DECISION_CHECKLIST } from '../data/architectureData';
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target
} from 'lucide-react';

export const CapstoneArena: React.FC = () => {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [checkedGates, setCheckedGates] = useState<Record<string, boolean>>({
    'gate-1': true,
    'gate-2': true,
    'gate-3': true,
    'gate-4': true,
    'gate-5': true,
    'gate-6': true,
    'gate-7': true
  });

  const handleSelectChoice = (stageId: string, choiceId: string) => {
    setSelectedChoices((prev) => ({ ...prev, [stageId]: choiceId }));
  };

  const resetCapstone = () => {
    setSelectedChoices({});
    setActiveStageIdx(0);
  };

  // Compute cumulative Capstone telemetry
  let totalTradeOff = 0;
  let totalBoundary = 0;
  let totalDay2 = 0;
  let totalGov = 0;
  let totalMonthlyCost = 0;
  let maxLatency = 0;
  let criticalRisks = 0;

  CAPSTONE_STAGES.forEach((stage) => {
    const pickedId = selectedChoices[stage.id];
    const choice = stage.choices.find((c) => c.id === pickedId);
    if (choice) {
      totalTradeOff += choice.scoreDelta.tradeOffMastery;
      totalBoundary += choice.scoreDelta.boundaryIntegrity;
      totalDay2 += choice.scoreDelta.day2Feasibility;
      totalGov += choice.scoreDelta.governanceCompliance;
      totalMonthlyCost += choice.monthlyCostUsd;
      maxLatency = Math.max(maxLatency, choice.p95LatencyMs);
      if (choice.riskLevel === 'Critical') criticalRisks += 1;
    }
  });

  const completedStagesCount = Object.keys(selectedChoices).length;
  const overallMasteryScore = Math.round((totalTradeOff + totalBoundary + totalDay2 + totalGov) / 4);
  const currentStage = CAPSTONE_STAGES[activeStageIdx];
  const currentPickedChoice = currentStage.choices.find((c) => c.id === selectedChoices[currentStage.id]);

  const passedGatesCount = Object.values(checkedGates).filter(Boolean).length;

  return (
    <div className="capstone-wrapper">
      <div className="section-header-bar">
        <div>
          <span className="eyebrow-tag">END-TO-END ENTERPRISE CAPSTONE &amp; GATEKEEPER</span>
          <h2>Project Horizon: Global SAP + M365 + Agentic AI Supply Chain Transformation</h2>
          <p className="subtitle-copy">
            Navigate a 5-stage enterprise transformation spanning all 5 pillars. Every architectural decision impacts your 36-month TCO, P95 latency, Day-2 resilience, and Executive Board approval.
          </p>
        </div>
        <button id="btn-reset-capstone" className="btn-ghost-sm" onClick={resetCapstone}>
          <RotateCcw size={15} /> Reset Scenario
        </button>
      </div>

      {/* Top Live Scoreboard */}
      <div className="capstone-scoreboard">
        <div className="score-metric-card">
          <span>Stages Completed</span>
          <strong>
            {completedStagesCount} / {CAPSTONE_STAGES.length}
          </strong>
          <small>All 5 Pillars</small>
        </div>
        <div className="score-metric-card">
          <span>Architecture Mastery Score</span>
          <strong className={overallMasteryScore >= 85 ? 'text-success' : 'text-amber'}>
            {overallMasteryScore} / 100
          </strong>
          <small>Trade-offs, Boundaries, Day-2 &amp; Gov</small>
        </div>
        <div className="score-metric-card">
          <span>Cumulative Monthly OpEx</span>
          <strong>${totalMonthlyCost.toLocaleString()}/mo</strong>
          <small>3Y Run Cost: ${(totalMonthlyCost * 36).toLocaleString()}</small>
        </div>
        <div className="score-metric-card">
          <span>Critical Governance / SLA Flaws</span>
          <strong className={criticalRisks === 0 ? 'text-success' : 'text-danger'}>{criticalRisks}</strong>
          <small>Worst P95 Latency: {maxLatency} ms</small>
        </div>
      </div>

      {/* Stage Stepper */}
      <div className="stage-stepper">
        {CAPSTONE_STAGES.map((st, idx) => {
          const picked = st.choices.find((c) => c.id === selectedChoices[st.id]);
          return (
            <button
              key={st.id}
              id={`capstone-step-${st.stageNumber}`}
              className={`stage-step-btn ${activeStageIdx === idx ? 'active' : ''} ${picked ? (picked.isOptimal ? 'optimal' : 'suboptimal') : ''}`}
              onClick={() => setActiveStageIdx(idx)}
            >
              <span className="step-num">Stage {st.stageNumber}</span>
              <strong className="step-title">{st.pillarBadge.split(':')[0]}</strong>
              <span className="step-status">
                {!picked ? 'Pending Decision' : picked.isOptimal ? 'Optimal Architecture' : 'Risk Flagged'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Decision Workspace */}
      <div className="capstone-stage-card">
        <div className="stage-card-header">
          <div>
            <span className="pillar-chip">{currentStage.pillarBadge}</span>
            <h3>
              Stage {currentStage.stageNumber}: {currentStage.title}
            </h3>
          </div>
          {activeStageIdx < CAPSTONE_STAGES.length - 1 && (
            <button
              id="btn-next-stage"
              className="btn-secondary-sm"
              onClick={() => setActiveStageIdx(activeStageIdx + 1)}
            >
              Next Stage <ChevronRight size={15} />
            </button>
          )}
        </div>

        <p className="scenario-narrative">{currentStage.scenarioPrompt}</p>

        <div className="constraints-strip">
          <strong>Hard Enterprise Constraints:</strong>
          <ul>
            {currentStage.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="capstone-choices-list">
          {currentStage.choices.map((ch) => {
            const isSelected = selectedChoices[currentStage.id] === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChoice(currentStage.id, ch.id)}
                className={`capstone-choice-item ${isSelected ? (ch.isOptimal ? 'selected-optimal' : 'selected-risk') : ''}`}
              >
                <div className="choice-top-bar">
                  <h4>{ch.label}</h4>
                  <div className="choice-badges">
                    <span className="badge-mono">${ch.monthlyCostUsd.toLocaleString()}/mo</span>
                    {ch.p95LatencyMs > 0 && <span className="badge-mono">P95: {ch.p95LatencyMs}ms</span>}
                    <span className={`risk-tag ${ch.riskLevel.toLowerCase()}`}>Risk: {ch.riskLevel}</span>
                  </div>
                </div>
                <p className="choice-summary">{ch.architectureSummary}</p>

                {isSelected && (
                  <div className="choice-feedback-box">
                    <div className="feedback-row">
                      <Target size={17} />
                      <div>
                        <strong>Principal Architect Evaluation:</strong> {ch.architectFeedback}
                      </div>
                    </div>
                    <div className="feedback-row stakeholder">
                      <Sparkles size={17} />
                      <div>
                        <strong>Executive Board Reaction:</strong> <em>{ch.stakeholderReaction}</em>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {currentPickedChoice && activeStageIdx < CAPSTONE_STAGES.length - 1 && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              onClick={() => setActiveStageIdx(activeStageIdx + 1)}
            >
              Proceed to Stage {currentStage.stageNumber + 1} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 7-Layer SA Decision Gatekeeper Checklist (Expanded from Handbook Section 7) */}
      <div className="gatekeeper-section">
        <div className="panel-title-row">
          <div>
            <span className="eyebrow-tag">HANDBOOK SECTION 7 + ENTERPRISE EXTENSIONS</span>
            <h3>
              <ClipboardCheck size={20} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              7-Layer Solution Architect Decision Gatekeeper Checklist
            </h3>
            <p className="subtitle-copy">
              Before approving any enterprise or AI architecture at the Architecture Review Board (ARB), verify all 7 red-line gates below.
            </p>
          </div>
          <div className={`status-pill ${passedGatesCount === 7 ? 'pass' : 'fail'}`}>
            {passedGatesCount} / 7 GATES VERIFIED
          </div>
        </div>

        <div className="gatekeeper-grid">
          {SA_DECISION_CHECKLIST.map((gate) => {
            const isChecked = !!checkedGates[gate.id];
            return (
              <div key={gate.id} className={`gate-card ${isChecked ? 'verified' : 'unverified'}`}>
                <div className="gate-header">
                  <label className="gate-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setCheckedGates((prev) => ({ ...prev, [gate.id]: e.target.checked }))
                      }
                    />
                    <strong>{gate.layer}</strong>
                  </label>
                  <span className="pillar-mini-tag">{gate.pillarBadge}</span>
                </div>
                <p className="gate-question">{gate.question}</p>
                <div className="gate-details">
                  <div className="gate-redline">
                    <ShieldAlert size={14} />
                    <span>
                      <strong>If Violated:</strong> {gate.redLineFailure}
                    </span>
                  </div>
                  <div className="gate-fix">
                    <CheckCircle2 size={14} />
                    <span>
                      <strong>SA Standard:</strong> {gate.architectRemediation}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
