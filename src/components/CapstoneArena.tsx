import React, { useState } from 'react';
import {
  getLocalizedCapstone,
  getLocalizedGatekeeper,
  UI_COPY,
  type Lang
} from '../data/i18n';
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target
} from 'lucide-react';
import { GlossaryText } from './GlossaryText';

interface Props {
  lang: Lang;
}

export const CapstoneArena: React.FC<Props> = ({ lang }) => {
  const stages = getLocalizedCapstone(lang);
  const gates = getLocalizedGatekeeper(lang);
  const copy = UI_COPY[lang].capstone;

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

  stages.forEach((stage) => {
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
  const currentStage = stages[activeStageIdx];
  const currentPickedChoice = currentStage.choices.find((c) => c.id === selectedChoices[currentStage.id]);

  const passedGatesCount = Object.values(checkedGates).filter(Boolean).length;

  return (
    <div className="capstone-wrapper">
      <div className="section-header-bar">
        <div>
          <span className="eyebrow-tag">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p className="subtitle-copy">{copy.subtitle}</p>
        </div>
        <button id="btn-reset-capstone" className="btn-ghost-sm" onClick={resetCapstone}>
          <RotateCcw size={15} /> {copy.resetBtn}
        </button>
      </div>

      {/* Top Live Scoreboard */}
      <div className="capstone-scoreboard">
        <div className="score-metric-card">
          <span>{copy.stagesDone}</span>
          <strong>
            {completedStagesCount} / {stages.length}
          </strong>
          <small>{lang === 'vi' ? 'Cả 5 Khối Trụ cột' : 'All 5 Pillars'}</small>
        </div>
        <div className="score-metric-card">
          <span>{copy.masteryScore}</span>
          <strong className={overallMasteryScore >= 85 ? 'text-success' : 'text-amber'}>
            {overallMasteryScore} / 100
          </strong>
          <small>{lang === 'vi' ? 'Đánh đổi, Ranh giới, Day-2 & Quản trị' : 'Trade-offs, Boundaries, Day-2 & Gov'}</small>
        </div>
        <div className="score-metric-card">
          <span>{copy.monthlyOpex}</span>
          <strong>${totalMonthlyCost.toLocaleString()}/mo</strong>
          <small>3Y Run Cost: ${(totalMonthlyCost * 36).toLocaleString()}</small>
        </div>
        <div className="score-metric-card">
          <span>{copy.criticalFlaws}</span>
          <strong className={criticalRisks === 0 ? 'text-success' : 'text-danger'}>{criticalRisks}</strong>
          <small>Worst P95 Latency: {maxLatency} ms</small>
        </div>
      </div>

      {/* Stage Stepper */}
      <div className="stage-stepper">
        {stages.map((st, idx) => {
          const picked = st.choices.find((c) => c.id === selectedChoices[st.id]);
          return (
            <button
              key={st.id}
              id={`capstone-step-${st.stageNumber}`}
              className={`stage-step-btn ${activeStageIdx === idx ? 'active' : ''} ${picked ? (picked.isOptimal ? 'optimal' : 'suboptimal') : ''}`}
              onClick={() => setActiveStageIdx(idx)}
            >
              <span className="step-num">{copy.stageWord} {st.stageNumber}</span>
              <strong className="step-title">{st.pillarBadge.split(':')[0]}</strong>
              <span className="step-status">
                {!picked ? copy.pending : picked.isOptimal ? copy.optimal : copy.riskFlagged}
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
              {copy.stageWord} {currentStage.stageNumber}: {currentStage.title}
            </h3>
          </div>
          {activeStageIdx < stages.length - 1 && (
            <button
              id="btn-next-stage"
              className="btn-secondary-sm"
              onClick={() => setActiveStageIdx(activeStageIdx + 1)}
            >
              {copy.nextStage} <ChevronRight size={15} />
            </button>
          )}
        </div>

        <p className="scenario-narrative"><GlossaryText text={currentStage.scenarioPrompt} /></p>

        <div className="constraints-strip">
          <strong>{copy.constraintsTitle}</strong>
          <ul>
            {currentStage.constraints.map((c, i) => (
              <li key={i}><GlossaryText text={c} /></li>
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
                  <h4><GlossaryText text={ch.label} /></h4>
                  <div className="choice-badges">
                    <span className="badge-mono">${ch.monthlyCostUsd.toLocaleString()}/mo</span>
                    {ch.p95LatencyMs > 0 && <span className="badge-mono">P95: {ch.p95LatencyMs}ms</span>}
                    <span className={`risk-tag ${ch.riskLevel.toLowerCase()}`}>Risk: {ch.riskLevel}</span>
                  </div>
                </div>
                <p className="choice-summary"><GlossaryText text={ch.architectureSummary} /></p>

                {isSelected && (
                  <div className="choice-feedback-box">
                    <div className="feedback-row">
                      <Target size={17} />
                      <div>
                        <strong>{copy.saEval}</strong> <GlossaryText text={ch.architectFeedback} />
                      </div>
                    </div>
                    <div className="feedback-row stakeholder">
                      <Sparkles size={17} />
                      <div>
                        <strong>{copy.boardReaction}</strong> <em><GlossaryText text={ch.stakeholderReaction} /></em>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {currentPickedChoice && activeStageIdx < stages.length - 1 && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              onClick={() => setActiveStageIdx(activeStageIdx + 1)}
            >
              {copy.proceedStage} {currentStage.stageNumber + 1} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 7-Layer SA Decision Gatekeeper Checklist (Expanded from Handbook Section 7) */}
      <div className="gatekeeper-section">
        <div className="panel-title-row">
          <div>
            <span className="eyebrow-tag">{copy.gateEyebrow}</span>
            <h3>
              <ClipboardCheck size={20} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {copy.gateTitle}
            </h3>
            <p className="subtitle-copy">{copy.gateSubtitle}</p>
          </div>
          <div className={`status-pill ${passedGatesCount === 7 ? 'pass' : 'fail'}`}>
            {passedGatesCount} / 7 {copy.gatesVerified}
          </div>
        </div>

        <div className="gatekeeper-grid">
          {gates.map((gate) => {
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
                    <strong><GlossaryText text={gate.layer} /></strong>
                  </label>
                  <span className="pillar-mini-tag">{gate.pillarBadge}</span>
                </div>
                <p className="gate-question"><GlossaryText text={gate.question} /></p>
                <div className="gate-details">
                  <div className="gate-redline">
                    <ShieldAlert size={14} />
                    <span>
                      <strong>{copy.ifViolated}</strong> <GlossaryText text={gate.redLineFailure} />
                    </span>
                  </div>
                  <div className="gate-fix">
                    <CheckCircle2 size={14} />
                    <span>
                      <strong>{copy.saStandard}</strong> <GlossaryText text={gate.architectRemediation} />
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
