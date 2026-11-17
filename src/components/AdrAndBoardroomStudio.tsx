import React, { useState } from 'react';
import {
  type ADREvaluationResult,
  type BoardroomMessage,
  evaluateADRWithLLM,
  getSavedLLMConfig,
  type LLMConfig,
  type LLMProvider,
  runBoardroomChallenge,
  saveLLMConfig
} from '../services/llmEvaluator';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Calculator,
  FileText,
  KeyRound,
  Send,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';

const ADR_TEMPLATES = [
  {
    name: 'ADR-001: Enterprise AI Copilot with 75/25 Model Router, Hybrid RAG & Entra ID OBO Trimming',
    title: 'ADR-001: Hybrid RAG & Tiered SLM/LLM Routing with Zero-Trust M365 Security Trimming',
    context:
      'We need to deploy an internal Enterprise Supply Chain & Engineering Copilot for 15,000 employees querying 1.5M SharePoint documents and SAP ERP material/order records (1.2M queries/month). Monthly AI inference budget is capped at $12,000, engineers search exact SAP error codes (e.g., EADDRNOTAVAIL, MATNR), and CISO mandates zero unauthorized SharePoint document exposure.',
    consideredOptions:
      'Option 1: 100% Frontier LLM (GPT-4o) + Pure Dense Vector Search + Shared Backend Service Principal ($46.5k/mo, fails exact SKU search, severe RBAC breach).\nOption 2: Weekly LoRA Finetuning on SAP/SharePoint facts + 500k Long Context Window ($62k/mo, 0% citations, violates "Finetuning for Form, RAG for Facts").\nOption 3 (Selected): AI Gateway Semantic Router (75% SLM Phi-4/Llama-3-8B at 1/50th cost, 25% Frontier LLM with Confidence Escalation) + Hybrid Search (BM25 + HNSW Vector + Cross-Encoder Reranker Top-5) + Entra ID On-Behalf-Of (OBO) Hybrid Security Trimming.',
    decisionAndBoundaries:
      '1. AI Gateway Boundary: All calls pass through the AI Gateway enforcing token quotas, PII tokenization, and 75/25 SLM/LLM routing.\n2. Retrieval Boundary: Hybrid BM25 + Vector + Cohere Reranker cures Technical Code Blindness and enforces 100% source citations.\n3. Tool Boundary: Enterprise actions exposed via typed MCP Servers; SAP PO mutations require Human-in-the-Loop approval.\n4. Zero-Trust Identity Boundary: User Entra ID JWT is propagated via OBO; vector pre-filtering uses webhook-synced ACL tags paired with Query-Time Top-5 Graph verification.',
    tradeOffsAndConsequences:
      'Positive: Cuts monthly inference cost by 74% ($6,800/mo vs $46,500/mo), achieves 97% recall on exact error codes/SKUs, and guarantees <60s permission revocation safety.\nNegative Consequences Accepted: +55ms added latency from Cross-Encoder Reranking and Query-Time Top-5 ACL check; higher operational complexity to maintain MS Graph ACL webhooks and Golden Dataset RAGAS evaluations.',
    day2OpsAndGovernance:
      '1. Automated CI/CD LLMOps gate requires RAGAS Faithfulness >= 0.90 and Context Precision >= 0.85 on a 500-case Golden Dataset.\n2. Circuit Breaker on external LLM endpoints fails over to regional backup or cached SLM in 1ms.\n3. Every prompt, chunk version ID, OBO ACL proof, and response hash is written to an Immutable WORM Audit Trail in sovereign storage encrypted with Customer-Managed Keys (BYOK).'
  },
  {
    name: 'ADR-002: Flash-Sale Order-to-Cash via Outbox Orchestration Saga, CQRS & Sanctioned SAP ODP CDC',
    title: 'ADR-002: Resilient High-Concurrency Order Pipeline with Outbox Saga, 80/20 Bulkhead & SAP ODP CQRS',
    context:
      'GlobalManufacturing Corp experiences 100x traffic spikes (85,000 RPS) during B2B/B2C Flash Sales while 200 accountants run 5-year PDF financial reports. Read/Write ratio on order history is 90:1, orders span 5 microservices, and financial postings integrate with SAP S/4HANA.',
    consideredOptions:
      'Option 1: Full CDN Caching (30s TTL) + 5-step Choreography Saga + Shared Worker Pool + Direct JDBC triggers on SAP BSEG/BKPF.\nOption 2: Synchronous REST chain inside a Fat API Gateway + Single PostgreSQL DB for writes and 5-year history reads.\nOption 3 (Selected): Hybrid CDN (Bypass dynamic stock) + Redis Mutex Lock + FE UUID/BE Redlock Idempotency + Transactional Outbox & Orchestration Saga + 80/20 Thread Bulkhead + CQRS (SQL + Elasticsearch) fed by SAP ODP/SLT CDC.',
    decisionAndBoundaries:
      '1. Edge & Cache Boundary: Static shell cached on CDN (<50ms); dynamic inventory bypasses CDN and uses Redis Cache-Aside with Distributed Mutex Lock to prevent Cache Stampede.\n2. Idempotency & Saga Boundary: Front-End generates UUID Idempotency-Key; Back-End enforces Redis Redlock. 5-step workflow uses an Orchestration Saga State Machine + Transactional Outbox (Debezium CDC to Kafka).\n3. Data & SAP Boundary: 90:1 Read/Write skew separated via CQRS (3NF SQL Write DB + Elasticsearch Read DB). SAP extraction strictly uses sanctioned ODP/SLT into an MDM Canonical Model.',
    tradeOffsAndConsequences:
      'Positive: Eliminates Overselling, Double-Charging, and Cache Stampedes; keeps Checkout P99 < 100ms even when 200 accountants export 5-year PDFs; 100% SAP license compliant.\nNegative Consequences Accepted: 200-800ms Eventual Consistency replication lag between Write DB and Elasticsearch history view (mitigated via Read-Your-Own-Writes UI session cache); additional Debezium/Kafka operational footprint.',
    day2OpsAndGovernance:
      '1. Bulkhead Pattern partitions 80% threads/pods for Sales Checkout and caps PDF Reporting at 20%.\n2. 3-State Circuit Breaker wraps external Payment/Insurance APIs (trips to OPEN for 1ms Fail-Fast with graceful queued fallback).\n3. Legacy monolith cutover follows phased Strangler Fig routing (10% -> 50% -> 100%) with automated SLA rollback.'
  }
];

export const AdrAndBoardroomStudio: React.FC = () => {
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => getSavedLLMConfig());
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [keySavedBanner, setKeySavedBanner] = useState<boolean>(false);

  // ADR Editor State
  const [adrTitle, setAdrTitle] = useState<string>(ADR_TEMPLATES[0].title);
  const [adrContext, setAdrContext] = useState<string>(ADR_TEMPLATES[0].context);
  const [adrOptions, setAdrOptions] = useState<string>(ADR_TEMPLATES[0].consideredOptions);
  const [adrDecision, setAdrDecision] = useState<string>(ADR_TEMPLATES[0].decisionAndBoundaries);
  const [adrTradeOffs, setAdrTradeOffs] = useState<string>(ADR_TEMPLATES[0].tradeOffsAndConsequences);
  const [adrDay2Gov, setAdrDay2Gov] = useState<string>(ADR_TEMPLATES[0].day2OpsAndGovernance);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<ADREvaluationResult | null>(null);

  // Boardroom Live Defense State
  const [boardMessages, setBoardMessages] = useState<BoardroomMessage[]>([
    {
      id: 'm-init-1',
      speaker: 'CFO',
      speakerTitle: 'Chief Financial Officer',
      content:
        'Welcome to the Architecture Review Board. We are reviewing your 5-pillar enterprise design. First question from Finance & Security: How does your architecture prevent runaway Frontier LLM token costs at 1.2M queries/month while guaranteeing that a junior employee cannot extract confidential SharePoint Board documents or double-charge dealers on flaky 4G connections?',
      timestamp: '09:00 AM'
    }
  ]);
  const [architectInput, setArchitectInput] = useState<string>('');
  const [isBoardThinking, setIsBoardThinking] = useState<boolean>(false);
  const [boardConfidence, setBoardConfidence] = useState<number>(72);

  // 3-Year TCO & Sensitivity State
  const [initialBuildCapEx, setInitialBuildCapEx] = useState<number>(180000);
  const [monthlyCloudInfra, setMonthlyCloudInfra] = useState<number>(14500);
  const [monthlyAiTokens, setMonthlyAiTokens] = useState<number>(6800);
  const [monthlySapIntegration, setMonthlySapIntegration] = useState<number>(4200);
  const monthlySreSupport = 9500;
  const [monthlyBusinessBenefit, setMonthlyBusinessBenefit] = useState<number>(68000);
  const [trafficSpikeFactor, setTrafficSpikeFactor] = useState<number>(1); // 1x, 2x, 3x sensitivity

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveLLMConfig(llmConfig);
    setKeySavedBanner(true);
    setTimeout(() => setKeySavedBanner(false), 3000);
    setShowKeyModal(false);
  };

  const handleLoadTemplate = (idx: number) => {
    const t = ADR_TEMPLATES[idx];
    setAdrTitle(t.title);
    setAdrContext(t.context);
    setAdrOptions(t.consideredOptions);
    setAdrDecision(t.decisionAndBoundaries);
    setAdrTradeOffs(t.tradeOffsAndConsequences);
    setAdrDay2Gov(t.day2OpsAndGovernance);
  };

  const handleEvaluateAdr = async () => {
    setIsEvaluating(true);
    setEvalError(null);
    try {
      const res = await evaluateADRWithLLM(llmConfig, {
        title: adrTitle,
        context: adrContext,
        consideredOptions: adrOptions,
        decisionAndBoundaries: adrDecision,
        tradeOffsAndConsequences: adrTradeOffs,
        day2OpsAndGovernance: adrDay2Gov
      });
      setEvalResult(res);
    } catch (err: any) {
      setEvalError(err?.message || 'LLM API call failed. Falling back to built-in heuristic evaluation.');
      const fallback = await evaluateADRWithLLM(
        { ...llmConfig, apiKey: '' },
        {
          title: adrTitle,
          context: adrContext,
          consideredOptions: adrOptions,
          decisionAndBoundaries: adrDecision,
          tradeOffsAndConsequences: adrTradeOffs,
          day2OpsAndGovernance: adrDay2Gov
        }
      );
      setEvalResult(fallback);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSendDefense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!architectInput.trim() || isBoardThinking) return;

    const replyText = architectInput.trim();
    const userMsg: BoardroomMessage = {
      id: `arch-${Date.now()}`,
      speaker: 'ARCHITECT',
      speakerTitle: 'Lead Enterprise Solution Architect (You)',
      content: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...boardMessages, userMsg];
    setBoardMessages(updatedHistory);
    setArchitectInput('');
    setIsBoardThinking(true);

    try {
      const result = await runBoardroomChallenge(llmConfig, adrTitle, updatedHistory, replyText);
      const newBotMessages: BoardroomMessage[] = result.responses.map((r, i) => ({
        id: `cxo-${Date.now()}-${i}`,
        speaker: r.speaker,
        speakerTitle: r.speakerTitle,
        content: r.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scoreImpact: r.scoreImpact
      }));
      const totalDelta = result.responses.reduce((acc, r) => acc + (Number(r.scoreImpact) || 0), 0);
      setBoardConfidence((prev) => Math.max(10, Math.min(100, prev + totalDelta)));
      setBoardMessages((prev) => [...prev, ...newBotMessages]);
    } catch (err: any) {
      // Fallback if API key errored
      const fallback = await runBoardroomChallenge({ ...llmConfig, apiKey: '' }, adrTitle, updatedHistory, replyText);
      const newBotMessages: BoardroomMessage[] = fallback.responses.map((r, i) => ({
        id: `cxo-fb-${Date.now()}-${i}`,
        speaker: r.speaker,
        speakerTitle: `${r.speakerTitle} (Fallback Engine - Check API Key)`,
        content: r.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scoreImpact: r.scoreImpact
      }));
      setBoardMessages((prev) => [...prev, ...newBotMessages]);
    } finally {
      setIsBoardThinking(false);
    }
  };

  // Compute 36-Month TCO & ROI with Traffic Spike Sensitivity
  const effectiveMonthlyOpEx =
    monthlyCloudInfra * (1 + (trafficSpikeFactor - 1) * 0.45) +
    monthlyAiTokens * trafficSpikeFactor +
    monthlySapIntegration +
    monthlySreSupport;

  const threeYearOpEx = Math.round(effectiveMonthlyOpEx * 36);
  const threeYearTotalTco = initialBuildCapEx + threeYearOpEx;
  const threeYearGrossBenefit = monthlyBusinessBenefit * 36;
  const threeYearNetRoiUsd = threeYearGrossBenefit - threeYearTotalTco;
  const roiPercentage = Math.round((threeYearNetRoiUsd / threeYearTotalTco) * 100);
  const paybackMonths =
    monthlyBusinessBenefit > effectiveMonthlyOpEx
      ? (initialBuildCapEx / (monthlyBusinessBenefit - effectiveMonthlyOpEx)).toFixed(1)
      : 'Never (OpEx > Benefit)';

  const hasActiveKey = Boolean(llmConfig.apiKey.trim());

  return (
    <div className="studio-container">
      {/* Top Bar: LLM API Key Configuration & Status */}
      <div className="llm-config-banner">
        <div className="llm-banner-left">
          <KeyRound size={20} className={hasActiveKey ? 'text-success' : 'text-amber'} />
          <div>
            <strong>
              AI Evaluation &amp; CxO Roleplay Engine:{' '}
              {hasActiveKey ? (
                <span className="status-inline live">
                  LIVE LLM CONNECTED ({llmConfig.provider.toUpperCase()} · {llmConfig.model})
                </span>
              ) : (
                <span className="status-inline fallback">
                  BUILT-IN EXPERT ENGINE (Plug in your LLM API Key for Live Generative Critique)
                </span>
              )}
            </strong>
            <p>
              Connect your OpenAI, Google Gemini, Anthropic Claude, or OpenAI-compatible API key to unlock live generative ADR grading and multi-turn CxO cross-examination.
            </p>
          </div>
        </div>
        <div className="llm-banner-actions">
          {keySavedBanner && <span className="saved-pill">API Key Saved in Browser!</span>}
          <button
            id="btn-configure-llm-key"
            className="btn-primary"
            onClick={() => setShowKeyModal(!showKeyModal)}
          >
            <KeyRound size={15} /> {hasActiveKey ? 'Update LLM API Key' : 'Connect LLM API Key'}
          </button>
        </div>
      </div>

      {showKeyModal && (
        <form className="llm-key-drawer" onSubmit={handleSaveApiConfig}>
          <div className="drawer-grid">
            <div>
              <label className="field-label" htmlFor="select-llm-provider">
                LLM Provider
              </label>
              <select
                id="select-llm-provider"
                className="text-input"
                value={llmConfig.provider}
                onChange={(e) => {
                  const provider = e.target.value as LLMProvider;
                  const defaultModel =
                    provider === 'openai'
                      ? 'gpt-4o-mini'
                      : provider === 'gemini'
                      ? 'gemini-2.5-flash'
                      : provider === 'anthropic'
                      ? 'claude-3-5-sonnet-latest'
                      : 'gpt-4o-mini';
                  setLlmConfig({ ...llmConfig, provider, model: defaultModel });
                }}
              >
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="gemini">Google Gemini (gemini-2.5-flash / pro)</option>
                <option value="anthropic">Anthropic Claude (claude-3-5-sonnet)</option>
                <option value="custom">OpenAI-Compatible Custom Endpoint (OpenRouter / Groq)</option>
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="input-llm-model">
                Model Name
              </label>
              <input
                id="input-llm-model"
                type="text"
                className="text-input"
                value={llmConfig.model}
                onChange={(e) => setLlmConfig({ ...llmConfig, model: e.target.value })}
                placeholder="e.g. gpt-4o-mini or gemini-2.5-flash"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="input-llm-apikey">
                API Key (Stored Locally in Browser Only)
              </label>
              <input
                id="input-llm-apikey"
                type="password"
                className="text-input"
                value={llmConfig.apiKey}
                onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
                placeholder="sk-... or AIza..."
              />
            </div>

            {llmConfig.provider === 'custom' && (
              <div>
                <label className="field-label" htmlFor="input-llm-baseurl">
                  Custom Base URL
                </label>
                <input
                  id="input-llm-baseurl"
                  type="text"
                  className="text-input"
                  value={llmConfig.customBaseUrl || ''}
                  onChange={(e) => setLlmConfig({ ...llmConfig, customBaseUrl: e.target.value })}
                  placeholder="https://openrouter.ai/api/v1"
                />
              </div>
            )}
          </div>
          <div className="drawer-footer">
            <button type="submit" id="btn-save-llm-key" className="btn-primary">
              Save &amp; Activate API Key
            </button>
            <button
              type="button"
              className="btn-ghost-sm"
              onClick={() => {
                const cleared = { ...llmConfig, apiKey: '' };
                setLlmConfig(cleared);
                saveLLMConfig(cleared);
              }}
            >
              Clear Key
            </button>
          </div>
        </form>
      )}

      {/* Main Split: ADR Studio & Live Evaluation */}
      <div className="studio-grid-2">
        <div className="sim-panel">
          <div className="panel-title-row">
            <h3>
              <FileText size={18} /> 1. Architecture Decision Record (ADR) Studio
            </h3>
            <div className="quick-btn-row">
              <button
                type="button"
                id="btn-load-adr-1"
                className="btn-secondary-sm"
                onClick={() => handleLoadTemplate(0)}
              >
                Load AI/Zero-Trust ADR
              </button>
              <button
                type="button"
                id="btn-load-adr-2"
                className="btn-secondary-sm"
                onClick={() => handleLoadTemplate(1)}
              >
                Load Saga/CQRS/SAP ADR
              </button>
            </div>
          </div>

          <div className="form-stack">
            <div>
              <label className="field-label" htmlFor="adr-title">
                ADR Title &amp; Identifier
              </label>
              <input
                id="adr-title"
                className="text-input"
                value={adrTitle}
                onChange={(e) => setAdrTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="adr-context">
                Context, Business Constraints &amp; SLA Requirements
              </label>
              <textarea
                id="adr-context"
                rows={3}
                className="text-area"
                value={adrContext}
                onChange={(e) => setAdrContext(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="adr-options">
                Considered Options (Include Rejected Alternatives)
              </label>
              <textarea
                id="adr-options"
                rows={4}
                className="text-area"
                value={adrOptions}
                onChange={(e) => setAdrOptions(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="adr-decision">
                Decision &amp; Explicit System Boundaries (Edge, Data, AI, Security)
              </label>
              <textarea
                id="adr-decision"
                rows={4}
                className="text-area"
                value={adrDecision}
                onChange={(e) => setAdrDecision(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="adr-tradeoffs">
                Quantitative Trade-offs &amp; Accepted Negative Consequences
              </label>
              <textarea
                id="adr-tradeoffs"
                rows={3}
                className="text-area"
                value={adrTradeOffs}
                onChange={(e) => setAdrTradeOffs(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="adr-day2">
                Day-2 Operations, Resilience &amp; Zero-Trust Governance
              </label>
              <textarea
                id="adr-day2"
                rows={3}
                className="text-area"
                value={adrDay2Gov}
                onChange={(e) => setAdrDay2Gov(e.target.value)}
              />
            </div>

            <button
              id="btn-evaluate-adr"
              type="button"
              className="btn-primary full-width"
              onClick={handleEvaluateAdr}
              disabled={isEvaluating}
            >
              <Sparkles size={16} />
              {isEvaluating
                ? 'Architecture Review Board Evaluating ADR...'
                : hasActiveKey
                ? `Evaluate ADR with Live ${llmConfig.provider.toUpperCase()} (${llmConfig.model})`
                : 'Evaluate ADR with Built-In ARB Expert Engine'}
            </button>
          </div>
        </div>

        {/* Right Column: ARB Scorecard + Live CxO Boardroom Defense */}
        <div className="sim-panel">
          <div className="panel-title-row">
            <h3>
              <Award size={18} /> 2. Architecture Review Board (ARB) Evaluation
            </h3>
            {evalResult && (
              <span
                className={`status-pill ${
                  evalResult.executiveVerdict === 'APPROVED' ? 'pass' : 'fail'
                }`}
              >
                {evalResult.executiveVerdict} ({evalResult.overallScore}/100)
              </span>
            )}
          </div>

          {evalError && (
            <div className="alert-banner danger" style={{ marginBottom: '0.85rem' }}>
              <AlertCircle size={16} />
              <div>{evalError}</div>
            </div>
          )}

          {!evalResult ? (
            <div className="empty-eval-box">
              <p>
                Click <strong>&quot;Evaluate ADR&quot;</strong> on the left to score your Architecture Decision Record across Trade-off Thinking, Boundary Clarity, Day-2 Operational Feasibility, and Zero-Trust Governance.
              </p>
            </div>
          ) : (
            <div className="eval-results-box">
              <div className="kpi-grid-4">
                <div className="kpi-box good">
                  <span className="kpi-label">Trade-off Thinking</span>
                  <strong className="kpi-val">{evalResult.dimensions.tradeOffThinking}%</strong>
                </div>
                <div className="kpi-box good">
                  <span className="kpi-label">Boundary Clarity</span>
                  <strong className="kpi-val">{evalResult.dimensions.boundaryClarity}%</strong>
                </div>
                <div className="kpi-box good">
                  <span className="kpi-label">Day-2 Feasibility</span>
                  <strong className="kpi-val">{evalResult.dimensions.day2Feasibility}%</strong>
                </div>
                <div className="kpi-box good">
                  <span className="kpi-label">Zero-Trust &amp; Gov</span>
                  <strong className="kpi-val">{evalResult.dimensions.governanceCompliance}%</strong>
                </div>
              </div>

              <div className="eval-lists-grid">
                <div className="eval-list-card">
                  <h4>
                    <CheckCircle2 size={15} className="text-success" /> Key Architectural Strengths
                  </h4>
                  <ul>
                    {evalResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="eval-list-card">
                  <h4>
                    <AlertCircle size={15} className="text-amber" /> Identified Blind Spots
                  </h4>
                  <ul>
                    {evalResult.blindSpots.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="cxo-quad-grid">
                <div className="cxo-mini-quote">
                  <strong>CFO (FinOps &amp; TCO):</strong> {evalResult.cxoReactions.cfo}
                </div>
                <div className="cxo-mini-quote">
                  <strong>CISO (Zero Trust):</strong> {evalResult.cxoReactions.ciso}
                </div>
                <div className="cxo-mini-quote">
                  <strong>Head of SRE (Day-2):</strong> {evalResult.cxoReactions.sre}
                </div>
                <div className="cxo-mini-quote">
                  <strong>Chief Data &amp; AI Officer:</strong> {evalResult.cxoReactions.cdaio}
                </div>
              </div>
            </div>
          )}

          <hr className="divider-line" />

          {/* Interactive CxO Stakeholder Defense Room */}
          <div className="panel-title-row">
            <h3>
              <Users size={18} /> 3. Live CxO Stakeholder Defense Arena
            </h3>
            <span className="badge-mono">Board Confidence: {boardConfidence}%</span>
          </div>

          <div className="boardroom-chat-window">
            {boardMessages.map((msg) => (
              <div
                key={msg.id}
                className={`board-msg ${msg.speaker === 'ARCHITECT' ? 'architect' : 'executive'}`}
              >
                <div className="board-msg-header">
                  <strong>
                    [{msg.speaker}] {msg.speakerTitle}
                  </strong>
                  <span>
                    {msg.scoreImpact !== undefined && (
                      <em className={msg.scoreImpact >= 0 ? 'text-success' : 'text-danger'}>
                        {msg.scoreImpact >= 0 ? `+${msg.scoreImpact}` : msg.scoreImpact} pts{' '}
                      </em>
                    )}
                    {msg.timestamp}
                  </span>
                </div>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>

          <form className="boardroom-input-row" onSubmit={handleSendDefense}>
            <input
              id="input-boardroom-defense"
              type="text"
              className="text-input"
              placeholder="Defend your architecture (e.g., explain 75/25 SLM Model Router, Entra ID OBO hybrid trimming, FE/BE Redlock idempotency, 80/20 Bulkhead)..."
              value={architectInput}
              onChange={(e) => setArchitectInput(e.target.value)}
            />
            <button
              id="btn-send-defense"
              type="submit"
              className="btn-primary"
              disabled={isBoardThinking}
            >
              <Send size={15} /> {isBoardThinking ? 'Consulting...' : 'Defend'}
            </button>
          </form>
        </div>
      </div>

      {/* 36-Month TCO & ROI Sensitivity Analyzer */}
      <div className="tco-studio-panel">
        <div className="panel-title-row">
          <div>
            <span className="eyebrow-tag">PILLAR 5 FINANCIAL GOVERNANCE</span>
            <h3>
              <Calculator size={19} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              36-Month Enterprise TCO, FinOps &amp; Traffic Sensitivity Calculator
            </h3>
          </div>
          <div className="quick-btn-row">
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginRight: '6px' }}>
              Sensitivity Stress Test:
            </span>
            {[1, 2, 3].map((factor) => (
              <button
                key={factor}
                type="button"
                className={`btn-secondary-sm ${trafficSpikeFactor === factor ? 'active-spike' : ''}`}
                onClick={() => setTrafficSpikeFactor(factor)}
              >
                {factor}x Traffic &amp; Token Volume
              </button>
            ))}
          </div>
        </div>

        <div className="tco-grid">
          <div className="tco-sliders">
            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="tco-capex">Initial Build &amp; Migration CapEx (Strangler Fig Phase 1)</label>
                <span className="mono-value">${initialBuildCapEx.toLocaleString()}</span>
              </div>
              <input
                id="tco-capex"
                type="range"
                min={50000}
                max={600000}
                step={10000}
                value={initialBuildCapEx}
                onChange={(e) => setInitialBuildCapEx(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="tco-cloud">Base Monthly Cloud, Kubernetes, Redis &amp; Elasticsearch OpEx</label>
                <span className="mono-value">${monthlyCloudInfra.toLocaleString()}/mo</span>
              </div>
              <input
                id="tco-cloud"
                type="range"
                min={3000}
                max={50000}
                step={500}
                value={monthlyCloudInfra}
                onChange={(e) => setMonthlyCloudInfra(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="tco-tokens">Base Monthly AI Inference &amp; Reranker OpEx (With 75% SLM Router)</label>
                <span className="mono-value">${monthlyAiTokens.toLocaleString()}/mo</span>
              </div>
              <input
                id="tco-tokens"
                type="range"
                min={1000}
                max={60000}
                step={500}
                value={monthlyAiTokens}
                onChange={(e) => setMonthlyAiTokens(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="tco-sap">Monthly SAP ODP/CDC Connector, MDM &amp; WORM Audit Storage</label>
                <span className="mono-value">${monthlySapIntegration.toLocaleString()}/mo</span>
              </div>
              <input
                id="tco-sap"
                type="range"
                min={1000}
                max={25000}
                step={500}
                value={monthlySapIntegration}
                onChange={(e) => setMonthlySapIntegration(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="tco-benefit">Estimated Monthly Business Value (Productivity + Prevented Overselling/Outages)</label>
                <span className="mono-value">${monthlyBusinessBenefit.toLocaleString()}/mo</span>
              </div>
              <input
                id="tco-benefit"
                type="range"
                min={15000}
                max={180000}
                step={2500}
                value={monthlyBusinessBenefit}
                onChange={(e) => setMonthlyBusinessBenefit(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="tco-summary-cards">
            <div className="kpi-grid-2">
              <div className="kpi-box good">
                <span className="kpi-label">36-Month Total Cost of Ownership (TCO)</span>
                <strong className="kpi-val">${threeYearTotalTco.toLocaleString()}</strong>
                <span className="kpi-sub">
                  CapEx: ${initialBuildCapEx.toLocaleString()} + 3Y OpEx: ${threeYearOpEx.toLocaleString()} ({trafficSpikeFactor}x Load)
                </span>
              </div>
              <div className={`kpi-box ${threeYearNetRoiUsd > 0 ? 'good' : 'bad'}`}>
                <span className="kpi-label">36-Month Net Business Value (ROI)</span>
                <strong className="kpi-val">
                  {threeYearNetRoiUsd >= 0 ? `+$${threeYearNetRoiUsd.toLocaleString()}` : `-$${Math.abs(threeYearNetRoiUsd).toLocaleString()}`}
                </strong>
                <span className="kpi-sub">
                  Net ROI: {roiPercentage}% · Payback Period: {paybackMonths} months
                </span>
              </div>
            </div>

            <div className="alert-banner success" style={{ marginTop: '1rem' }}>
              <ShieldCheck size={18} />
              <div>
                <strong>CFO Sensitivity Verdict ({trafficSpikeFactor}x Traffic Scenario):</strong> Even at{' '}
                <strong>{trafficSpikeFactor}x</strong> projected volume, monthly OpEx is{' '}
                <strong>${Math.round(effectiveMonthlyOpEx).toLocaleString()}/mo</strong> because 75% of AI queries are offloaded to SLMs at 1/50th cost and CQRS/Redis Mutex locks prevent database over-provisioning.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
