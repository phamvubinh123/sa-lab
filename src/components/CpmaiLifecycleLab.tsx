import React, { useState, useEffect } from 'react';
import type { Lang } from '../data/i18n';
import {
  CPMAI_PHASES,
  CPMAI_PROJECT_PRESETS,
  SEVEN_AI_PATTERNS,
  TRUSTWORTHY_AI_LAYERS,
  type CpmaiPhaseId
} from '../data/cpmaiData';
import { GlossaryText } from './GlossaryText';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  Compass,
  Cpu,
  Database,
  FileCheck2,
  GitBranch,
  Layers,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Wrench
} from 'lucide-react';

interface Props {
  lang: Lang;
}

type GateStatus = 'GO' | 'CONDITIONAL' | 'NO-GO';

interface CpmaiProjectState {
  presetId: string;
  projectName: string;
  businessKpi: string;

  // Phase 1: Business Understanding
  canSolveWithRules: boolean; // Golden Question! True => NO-GO for AI
  selectedPatternId: string;
  bizValueScore: number; // 1-100
  dataFeasibilityScore: number; // 1-100
  orgReadinessScore: number; // 1-100

  // Phase 2: Data Understanding
  dataRelevance: number; // 0-100
  dataVolumeTb: number; // 1-500 (volume != quality!)
  noDataLeakage: boolean;
  biasAudited: boolean;
  legalRbacCleared: boolean;
  sanctionedSource: boolean; // SAP ODP/SLT or clean API vs raw scraping

  // Phase 3: Data Preparation
  dataPrepEffortPct: number; // CPMAI 80/20 rule (recommended 60-80%)
  consensusGroundTruth: boolean;
  automatedVersionedPipeline: boolean; // Prevents Training-Serving Skew
  hybridChunkingIndex: boolean;
  hallucinationFirewall: boolean;

  // Phase 4: Model Development
  devPath: 'genai-adapt' | 'ml-build';
  useModelRouter: boolean; // 75/25 SLM/LLM
  useRbacSemanticCache: boolean; // P3.3 cosine > 0.92 + RBAC Hash
  useHybridRag: boolean; // BM25 + Vector + Reranker
  useMcpBoundaries: boolean;

  // Phase 5: Model Evaluation
  techAccuracyPct: number; // e.g. 96%
  businessKpiAchievedPct: number; // e.g. 88% (if high tech, low biz => Accuracy Trap!)
  ragasFaithfulnessPct: number; // >= 85%
  trustworthyChecks: Record<string, boolean>;

  // Phase 6: Model Operationalization
  scaffoldingDecoupled: boolean; // UI Scaffolding vs Back-end Engine
  driftMonitoringActive: boolean;
  multiLlmFallbackActive: boolean;
  wormAuditActive: boolean;
  sunsettingPlanReady: boolean;
  simulatedDriftSeverity: number; // 0-40% drift shock
}

const buildDefaultState = (presetId: string, lang: Lang): CpmaiProjectState => {
  const preset = CPMAI_PROJECT_PRESETS.find((p) => p.id === presetId) || CPMAI_PROJECT_PRESETS[0];
  return {
    presetId: preset.id,
    projectName: lang === 'vi' ? preset.nameVi : preset.nameEn,
    businessKpi: lang === 'vi' ? preset.targetBusinessKpiVi : preset.targetBusinessKpiEn,

    canSolveWithRules: false,
    selectedPatternId: preset.recommendedPatternId,
    bizValueScore: 86,
    dataFeasibilityScore: 78,
    orgReadinessScore: 74,

    dataRelevance: 82,
    dataVolumeTb: 45,
    noDataLeakage: true,
    biasAudited: true,
    legalRbacCleared: true,
    sanctionedSource: true,

    dataPrepEffortPct: 75,
    consensusGroundTruth: true,
    automatedVersionedPipeline: true,
    hybridChunkingIndex: true,
    hallucinationFirewall: true,

    devPath: preset.recommendedPath,
    useModelRouter: true,
    useRbacSemanticCache: true,
    useHybridRag: true,
    useMcpBoundaries: true,

    techAccuracyPct: 95,
    businessKpiAchievedPct: 88,
    ragasFaithfulnessPct: 91,
    trustworthyChecks: {
      fairness: true,
      transparency: true,
      privacy: true,
      safety: true,
      accountability: true
    },

    scaffoldingDecoupled: true,
    driftMonitoringActive: true,
    multiLlmFallbackActive: true,
    wormAuditActive: true,
    sunsettingPlanReady: true,
    simulatedDriftSeverity: 15
  };
};

export const CpmaiLifecycleLab: React.FC<Props> = ({ lang }) => {
  const isVi = lang === 'vi';
  const [activePhase, setActivePhase] = useState<CpmaiPhaseId>('phase-1');
  const [copiedBlueprint, setCopiedBlueprint] = useState<boolean>(false);

  const [state, setState] = useState<CpmaiProjectState>(() => {
    try {
      const saved = localStorage.getItem('salab_cpmai_project_v2');
      if (saved) return JSON.parse(saved) as CpmaiProjectState;
    } catch {
      // ignore storage error
    }
    return buildDefaultState('horizon-copilot', lang);
  });

  useEffect(() => {
    try {
      localStorage.setItem('salab_cpmai_project_v2', JSON.stringify(state));
    } catch {
      // ignore storage error
    }
  }, [state]);

  const loadPreset = (presetId: string) => {
    setState(buildDefaultState(presetId, lang));
    setActivePhase('phase-1');
  };

  const patch = (partial: Partial<CpmaiProjectState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  // === COMPUTE LIVE GATE STATUS FOR ALL 6 PHASES ===
  // Phase 1 Gate
  const avgFeasibility = Math.round(
    (state.bizValueScore + state.dataFeasibilityScore + state.orgReadinessScore) / 3
  );
  const p1Gate: GateStatus = state.canSolveWithRules
    ? 'NO-GO'
    : avgFeasibility >= 75 && state.bizValueScore >= 70 && state.dataFeasibilityScore >= 65
    ? 'GO'
    : avgFeasibility >= 55
    ? 'CONDITIONAL'
    : 'NO-GO';

  // Phase 2 Gate
  const p2ChecksPassed = [
    state.noDataLeakage,
    state.biasAudited,
    state.legalRbacCleared,
    state.sanctionedSource
  ].filter(Boolean).length;
  const dataReadinessScore = Math.round(state.dataRelevance * 0.5 + p2ChecksPassed * 12.5);
  const p2Gate: GateStatus =
    !state.legalRbacCleared || state.dataRelevance < 50
      ? 'NO-GO'
      : dataReadinessScore >= 80 && p2ChecksPassed === 4
      ? 'GO'
      : 'CONDITIONAL';

  // Phase 3 Gate
  const p3ChecksPassed = [
    state.consensusGroundTruth,
    state.automatedVersionedPipeline,
    state.hybridChunkingIndex,
    state.hallucinationFirewall
  ].filter(Boolean).length;
  const effortHealthy = state.dataPrepEffortPct >= 55 && state.dataPrepEffortPct <= 85;
  const p3Gate: GateStatus =
    !state.automatedVersionedPipeline || state.dataPrepEffortPct < 35
      ? 'NO-GO'
      : p3ChecksPassed >= 3 && effortHealthy
      ? 'GO'
      : 'CONDITIONAL';

  // Phase 4 Gate & Live FinOps Economics
  const baseMonthlyOpex = state.devPath === 'genai-adapt' ? 38000 : 14000;
  const routerFactor = state.devPath === 'genai-adapt' && state.useModelRouter ? 0.35 : 1;
  const cacheFactor = state.devPath === 'genai-adapt' && state.useRbacSemanticCache ? 0.65 : 1;
  const estMonthlyOpex = Math.round(baseMonthlyOpex * routerFactor * cacheFactor);
  const estLatencyMs =
    state.devPath === 'ml-build'
      ? 45
      : state.useRbacSemanticCache
      ? state.useModelRouter
        ? 380
        : 920
      : state.useModelRouter
      ? 720
      : 2100;
  const p4Score = [
    state.useModelRouter,
    state.useRbacSemanticCache,
    state.useHybridRag,
    state.useMcpBoundaries
  ].filter(Boolean).length;
  const p4Gate: GateStatus =
    state.devPath === 'ml-build'
      ? 'GO'
      : estMonthlyOpex > 25000
      ? 'NO-GO'
      : p4Score >= 3
      ? 'GO'
      : 'CONDITIONAL';

  // Phase 5 Gate & Accuracy Trap Detector
  const trustworthyCount = Object.values(state.trustworthyChecks).filter(Boolean).length;
  const isAccuracyTrap = state.techAccuracyPct >= 88 && state.businessKpiAchievedPct < 70;
  const p5Gate: GateStatus =
    isAccuracyTrap || state.businessKpiAchievedPct < 65 || trustworthyCount < 3
      ? 'NO-GO'
      : state.businessKpiAchievedPct >= 80 &&
        state.ragasFaithfulnessPct >= 85 &&
        trustworthyCount === 5
      ? 'GO'
      : 'CONDITIONAL';

  // Phase 6 Gate & Drift Resilience
  const p6Controls = [
    state.scaffoldingDecoupled,
    state.driftMonitoringActive,
    state.multiLlmFallbackActive,
    state.wormAuditActive,
    state.sunsettingPlanReady
  ].filter(Boolean).length;
  const effectiveDriftRisk = Math.max(
    0,
    state.simulatedDriftSeverity -
      (state.driftMonitoringActive ? 12 : 0) -
      (state.multiLlmFallbackActive ? 8 : 0) -
      (state.scaffoldingDecoupled ? 5 : 0)
  );
  const p6Gate: GateStatus =
    !state.driftMonitoringActive || !state.wormAuditActive
      ? 'NO-GO'
      : p6Controls === 5 && effectiveDriftRisk <= 12
      ? 'GO'
      : 'CONDITIONAL';

  const phaseGates: Record<CpmaiPhaseId, GateStatus> = {
    'phase-1': p1Gate,
    'phase-2': p2Gate,
    'phase-3': p3Gate,
    'phase-4': p4Gate,
    'phase-5': p5Gate,
    'phase-6': p6Gate
  };

  const goCount = Object.values(phaseGates).filter((g) => g === 'GO').length;
  const overallReadinessPct = Math.round(
    (Object.values(phaseGates).reduce(
      (acc, g) => acc + (g === 'GO' ? 100 : g === 'CONDITIONAL' ? 60 : 15),
      0
    ) /
      600) *
      100
  );

  const currentPhaseMeta = CPMAI_PHASES.find((p) => p.id === activePhase) || CPMAI_PHASES[0];
  const selectedPattern =
    SEVEN_AI_PATTERNS.find((p) => p.id === state.selectedPatternId) || SEVEN_AI_PATTERNS[0];

  const generateMarkdownCharter = () => {
    return `# PMI-CPMAI AI Project Charter & SA Architecture Blueprint
- **Project**: ${state.projectName}
- **Target Business KPI**: ${state.businessKpi}
- **Overall CPMAI Readiness**: ${overallReadinessPct}% (${goCount}/6 Gates GO)

## Phase I — Business Understanding [${p1Gate}]
- **Golden Question ("Can rules solve 90%?")**: ${state.canSolveWithRules ? 'YES (NO-GO AI — Use Rules Engine)' : 'NO (AI Justified)'}
- **AI Pattern**: ${selectedPattern.nameEn}
- **Mapped SA-Lab Pillars**: ${selectedPattern.saPillarMapping}
- **Feasibility Scores**: Business Value ${state.bizValueScore}% | Data ${state.dataFeasibilityScore}% | Org Readiness ${state.orgReadinessScore}%

## Phase II — Data Understanding [${p2Gate}]
- **Data Readiness Score**: ${dataReadinessScore}% (Relevance: ${state.dataRelevance}%, Volume: ${state.dataVolumeTb} TB)
- **Controls**: Leakage Audit=${state.noDataLeakage}, Bias Audit=${state.biasAudited}, Legal/RBAC=${state.legalRbacCleared}, Sanctioned Source=${state.sanctionedSource}

## Phase III — Data Preparation [${p3Gate}]
- **Data Prep Effort Allocation (80/20 Rule)**: ${state.dataPrepEffortPct}%
- **Pipeline Controls**: Consensus Ground Truth=${state.consensusGroundTruth}, Automated Versioned Pipeline=${state.automatedVersionedPipeline}, Hybrid Index=${state.hybridChunkingIndex}, Hallucination Firewall=${state.hallucinationFirewall}

## Phase IV — Model Development [${p4Gate}]
- **Approach**: ${state.devPath === 'genai-adapt' ? 'Path B: Accelerated GenAI (Adopt/Adapt)' : 'Path A: Traditional ML (Build from Scratch)'}
- **Estimated Monthly Inference OpEx**: $${estMonthlyOpex.toLocaleString()}/mo | **P95 Latency**: ${estLatencyMs} ms
- **Safeguards**: 75/25 Model Router=${state.useModelRouter}, RBAC Semantic Cache=${state.useRbacSemanticCache}, Hybrid RAG=${state.useHybridRag}, MCP Boundaries=${state.useMcpBoundaries}

## Phase V — Model Evaluation [${p5Gate}]
- **Technical Accuracy**: ${state.techAccuracyPct}% | **Business KPI Impact**: ${state.businessKpiAchievedPct}% | **RAGAS Faithfulness**: ${state.ragasFaithfulnessPct}%
- **Accuracy Trap Alert**: ${isAccuracyTrap ? 'DETECTED — Loop Back Required!' : 'Clear'}
- **Trustworthy AI Layers Verified**: ${trustworthyCount}/5

## Phase VI — Model Operationalization [${p6Gate}]
- **Scaffolding Decoupled**: ${state.scaffoldingDecoupled} | **Drift Monitoring**: ${state.driftMonitoringActive} | **Multi-LLM Fallback**: ${state.multiLlmFallbackActive}
- **WORM Audit Trail**: ${state.wormAuditActive} | **Model Sunsetting Plan**: ${state.sunsettingPlanReady}
`;
  };

  const handleCopyBlueprint = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdownCharter());
      setCopiedBlueprint(true);
      setTimeout(() => setCopiedBlueprint(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  const gateLabel = (g: GateStatus) => {
    if (g === 'GO') return 'GO';
    if (g === 'CONDITIONAL') return isVi ? 'GO CÓ ĐIỀU KIỆN' : 'CONDITIONAL GO';
    return 'NO-GO';
  };

  return (
    <div className="cpmai-wrapper">
      {/* Top Project Context & Readiness Bar */}
      <div className="cpmai-hero-card">
        <div className="cpmai-hero-top">
          <div>
            <span className="eyebrow-tag">
              {isVi
                ? 'QUẢN TRỊ DỰ ÁN AI TOÀN VÒNG ĐỜI · CHUẨN PMI-CPMAI™'
                : 'FULL AI PROJECT LIFECYCLE WORKBENCH · PMI-CPMAI™ STANDARD'}
            </span>
            <h2>
              {isVi
                ? 'Xây dựng Dự án AI Thực chiến qua 6 Giai đoạn & Giả lập Tương tác'
                : 'Hands-On 6-Phase AI Lifecycle Builder & Interactive Simulators'}
            </h2>
            <p className="subtitle-copy">
              {isVi
                ? 'Chọn dự án mẫu (hoặc tự nhập bài toán của bạn), thực hành từng công cụ ở 6 Phase CPMAI, kiểm tra Go/No-Go Gate và xuất AI Project Charter + SA Blueprint.'
                : 'Pick a real-world preset (or enter your own initiative), run hands-on simulators across all 6 CPMAI phases, clear Go/No-Go Gates, and export an executive Charter + SA Blueprint.'}
            </p>
          </div>
          <div className="cpmai-readiness-box">
            <span>{isVi ? 'Độ sẵn sàng Dự án AI' : 'AI Project Readiness'}</span>
            <strong className={overallReadinessPct >= 80 ? 'text-success' : 'text-amber'}>
              {overallReadinessPct}%
            </strong>
            <small>
              {goCount}/6 {isVi ? 'Cổng Gate đạt GO' : 'Phase Gates GO'}
            </small>
          </div>
        </div>

        {/* Preset Selector + Editable Project Name & KPI */}
        <div className="cpmai-preset-strip">
          <span className="cpmai-preset-label">
            {isVi ? 'Kịch bản dự án mẫu:' : 'Project Presets:'}
          </span>
          <div className="cpmai-preset-pills">
            {CPMAI_PROJECT_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`cpmai-preset-btn ${state.presetId === p.id ? 'active' : ''}`}
                onClick={() => loadPreset(p.id)}
              >
                {isVi ? p.nameVi.split(':')[0] : p.nameEn.split(':')[0]}
              </button>
            ))}
            <button
              type="button"
              className="btn-ghost-sm"
              onClick={() => loadPreset(state.presetId)}
              title={isVi ? 'Đặt lại dự án hiện tại' : 'Reset current project'}
            >
              <RotateCcw size={13} /> {isVi ? 'Reset' : 'Reset'}
            </button>
          </div>
        </div>

        <div className="cpmai-project-inputs">
          <div>
            <label htmlFor="cpmai-proj-name">
              {isVi ? 'Tên Dự án AI của bạn' : 'Your AI Project Name'}
            </label>
            <input
              id="cpmai-proj-name"
              type="text"
              value={state.projectName}
              onChange={(e) => patch({ projectName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="cpmai-proj-kpi">
              {isVi ? 'KPI Kinh doanh Mục tiêu (Business Outcome)' : 'Target Business KPI (ROI Outcome)'}
            </label>
            <input
              id="cpmai-proj-kpi"
              type="text"
              value={state.businessKpi}
              onChange={(e) => patch({ businessKpi: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 6-Phase Iterative Loop Stepper */}
      <div className="cpmai-phase-stepper" role="tablist" aria-label="6 CPMAI Phases">
        {CPMAI_PHASES.map((ph) => {
          const g = phaseGates[ph.id];
          const isCurrent = ph.id === activePhase;
          return (
            <button
              key={ph.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              className={`cpmai-phase-btn ${isCurrent ? 'active' : ''} gate-${g.toLowerCase()}`}
              onClick={() => setActivePhase(ph.id)}
            >
              <div className="cpmai-phase-top">
                <span className="cpmai-roman">Phase {ph.roman}</span>
                <span className={`cpmai-gate-pill ${g.toLowerCase()}`}>{gateLabel(g)}</span>
              </div>
              <strong>{isVi ? ph.titleVi : ph.titleEn}</strong>
              <span className="cpmai-bridge-mini">{ph.saBridge}</span>
            </button>
          );
        })}
      </div>

      {/* Active Phase Workspace */}
      <div className="cpmai-workspace-card">
        <div className="cpmai-phase-header">
          <div>
            <span className="pillar-chip">
              PMI-CPMAI Phase {currentPhaseMeta.roman} · {currentPhaseMeta.saBridge}
            </span>
            <h3>{isVi ? currentPhaseMeta.titleVi : currentPhaseMeta.titleEn}</h3>
            <p className="subtitle-copy">
              <GlossaryText text={isVi ? currentPhaseMeta.taglineVi : currentPhaseMeta.taglineEn} />
            </p>
          </div>
          <div className={`status-pill ${phaseGates[activePhase] === 'GO' ? 'pass' : 'fail'}`}>
            Gate {currentPhaseMeta.roman}: {gateLabel(phaseGates[activePhase])}
          </div>
        </div>

        <div className="golden-rule-callout">
          <Compass size={19} />
          <div>
            <strong>{isVi ? 'Nguyên tắc Cốt lõi PMI-CPMAI' : 'PMI-CPMAI Core Principle'}</strong>
            <p>
              <GlossaryText text={isVi ? currentPhaseMeta.cpmaiRuleVi : currentPhaseMeta.cpmaiRuleEn} />
            </p>
          </div>
        </div>

        {/* === PHASE I SIMULATOR: BUSINESS UNDERSTANDING === */}
        {activePhase === 'phase-1' && (
          <div className="cpmai-tool-grid">
            <div className="cpmai-tool-panel">
              <h4>
                <Sliders size={16} />{' '}
                {isVi
                  ? 'Công cụ 1: Bộ lọc "Câu hỏi Vàng" & 3 Trụ cột Khả thi'
                  : 'Tool 1: "Why AI?" Golden Question Filter & Feasibility'}
              </h4>

              <label className={`toggle-card ${state.canSolveWithRules ? 'danger-toggle' : 'enabled'}`}>
                <input
                  type="checkbox"
                  checked={state.canSolveWithRules}
                  onChange={(e) => patch({ canSolveWithRules: e.target.checked })}
                />
                <div>
                  <strong>
                    {isVi
                      ? 'Có thể giải 90% bài toán bằng luật cứng (if/else, SQL, RPA)?'
                      : 'Can deterministic rules (if/else, SQL, RPA) solve 90% of this?'}
                  </strong>
                  <span>
                    {state.canSolveWithRules
                      ? isVi
                        ? 'CẢNH BÁO NO-GO: Đừng dùng búa AI đi đóng đinh thường! Hãy dùng phần mềm truyền thống.'
                        : 'NO-GO ALERT: Avoid "Hammer Looking for a Nail"—use standard automation instead of AI.'
                      : isVi
                      ? 'Đạt chuẩn: Bài toán có dữ liệu phi cấu trúc / mẫu phức tạp cần AI giải quyết.'
                      : 'Passed: Problem exhibits probabilistic / unstructured complexity justifying AI.'}
                  </span>
                </div>
              </label>

              <div className="control-group" style={{ marginTop: '0.9rem' }}>
                <div className="control-label-row">
                  <label>{isVi ? '1. Giá trị Kinh doanh & ROI (Business Value)' : '1. Defensible Business ROI'}</label>
                  <span className="mono-value">{state.bizValueScore}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={state.bizValueScore}
                  onChange={(e) => patch({ bizValueScore: Number(e.target.value) })}
                />
              </div>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? '2. Khả thi Dữ liệu sơ bộ (Data Availability)' : '2. Initial Data Feasibility'}</label>
                  <span className="mono-value">{state.dataFeasibilityScore}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={state.dataFeasibilityScore}
                  onChange={(e) => patch({ dataFeasibilityScore: Number(e.target.value) })}
                />
              </div>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? '3. Sẵn sàng Đội ngũ & Tổ chức (Org Readiness)' : '3. Org & Skills Readiness'}</label>
                  <span className="mono-value">{state.orgReadinessScore}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={state.orgReadinessScore}
                  onChange={(e) => patch({ orgReadinessScore: Number(e.target.value) })}
                />
              </div>

              <div className={`alert-banner ${p1Gate === 'GO' ? 'success' : 'danger'}`}>
                {p1Gate === 'GO' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <div>
                  <strong>Gate I ({gateLabel(p1Gate)}): </strong>
                  {state.canSolveWithRules
                    ? isVi
                      ? 'Dừng dự án AI ngay tại Phase I! Xây dựng bằng Rules Engine / SQL giúp tiết kiệm 90% chi phí và rủi ro.'
                      : 'Stop the AI project at Phase I! Solve it deterministically to save 90% cost and risk.'
                    : p1Gate === 'GO'
                    ? isVi
                      ? `Điểm khả thi trung bình ${avgFeasibility}% — Đủ điều kiện bước sang Phase II (Data Understanding).`
                      : `Average feasibility ${avgFeasibility}%—Cleared to advance to Phase II (Data Understanding).`
                    : isVi
                    ? `Vùng xám (Gray Area Rule — ${avgFeasibility}%): Chỉ cấp "Conditional Go" để làm khám phá dữ liệu nhỏ (Time-boxed Spike), chưa duyệt ngân sách lớn.`
                    : `Gray Area Rule (${avgFeasibility}%): Issue Conditional Go for a small time-boxed data spike before full funding.`}
                </div>
              </div>
            </div>

            <div className="cpmai-tool-panel">
              <h4>
                <GitBranch size={16} />{' '}
                {isVi
                  ? 'Công cụ 2: Bộ định vị 7 Patterns of AI → Kiến trúc SA'
                  : 'Tool 2: 7 Patterns of AI Matcher → SA Architecture Bridge'}
              </h4>
              <div className="cpmai-pattern-list">
                {SEVEN_AI_PATTERNS.map((pat) => {
                  const active = pat.id === state.selectedPatternId;
                  return (
                    <button
                      key={pat.id}
                      type="button"
                      className={`cpmai-pattern-card ${active ? 'selected' : ''}`}
                      onClick={() => patch({ selectedPatternId: pat.id })}
                    >
                      <strong>{isVi ? pat.nameVi : pat.nameEn}</strong>
                      <span>{isVi ? pat.useCaseVi : pat.useCaseEn}</span>
                      <code className="cpmai-sa-link">SA-Lab: {pat.saPillarMapping}</code>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === PHASE II SIMULATOR: DATA UNDERSTANDING === */}
        {activePhase === 'phase-2' && (
          <div className="cpmai-tool-grid">
            <div className="cpmai-tool-panel">
              <h4>
                <Database size={16} />{' '}
                {isVi
                  ? 'Bộ kiểm toán Dữ liệu & Chặn GIGO (Data Health Auditor)'
                  : 'Data Readiness & GIGO Auditor'}
              </h4>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? 'Độ liên quan & Sạch của Dữ liệu (Relevance)' : 'Data Relevance & Quality'}</label>
                  <span className="mono-value">{state.dataRelevance}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={100}
                  value={state.dataRelevance}
                  onChange={(e) => patch({ dataRelevance: Number(e.target.value) })}
                />
              </div>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? 'Dung lượng Dữ liệu (Volume — không quyết định điểm!)' : 'Data Volume (TB — volume alone ≠ quality!)'}</label>
                  <span className="mono-value">{state.dataVolumeTb} TB</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={500}
                  value={state.dataVolumeTb}
                  onChange={(e) => patch({ dataVolumeTb: Number(e.target.value) })}
                />
              </div>

              <div className="toggle-list">
                <label className={`toggle-card ${state.noDataLeakage ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.noDataLeakage}
                    onChange={(e) => patch({ noDataLeakage: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Đã rà soát chống Data Leakage' : 'Data Leakage Audited'}</strong>
                    <span>
                      {isVi
                        ? 'Đảm bảo dữ liệu tương lai / đáp án không bị lọt vào tập huấn luyện.'
                        : 'Verify future target labels do not accidentally leak into training features.'}
                    </span>
                  </div>
                </label>

                <label className={`toggle-card ${state.biasAudited ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.biasAudited}
                    onChange={(e) => patch({ biasAudited: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Đã kiểm tra Thiên lệch Lịch sử (Bias)' : 'Historical Bias Audited'}</strong>
                    <span>
                      {isVi
                        ? 'Dữ liệu đại diện cho thực tế Production (tránh bẫy "Hothouse Flower").'
                        : 'Data reflects live production edge cases (avoiding "Hothouse Flower" lab models).'}
                    </span>
                  </div>
                </label>

                <label className={`toggle-card ${state.legalRbacCleared ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.legalRbacCleared}
                    onChange={(e) => patch({ legalRbacCleared: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Đã duyệt Pháp lý PII & Quyền M365 RBAC' : 'Legal PII & M365 RBAC Cleared'}</strong>
                    <span>
                      {isVi
                        ? 'Tuân thủ Nghị định 13 / GDPR và thiết kế kế thừa quyền Entra ID OBO.'
                        : 'Compliant with GDPR/Data Sovereignty and Entra ID OBO permission inheritance.'}
                    </span>
                  </div>
                </label>

                <label className={`toggle-card ${state.sanctionedSource ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.sanctionedSource}
                    onChange={(e) => patch({ sanctionedSource: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Nguồn trích xuất hợp chuẩn (SAP ODP/SLT & MDM)' : 'Sanctioned Source (SAP ODP/SLT & MDM)'}</strong>
                    <span>
                      {isVi
                        ? 'Không chọc raw JDBC lên bảng BSEG/BKPF; có MDM Golden Record chuẩn.'
                        : 'Never scrape raw BSEG/BKPF tables; align entities to MDM Golden Record.'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="cpmai-tool-panel">
              <h4>
                <ShieldCheck size={16} />{' '}
                {isVi ? 'Kết quả Chẩn đoán Gate II' : 'Live Gate II Data Audit'}
              </h4>
              <div className="kpi-grid-2">
                <div className={`kpi-box ${dataReadinessScore >= 80 ? 'good' : 'bad'}`}>
                  <span className="kpi-label">{isVi ? 'Điểm Sẵn sàng Dữ liệu' : 'Data Readiness Score'}</span>
                  <strong className="kpi-val">{dataReadinessScore}/100</strong>
                  <span className="kpi-sub">{isVi ? 'Ngưỡng GO >= 80' : 'GO Threshold >= 80'}</span>
                </div>
                <div className={`kpi-box ${p2ChecksPassed === 4 ? 'good' : 'bad'}`}>
                  <span className="kpi-label">{isVi ? 'Chốt An toàn Dữ liệu' : 'Data Risk Controls'}</span>
                  <strong className="kpi-val">{p2ChecksPassed} / 4</strong>
                  <span className="kpi-sub">{isVi ? 'Leakage · Bias · RBAC · Source' : 'Leakage · Bias · RBAC · Source'}</span>
                </div>
              </div>

              <div className={`alert-banner ${p2Gate === 'GO' ? 'success' : 'danger'}`} style={{ marginTop: '0.9rem' }}>
                {p2Gate === 'GO' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                <div>
                  <strong>Gate II ({gateLabel(p2Gate)}): </strong>
                  {!state.legalRbacCleared
                    ? isVi
                      ? 'NO-GO BẮT BUỘC! Không có quyền sử dụng hợp pháp / chưa xử lý PII & RBAC thì tuyệt đối dừng ngay.'
                      : 'HARD NO-GO! Without legal/PII/RBAC clearance, stop immediately regardless of data volume.'
                    : state.dataRelevance < 50
                    ? isVi
                      ? `Bẫy GIGO! Dù bạn có ${state.dataVolumeTb} TB dữ liệu nhưng độ liên quan chỉ ${state.dataRelevance}% → Model chắc chắn thất bại.`
                      : `GIGO Trap! Having ${state.dataVolumeTb} TB of data with only ${state.dataRelevance}% relevance guarantees model failure.`
                    : p2Gate === 'GO'
                    ? isVi
                      ? 'Dữ liệu đạt chuẩn tin cậy và pháp lý — sẵn sàng bước sang Phase III (Data Preparation).'
                      : 'Data passes quality, relevance, and compliance gates—ready for Phase III (Data Preparation).'
                    : isVi
                      ? 'Cần hoàn tất toàn bộ 4 chốt kiểm soát trước khi đầu tư công sức làm sạch ở Phase III.'
                      : 'Complete all 4 structural data audits before investing heavy Phase III preparation effort.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === PHASE III SIMULATOR: DATA PREPARATION (80/20 RULE) === */}
        {activePhase === 'phase-3' && (
          <div className="cpmai-tool-grid">
            <div className="cpmai-tool-panel">
              <h4>
                <Wrench size={16} />{' '}
                {isVi
                  ? 'Bộ lập kế hoạch 80/20 & Pipeline Chống Training-Serving Skew'
                  : '80/20 Effort Allocator & Anti-Skew Pipeline Builder'}
              </h4>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? 'Tỷ trọng thời gian dành cho Chuẩn bị Dữ liệu' : 'Project Effort Allocated to Data Prep'}</label>
                  <span className="mono-value">{state.dataPrepEffortPct}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={90}
                  step={5}
                  value={state.dataPrepEffortPct}
                  onChange={(e) => patch({ dataPrepEffortPct: Number(e.target.value) })}
                />
                <small className="helper-note">
                  {isVi
                    ? 'Quy tắc 80/20 của PMI-CPMAI: 60–80% thời gian dự án AI thực tế nằm ở làm sạch, gán nhãn và chuẩn hóa dữ liệu.'
                    : 'PMI-CPMAI 80/20 Rule: Expect 60–80% of total AI project effort to go into data cleansing, labeling, and pipelines.'}
                </small>
              </div>

              <div className="toggle-list">
                <label className={`toggle-card ${state.consensusGroundTruth ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.consensusGroundTruth}
                    onChange={(e) => patch({ consensusGroundTruth: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Chuẩn hóa Ground Truth qua Consensus QA' : 'Ground Truth via Consensus QA'}</strong>
                    <span>
                      {isVi
                        ? 'Nhiều chuyên gia nghiệp vụ cùng thẩm định nhãn / bộ Golden Dataset.'
                        : 'Multiple domain SMEs verify labels and Golden Dataset answers.'}
                    </span>
                  </div>
                </label>

                <label className={`toggle-card ${state.automatedVersionedPipeline ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.automatedVersionedPipeline}
                    onChange={(e) => patch({ automatedVersionedPipeline: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Pipeline Tự động có Versioning (Chống Training-Serving Skew)' : 'Automated Versioned Pipeline (Zero Skew)'}</strong>
                    <span>
                      {isVi
                        ? 'Dùng chung 1 code biến đổi dữ liệu cho lúc Train/Index và lúc Production Serving.'
                        : 'Identical transformation code runs in training/indexing and live serving.'}
                    </span>
                  </div>
                </label>

                <label className={`toggle-card ${state.hybridChunkingIndex ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.hybridChunkingIndex}
                    onChange={(e) => patch({ hybridChunkingIndex: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Phân mảnh tài liệu + Hybrid Index (BM25 + Vector)' : 'Semantic Chunking + Hybrid Index (BM25 + Vector)'}</strong>
                    <span>
                      {isVi
                        ? 'Gắn sẵn metadata ACL, nguồn trích dẫn và bảo toàn mã SKU/mã lỗi.'
                        : 'Preserves exact SKUs/error codes alongside ACL tags and citation pointers.'}
                    </span>
                  </div>
                </label>

                <label className={`toggle-card ${state.hallucinationFirewall ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.hallucinationFirewall}
                    onChange={(e) => patch({ hallucinationFirewall: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Tường lửa Chống Ảo giác (Hallucination Firewall)' : 'GenAI Hallucination Firewall'}</strong>
                    <span>
                      {isVi
                        ? 'Khi dùng GenAI hỗ trợ làm sạch/tạo dữ liệu giả lập, luôn có bước kiểm chứng tự động.'
                        : 'Automated validation prevents synthetic/imputed data errors from poisoning datasets.'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="cpmai-tool-panel">
              <h4>
                <Layers size={16} />{' '}
                {isVi ? 'Đánh giá Độ chín Pipeline (Gate III)' : 'Pipeline Maturity & Gate III'}
              </h4>
              <div className={`alert-banner ${p3Gate === 'GO' ? 'success' : 'danger'}`}>
                {p3Gate === 'GO' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <div>
                  <strong>Gate III ({gateLabel(p3Gate)}): </strong>
                  {!state.automatedVersionedPipeline
                    ? isVi
                      ? 'NO-GO! Làm sạch thủ công trong Excel/Notebook sẽ gây lỗi Training-Serving Skew khi lên Production.'
                      : 'NO-GO! Manual notebook cleansing guarantees Training-Serving Skew in production.'
                    : state.dataPrepEffortPct < 55
                    ? isVi
                      ? `Cảnh báo kế hoạch phi thực tế: Chỉ dành ${state.dataPrepEffortPct}% cho Data Prep sẽ làm vỡ tiến độ dự án AI.`
                      : `Unrealistic schedule: Allocating only ${state.dataPrepEffortPct}% to Data Prep causes predictable AI project delays.`
                    : isVi
                    ? 'Bộ dữ liệu & Pipeline tự động đã sẵn sàng làm nhiên liệu chuẩn cho Phase IV (Model Development)!'
                    : 'Automated, versioned data pipelines and Ground Truth are ready to fuel Phase IV!'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === PHASE IV SIMULATOR: MODEL DEVELOPMENT === */}
        {activePhase === 'phase-4' && (
          <div className="cpmai-tool-grid">
            <div className="cpmai-tool-panel">
              <h4>
                <Cpu size={16} />{' '}
                {isVi
                  ? 'Phòng Lab Chọn Nhánh: Path A (Build ML) vs. Path B (GenAI Adopt/Adapt)'
                  : 'Model Strategy Lab: Path A (Build ML) vs. Path B (GenAI Adopt/Adapt)'}
              </h4>

              <div className="two-col-controls" style={{ marginBottom: '0.9rem' }}>
                <button
                  type="button"
                  className={`choice-pill ${state.devPath === 'genai-adapt' ? 'selected' : ''}`}
                  onClick={() => patch({ devPath: 'genai-adapt' })}
                >
                  <strong>{isVi ? 'Path B: GenAI Adopt / Adapt' : 'Path B: Accelerated GenAI (Adopt/Adapt)'}</strong>
                  <span>
                    {isVi
                      ? 'Dùng Foundation Model + Hybrid RAG + Model Router (tối ưu cho văn bản/tài liệu).'
                      : 'Foundation Models + Hybrid RAG + Model Router (best for text/knowledge).'}
                  </span>
                </button>
                <button
                  type="button"
                  className={`choice-pill ${state.devPath === 'ml-build' ? 'selected' : ''}`}
                  onClick={() => patch({ devPath: 'ml-build' })}
                >
                  <strong>{isVi ? 'Path A: Traditional ML (Build)' : 'Path A: Traditional ML (Build from Scratch)'}</strong>
                  <span>
                    {isVi
                      ? 'Train XGBoost/LightGBM/AutoML cho dữ liệu bảng, dự báo số & gian lận.'
                      : 'Train XGBoost/AutoML on unique tabular/numerical forecasting & fraud data.'}
                  </span>
                </button>
              </div>

              {state.devPath === 'genai-adapt' && (
                <div className="toggle-list">
                  <label className={`toggle-card ${state.useModelRouter ? 'enabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={state.useModelRouter}
                      onChange={(e) => patch({ useModelRouter: e.target.checked })}
                    />
                    <div>
                      <strong>{isVi ? 'AI Model Router (75% SLM / 25% Frontier LLM)' : 'AI Model Router (75% SLM / 25% LLM)'}</strong>
                      <span>{isVi ? 'Giảm ~65% chi phí Token bằng cách đẩy câu đơn giản sang SLM.' : 'Cuts ~65% token spend by routing routine intents to SLMs.'}</span>
                    </div>
                  </label>

                  <label className={`toggle-card ${state.useRbacSemanticCache ? 'enabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={state.useRbacSemanticCache}
                      onChange={(e) => patch({ useRbacSemanticCache: e.target.checked })}
                    />
                    <div>
                      <strong>{isVi ? 'Semantic Cache theo RBAC Hash (P3.3, <50ms)' : 'RBAC-Partitioned Semantic Cache (P3.3)'}</strong>
                      <span>{isVi ? 'Tiết kiệm thêm 35% chi phí cho câu hỏi lặp lại mà không lộ quyền.' : 'Cuts an extra 35% cost on repeat intents with zero cross-user leakage.'}</span>
                    </div>
                  </label>

                  <label className={`toggle-card ${state.useHybridRag ? 'enabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={state.useHybridRag}
                      onChange={(e) => patch({ useHybridRag: e.target.checked })}
                    />
                    <div>
                      <strong>{isVi ? 'Hybrid RAG (BM25 + Vector + Reranker)' : 'Hybrid RAG (BM25 + Vector + Reranker)'}</strong>
                      <span>{isVi ? 'Trị bệnh mù mã SKU/mã lỗi và đảm bảo 100% trích dẫn nguồn.' : 'Cures Technical Code Blindness with 100% grounded citations.'}</span>
                    </div>
                  </label>

                  <label className={`toggle-card ${state.useMcpBoundaries ? 'enabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={state.useMcpBoundaries}
                      onChange={(e) => patch({ useMcpBoundaries: e.target.checked })}
                    />
                    <div>
                      <strong>{isVi ? 'Ranh giới Tool chuẩn MCP + Human-in-the-Loop' : 'Governed MCP Tools + Human-in-the-Loop'}</strong>
                      <span>{isVi ? 'Giới hạn quyền gọi API ghi/xóa trên SAP & CRM.' : 'Enforces least-privilege tool boundaries and write approvals.'}</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="cpmai-tool-panel">
              <h4>
                <Sparkles size={16} />{' '}
                {isVi ? 'Dự báo Kinh tế & Hiệu năng (Gate IV)' : 'Live FinOps & Latency Telemetry (Gate IV)'}
              </h4>
              <div className="kpi-grid-2">
                <div className={`kpi-box ${estMonthlyOpex <= 15000 ? 'good' : 'bad'}`}>
                  <span className="kpi-label">{isVi ? 'Chi phí AI ước tính / tháng' : 'Est. Monthly AI OpEx'}</span>
                  <strong className="kpi-val">${estMonthlyOpex.toLocaleString()}</strong>
                  <span className="kpi-sub">3Y: ${(estMonthlyOpex * 36).toLocaleString()}</span>
                </div>
                <div className={`kpi-box ${estLatencyMs <= 800 ? 'good' : 'bad'}`}>
                  <span className="kpi-label">{isVi ? 'Độ trễ trung bình P95' : 'Estimated P95 Latency'}</span>
                  <strong className="kpi-val">{estLatencyMs} ms</strong>
                  <span className="kpi-sub">{state.devPath === 'ml-build' ? 'Local ML Inference' : 'AI Gateway + RAG'}</span>
                </div>
              </div>

              <div className={`alert-banner ${p4Gate === 'GO' ? 'success' : 'danger'}`} style={{ marginTop: '0.9rem' }}>
                {p4Gate === 'GO' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <div>
                  <strong>Gate IV ({gateLabel(p4Gate)}): </strong>
                  {p4Gate === 'NO-GO'
                    ? isVi
                      ? `Vỡ ngân sách FinOps ($${estMonthlyOpex.toLocaleString()}/tháng)! Hãy bật AI Model Router và RBAC Semantic Cache trước khi qua Phase V.`
                      : `FinOps budget blown ($${estMonthlyOpex.toLocaleString()}/mo)! Enable Model Router and RBAC Semantic Cache before advancing.`
                    : isVi
                    ? 'Kiến trúc Model cân bằng tốt giữa chi phí FinOps, độ trễ và độ chính xác — chuyển sang Phase V để kiểm định!'
                    : 'Model architecture balances FinOps, latency, and accuracy—ready for Phase V evaluation!'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === PHASE V SIMULATOR: MODEL EVALUATION & DIAGNOSTIC ITERATION LADDER === */}
        {activePhase === 'phase-5' && (
          <div className="cpmai-tool-grid">
            <div className="cpmai-tool-panel">
              <h4>
                <FileCheck2 size={16} />{' '}
                {isVi
                  ? 'Giả lập "Bẫy Accuracy" & 5 Lớp Trustworthy AI'
                  : '"Accuracy Trap" Simulator & 5-Layer Trustworthy AI'}
              </h4>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? 'Điểm Kỹ thuật (Technical Accuracy / F1)' : 'Technical Accuracy / F1 Score'}</label>
                  <span className="mono-value">{state.techAccuracyPct}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={state.techAccuracyPct}
                  onChange={(e) => patch({ techAccuracyPct: Number(e.target.value) })}
                />
              </div>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? 'Mức đạt KPI Kinh doanh Thực tế (Business Outcome)' : 'Actual Business KPI Achievement'}</label>
                  <span className="mono-value">{state.businessKpiAchievedPct}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={state.businessKpiAchievedPct}
                  onChange={(e) => patch({ businessKpiAchievedPct: Number(e.target.value) })}
                />
              </div>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? 'Độ trung thực RAGAS Faithfulness' : 'RAGAS Faithfulness Score'}</label>
                  <span className="mono-value">{state.ragasFaithfulnessPct}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={state.ragasFaithfulnessPct}
                  onChange={(e) => patch({ ragasFaithfulnessPct: Number(e.target.value) })}
                />
              </div>

              <div className="cpmai-trust-box">
                <strong>
                  {isVi
                    ? `Kiểm định 5 Lớp Trustworthy AI (${trustworthyCount}/5):`
                    : `5 Layers of Trustworthy AI Audit (${trustworthyCount}/5):`}
                </strong>
                <div className="cpmai-trust-list">
                  {TRUSTWORTHY_AI_LAYERS.map((layer) => (
                    <label key={layer.id} className="cpmai-check-row">
                      <input
                        type="checkbox"
                        checked={!!state.trustworthyChecks[layer.id]}
                        onChange={(e) =>
                          patch({
                            trustworthyChecks: {
                              ...state.trustworthyChecks,
                              [layer.id]: e.target.checked
                            }
                          })
                        }
                      />
                      <span>{isVi ? layer.vi : layer.en}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="cpmai-tool-panel">
              <h4>
                <RefreshCw size={16} />{' '}
                {isVi
                  ? 'Thang Chẩn đoán Vòng lặp (Diagnostic Iteration Ladder)'
                  : 'Diagnostic Iteration Ladder (CPMAI Loop-Back)'}
              </h4>

              {isAccuracyTrap && (
                <div className="alert-banner danger" style={{ marginBottom: '0.85rem' }}>
                  <AlertTriangle size={18} />
                  <div>
                    <strong>{isVi ? 'PHÁT HIỆN BẪY ACCURACY TRAP!' : 'ACCURACY TRAP DETECTED!'}</strong>{' '}
                    {isVi
                      ? `Model đạt ${state.techAccuracyPct}% kỹ thuật nhưng chỉ đạt ${state.businessKpiAchievedPct}% KPI kinh doanh (vd: bỏ sót ca gian lận hoặc mù mã SKU). Tuyệt đối KHÔNG cho Go-Live!`
                      : `Model scores ${state.techAccuracyPct}% technically but only ${state.businessKpiAchievedPct}% on the Business KPI. Do NOT operationalize!`}
                  </div>
                </div>
              )}

              <div className={`alert-banner ${p5Gate === 'GO' ? 'success' : 'danger'}`}>
                {p5Gate === 'GO' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                <div>
                  <strong>Gate V ({gateLabel(p5Gate)}): </strong>
                  {p5Gate === 'GO'
                    ? isVi
                      ? 'Vượt qua cả 3 trụ cột đánh giá (Business KPI + Tech/RAGAS + 5/5 Trustworthy AI) — duyệt sang Phase VI!'
                      : 'Cleared Business KPI, Technical/RAGAS, and 5/5 Trustworthy AI—approved for Phase VI!'
                    : isVi
                    ? 'Chưa đạt chuẩn Go-Live. Theo PMI-CPMAI, hãy dùng Thang Chẩn đoán bên dưới để Loop Back đúng Phase gốc:'
                    : 'Not ready for launch. Under PMI-CPMAI, use the Diagnostic Ladder below to loop back to the root cause:'}
                </div>
              </div>

              <div className="cpmai-loopback-grid">
                <button
                  type="button"
                  className="cpmai-loop-btn"
                  onClick={() => setActivePhase('phase-1')}
                >
                  <strong>↩ Loop Back → Phase I</strong>
                  <span>
                    {isVi
                      ? 'Model giỏi nhưng KPI kinh doanh không tăng (Sai bài toán / Metric)'
                      : 'Model works technically but misses Business KPI (Strategic Trap)'}
                  </span>
                </button>
                <button
                  type="button"
                  className="cpmai-loop-btn"
                  onClick={() => setActivePhase('phase-2')}
                >
                  <strong>↩ Loop Back → Phase II</strong>
                  <span>
                    {isVi
                      ? 'Tốt trong lab nhưng chết trên dữ liệu thật ("Hothouse Flower" / Bias)'
                      : 'Great in lab, fails on live data ("Hothouse Flower" / Unrepresentative)'}
                  </span>
                </button>
                <button
                  type="button"
                  className="cpmai-loop-btn"
                  onClick={() => setActivePhase('phase-3')}
                >
                  <strong>↩ Loop Back → Phase III</strong>
                  <span>
                    {isVi
                      ? 'Lỗi nhãn Ground Truth, Chunking sai hoặc Training-Serving Skew'
                      : 'Bad labels, broken chunking, or Training-Serving Skew'}
                  </span>
                </button>
                <button
                  type="button"
                  className="cpmai-loop-btn"
                  onClick={() => setActivePhase('phase-4')}
                >
                  <strong>↩ Loop Back → Phase IV</strong>
                  <span>
                    {isVi
                      ? 'Độ trễ / Chi phí Token quá cao → Tinh chỉnh Router, Cache hoặc thuật toán'
                      : 'Latency or Token OpEx too high → Tune Model Router, Cache, or Algorithm'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === PHASE VI SIMULATOR: MODEL OPERATIONALIZATION & CHARTER EXPORT === */}
        {activePhase === 'phase-6' && (
          <div className="cpmai-tool-grid">
            <div className="cpmai-tool-panel">
              <h4>
                <ShieldCheck size={16} />{' '}
                {isVi
                  ? 'Trung tâm MLOps: Giả lập Drift & Bảo vệ Production 24/7'
                  : 'Day-2 MLOps Control Center: Drift & API Breakage Defense'}
              </h4>

              <div className="control-group">
                <div className="control-label-row">
                  <label>{isVi ? 'Giả lập Độ lệch Dữ liệu sau 6 tháng (Data Drift Shock)' : 'Simulated 6-Month Data Drift Shock'}</label>
                  <span className="mono-value">+{state.simulatedDriftSeverity}% Drift</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={5}
                  value={state.simulatedDriftSeverity}
                  onChange={(e) => patch({ simulatedDriftSeverity: Number(e.target.value) })}
                />
              </div>

              <div className="toggle-list">
                <label className={`toggle-card ${state.scaffoldingDecoupled ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.scaffoldingDecoupled}
                    onChange={(e) => patch({ scaffoldingDecoupled: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Tách Model Scaffolding (UI) khỏi Engine (MLOps)' : 'Decouple Model Scaffolding (UI) from Engine'}</strong>
                    <span>{isVi ? 'Nâng cấp / thay model mới mà không làm vỡ giao diện người dùng.' : 'Swap or retrain models cleanly without breaking app workflows.'}</span>
                  </div>
                </label>

                <label className={`toggle-card ${state.driftMonitoringActive ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.driftMonitoringActive}
                    onChange={(e) => patch({ driftMonitoringActive: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Đèn báo "Check Engine": Giám sát Data/Model Drift & Retrain' : '"Check Engine Light": Active Drift Monitoring & Retrain Loop'}</strong>
                    <span>{isVi ? 'Cảnh báo tự động khi phân phối dữ liệu lệch hoặc điểm RAGAS giảm.' : 'Alerts automatically when input distribution shifts or RAGAS drops.'}</span>
                  </div>
                </label>

                <label className={`toggle-card ${state.multiLlmFallbackActive ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.multiLlmFallbackActive}
                    onChange={(e) => patch({ multiLlmFallbackActive: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Multi-LLM Fallback & Circuit Breaker (Chống hãng đổi API ngầm)' : 'Multi-LLM Fallback & Circuit Breaker (API Vendor Risk)'}</strong>
                    <span>{isVi ? 'Tự chuyển sang model dự phòng khi gặp 429/503 hoặc provider update làm lệch prompt.' : 'Fails over cleanly on 429/503 outages or silent vendor model updates.'}</span>
                  </div>
                </label>

                <label className={`toggle-card ${state.wormAuditActive ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.wormAuditActive}
                    onChange={(e) => patch({ wormAuditActive: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Nhật ký Kiểm toán Bất biến (WORM Audit Trail)' : 'Immutable WORM Audit Trail'}</strong>
                    <span>{isVi ? 'Lưu Prompt (đã ẩn PII), Chunk trích dẫn và Model Version để truy vết pháp lý.' : 'Logs PII-redacted prompts, citations, and model version for compliance.'}</span>
                  </div>
                </label>

                <label className={`toggle-card ${state.sunsettingPlanReady ? 'enabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={state.sunsettingPlanReady}
                    onChange={(e) => patch({ sunsettingPlanReady: e.target.checked })}
                  />
                  <div>
                    <strong>{isVi ? 'Kế hoạch Nghỉ hưu Model (Model Retirement / Sunsetting)' : 'Model Retirement / Sunsetting Plan'}</strong>
                    <span>{isVi ? 'Quy định rõ ngưỡng ROI/Drift để thay thế hoặc gỡ bỏ model an toàn.' : 'Clear governance criteria for safely retiring and archiving legacy models.'}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="cpmai-tool-panel">
              <h4>
                <FileCheck2 size={16} />{' '}
                {isVi
                  ? 'Xuất Bản thiết kế Dự án AI (Charter + SA Blueprint)'
                  : 'Export Full AI Project Charter & SA Blueprint'}
              </h4>

              <div className="kpi-grid-2" style={{ marginBottom: '0.85rem' }}>
                <div className={`kpi-box ${effectiveDriftRisk <= 12 ? 'good' : 'bad'}`}>
                  <span className="kpi-label">{isVi ? 'Rủi ro suy giảm sau kiểm soát' : 'Residual Drift Risk'}</span>
                  <strong className="kpi-val">{effectiveDriftRisk}%</strong>
                  <span className="kpi-sub">{isVi ? 'An toàn <= 12%' : 'Safe Target <= 12%'}</span>
                </div>
                <div className={`kpi-box ${goCount === 6 ? 'good' : 'bad'}`}>
                  <span className="kpi-label">{isVi ? 'Trạng thái 6 Cổng CPMAI' : '6 CPMAI Gates Cleared'}</span>
                  <strong className="kpi-val">{goCount} / 6</strong>
                  <span className="kpi-sub">{isVi ? 'Sẵn sàng Go-Live' : 'Production Readiness'}</span>
                </div>
              </div>

              <div className="cpmai-export-preview">
                <pre>{generateMarkdownCharter()}</pre>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
                onClick={handleCopyBlueprint}
              >
                <ClipboardCopy size={16} />
                {copiedBlueprint
                  ? isVi
                    ? 'Đã Copy Charter & Blueprint (Markdown)!'
                    : 'Copied Charter & Blueprint (Markdown)!'
                  : isVi
                  ? 'Copy Toàn bộ AI Project Charter & SA Blueprint'
                  : 'Copy Full AI Project Charter & SA Blueprint'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Phase Navigation Bar */}
        <div className="step-footer-nav" style={{ marginTop: '1.1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem' }}>
          {currentPhaseMeta.number > 1 ? (
            <button
              type="button"
              className="btn-ghost-sm"
              onClick={() => setActivePhase(CPMAI_PHASES[currentPhaseMeta.number - 2].id)}
            >
              ← Phase {CPMAI_PHASES[currentPhaseMeta.number - 2].roman}
            </button>
          ) : (
            <span />
          )}
          {currentPhaseMeta.number < 6 && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setActivePhase(CPMAI_PHASES[currentPhaseMeta.number].id)}
            >
              {isVi ? 'Sang giai đoạn tiếp:' : 'Advance to:'} Phase {CPMAI_PHASES[currentPhaseMeta.number].roman}{' '}
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
