import React, { useState } from 'react';
import { UI_COPY, type Lang } from '../data/i18n';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Zap
} from 'lucide-react';
import { Sim1LiveDiagram, Sim2LiveDiagram } from './ArchitectureFlowDiagram';

interface Props {
  lang: Lang;
}

export const InteractiveSimulators: React.FC<Props> = ({ lang }) => {
  const copy = UI_COPY[lang].sim;
  const [activeLab, setActiveLab] = useState<'chaos-p1' | 'ai-data-zero-trust'>('chaos-p1');

  // === LAB 1: PILLAR 1 CHAOS & RESILIENCE SIMULATOR STATE ===
  const [trafficMultiplier, setTrafficMultiplier] = useState<number>(100); // 1x to 100x Flash Sale
  const [pdfAccountants, setPdfAccountants] = useState<number>(100); // 0 to 200 concurrent heavy PDF exports
  const [partnerApiLatencyMs, setPartnerApiLatencyMs] = useState<number>(30000); // 50ms to 30000ms hang
  const [mobileRetryRate, setMobileRetryRate] = useState<number>(20); // % of requests retried over 4G
  const [workflowSteps, setWorkflowSteps] = useState<number>(5); // 2 to 8 microservice steps

  // Architecture Defense Toggles
  const [bypassCdnDynamic, setBypassCdnDynamic] = useState<boolean>(false);
  const [redisMutexLock, setRedisMutexLock] = useState<boolean>(false);
  const [feBeIdempotency, setFeBeIdempotency] = useState<boolean>(false);
  const [circuitBreakerEnabled, setCircuitBreakerEnabled] = useState<boolean>(false);
  const [bulkheadIsolation, setBulkheadIsolation] = useState<boolean>(false);
  const [orchestrationOutbox, setOrchestrationOutbox] = useState<boolean>(false);

  // === LAB 2: PILLARS 2, 3, 4 FINOPS, CQRS, HYBRID RAG & ZERO-TRUST STATE ===
  const [monthlyQueriesK, setMonthlyQueriesK] = useState<number>(1200); // 1.2M queries/month
  const [slmRoutePercent, setSlmRoutePercent] = useState<number>(75); // 75% SLM / 25% Frontier LLM
  const [readWriteRatio, setReadWriteRatio] = useState<number>(80); // 80:1 Read/Write skew
  const [cqrsEnabled, setCqrsEnabled] = useState<boolean>(true);
  const [sapExtractionMode, setSapExtractionMode] = useState<'odp-cdc' | 'raw-triggers'>('odp-cdc');
  const [ragStrategy, setRagStrategy] = useState<'hybrid-rerank' | 'pure-vector' | 'long-context' | 'weekly-finetune'>('hybrid-rerank');
  const [aclMode, setAclMode] = useState<'obo-hybrid-trim' | 'index-weekly' | 'shared-sp-unsafe'>('obo-hybrid-trim');

  // === COMPUTE LAB 1 METRICS ===
  const computeChaosMetrics = () => {
    let checkoutLatencyMs = 45;
    let dbCpuPercent = 22;
    let salesAvailability = 99.99;
    const activeFailures: string[] = [];

    // 1. CDN Dynamic Caching (Overselling)
    const oversoldUnits = bypassCdnDynamic ? 0 : Math.round(trafficMultiplier * 42);
    if (!bypassCdnDynamic && trafficMultiplier > 10) {
      activeFailures.push(
        `CRITICAL [Edge]: Dynamic inventory cached on CDN caused ${oversoldUnits.toLocaleString()} oversold units during Flash Sale.`
      );
    }

    // 2. Cache Stampede (Dog-piling)
    if (!redisMutexLock && trafficMultiplier >= 25) {
      dbCpuPercent += 65;
      checkoutLatencyMs += 1400;
      salesAvailability -= 12.5;
      activeFailures.push(
        'CRITICAL [Data]: Hot key expired under high load without a Distributed Mutex Lock—Cache Stampede crushed Primary DB CPU.'
      );
    } else if (redisMutexLock) {
      dbCpuPercent += Math.min(18, Math.round(trafficMultiplier * 0.15));
    }

    // 3. Bulkhead Isolation (80% Sales / 20% PDF Reporting)
    if (pdfAccountants >= 40 && !bulkheadIsolation) {
      checkoutLatencyMs += pdfAccountants * 28;
      salesAvailability -= Math.min(45, pdfAccountants * 0.35);
      activeFailures.push(
        `CRITICAL [Bulkhead]: ${pdfAccountants} accountants exporting 5-year PDFs starved the shared thread pool—Sales Checkout threads blocked!`
      );
    }

    // 4. Circuit Breaker on Partner API
    if (partnerApiLatencyMs >= 3000 && !circuitBreakerEnabled) {
      checkoutLatencyMs += Math.round(partnerApiLatencyMs * 0.6);
      salesAvailability -= 38;
      activeFailures.push(
        `CRITICAL [Circuit Breaker]: Partner API hung for ${(partnerApiLatencyMs / 1000).toFixed(1)}s without a Circuit Breaker—Cascading Failure across caller threads.`
      );
    } else if (partnerApiLatencyMs >= 3000 && circuitBreakerEnabled) {
      checkoutLatencyMs += 2; // 1ms Fail-Fast + Fallback
    }

    // 5. Idempotency (FE Generates UUID, BE Enforces Redlock)
    const duplicateCharges = feBeIdempotency ? 0 : Math.round(trafficMultiplier * mobileRetryRate * 1.9);
    if (!feBeIdempotency && mobileRetryRate > 0) {
      activeFailures.push(
        `HIGH [Idempotency]: Missing FE UUID + BE Redis Redlock caused ${duplicateCharges.toLocaleString()} duplicate customer charges on 4G retries.`
      );
    }

    // 6. Saga & Outbox (>4 steps)
    if (workflowSteps > 4 && !orchestrationOutbox) {
      salesAvailability -= 8;
      activeFailures.push(
        `HIGH [Saga/Outbox]: ${workflowSteps}-step workflow using peer-to-peer Choreography created "Event Spaghetti" and unrecovered partial rollbacks.`
      );
    }

    dbCpuPercent = Math.min(100, dbCpuPercent);
    salesAvailability = Math.max(0, Number(salesAvailability.toFixed(2)));

    return {
      checkoutLatencyMs,
      dbCpuPercent,
      salesAvailability,
      oversoldUnits,
      duplicateCharges,
      activeFailures
    };
  };

  // === COMPUTE LAB 2 METRICS ===
  const computeAiDataMetrics = () => {
    const queries = monthlyQueriesK * 1000;
    // Frontier LLM cost per query ~$0.035; SLM cost per query ~$0.0007 (1/50th cost)
    const slmShare = slmRoutePercent / 100;
    const llmShare = 1 - slmShare;

    let monthlyAiCost = queries * (slmShare * 0.0007 + llmShare * 0.035);
    let technicalCodeRecall = 97; // Hybrid BM25 + Vector + Reranker
    let citationAccuracy = 99;
    let queryLatencyMs = 420;
    const warnings: string[] = [];

    if (ragStrategy === 'pure-vector') {
      technicalCodeRecall = 38;
      citationAccuracy = 78;
      warnings.push(
        'Technical Code Blindness: Pure Dense Vector search fails on exact SKUs, national IDs, and error codes like EADDRNOTAVAIL (38% recall).'
      );
    } else if (ragStrategy === 'long-context') {
      monthlyAiCost = queries * 0.42; // 1M context window stuffing cost explosion
      technicalCodeRecall = 72;
      citationAccuracy = 68;
      queryLatencyMs = 6800;
      warnings.push(
        'Token Bankruptcy & "Lost in the Middle": Stuffing 500k+ tokens per request explodes inference cost and degrades middle-context recall.'
      );
    } else if (ragStrategy === 'weekly-finetune') {
      monthlyAiCost += 18500; // GPU retraining + hosting
      technicalCodeRecall = 31;
      citationAccuracy = 0;
      warnings.push(
        'Violates Chip Huyen Golden Rule ("Finetuning is for Form, RAG is for Facts"): 0% source citations and immediate knowledge cutoff staleness.'
      );
    }

    if (slmRoutePercent < 50 && ragStrategy !== 'long-context') {
      warnings.push(
        `Suboptimal Model Router: Only ${slmRoutePercent}% routed to SLMs. Routing 70-80% routine queries to Phi-4/Llama-3-8B cuts token cost by up to 50x.`
      );
    }

    const baselineAllFrontierCost = queries * 0.035;
    const threeYearSavingsUsd = Math.max(0, Math.round((baselineAllFrontierCost - monthlyAiCost) * 36));

    // CQRS & SAP CDC
    const historySearchMs = cqrsEnabled ? 180 : Math.min(4900, Math.round(readWriteRatio * 42));
    if (readWriteRatio >= 50 && !cqrsEnabled) {
      warnings.push(
        `CQRS Threshold Exceeded (${readWriteRatio}:1 > 50:1): Running 5-year history queries on the 3NF ACID Write DB causes ${historySearchMs}ms latency & row lock contention.`
      );
    }
    if (sapExtractionMode === 'raw-triggers') {
      warnings.push(
        'SAP Governance Breach: Direct triggers on physical SAP tables (BSEG/BKPF) violate runtime licensing and break on SAP Support Pack upgrades.'
      );
    }

    // Zero Trust ACL
    let securityBreachRisk: 'ZERO (Compliant)' | 'MODERATE (7-Day Revocation Lag)' | 'CRITICAL (Immediate Data Leak)' =
      'ZERO (Compliant)';
    if (aclMode === 'shared-sp-unsafe') {
      securityBreachRisk = 'CRITICAL (Immediate Data Leak)';
      warnings.push(
        'CRITICAL Zero-Trust Breach: Querying Vector DB with a shared Service Principal exposes confidential Board M&A and HR salary files to all users.'
      );
    } else if (aclMode === 'index-weekly') {
      securityBreachRisk = 'MODERATE (7-Day Revocation Lag)';
      warnings.push(
        'Permission Drift Risk: Weekly batch ACL sync leaves a 7-day window where users removed from SharePoint groups can still query restricted chunks.'
      );
    }

    return {
      monthlyAiCost: Math.round(monthlyAiCost),
      threeYearSavingsUsd,
      technicalCodeRecall,
      citationAccuracy,
      queryLatencyMs,
      historySearchMs,
      securityBreachRisk,
      warnings
    };
  };

  const chaos = computeChaosMetrics();
  const aiData = computeAiDataMetrics();

  const applyAllResilienceDefenses = () => {
    setBypassCdnDynamic(true);
    setRedisMutexLock(true);
    setFeBeIdempotency(true);
    setCircuitBreakerEnabled(true);
    setBulkheadIsolation(true);
    setOrchestrationOutbox(true);
  };

  const disableAllResilienceDefenses = () => {
    setBypassCdnDynamic(false);
    setRedisMutexLock(false);
    setFeBeIdempotency(false);
    setCircuitBreakerEnabled(false);
    setBulkheadIsolation(false);
    setOrchestrationOutbox(false);
  };

  return (
    <div className="simulator-container">
      <div className="section-header-bar">
        <div>
          <span className="eyebrow-tag">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p className="subtitle-copy">{copy.subtitle}</p>
        </div>
        <div className="sub-tab-switcher">
          <button
            id="sim-tab-chaos"
            className={`sub-tab-btn ${activeLab === 'chaos-p1' ? 'active' : ''}`}
            onClick={() => setActiveLab('chaos-p1')}
          >
            <Zap size={16} />
            {copy.lab1Btn}
          </button>
          <button
            id="sim-tab-aidata"
            className={`sub-tab-btn ${activeLab === 'ai-data-zero-trust' ? 'active' : ''}`}
            onClick={() => setActiveLab('ai-data-zero-trust')}
          >
            <Cpu size={16} />
            {copy.lab2Btn}
          </button>
        </div>
      </div>

      {activeLab === 'chaos-p1' ? (
        <div className="sim-grid">
          {/* Controls Column */}
          <div className="sim-panel">
            <div className="panel-title-row">
              <h3>
                <Sliders size={18} /> {copy.chaosParams}
              </h3>
              <span className="badge-neutral">{copy.workloadGen}</span>
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-traffic">{copy.trafficMult}</label>
                <span className="mono-value">{trafficMultiplier}x Load ({trafficMultiplier * 850} RPS)</span>
              </div>
              <input
                id="slider-traffic"
                type="range"
                min={1}
                max={100}
                value={trafficMultiplier}
                onChange={(e) => setTrafficMultiplier(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-pdf">{copy.pdfExports}</label>
                <span className="mono-value">{pdfAccountants} Accountants</span>
              </div>
              <input
                id="slider-pdf"
                type="range"
                min={0}
                max={200}
                step={10}
                value={pdfAccountants}
                onChange={(e) => setPdfAccountants(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-partner-latency">{copy.partnerLatency}</label>
                <span className="mono-value">{(partnerApiLatencyMs / 1000).toFixed(1)}s</span>
              </div>
              <input
                id="slider-partner-latency"
                type="range"
                min={50}
                max={30000}
                step={500}
                value={partnerApiLatencyMs}
                onChange={(e) => setPartnerApiLatencyMs(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-retry">{copy.mobileRetry}</label>
                <span className="mono-value">{mobileRetryRate}% Retries</span>
              </div>
              <input
                id="slider-retry"
                type="range"
                min={0}
                max={40}
                value={mobileRetryRate}
                onChange={(e) => setMobileRetryRate(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-steps">{copy.workflowSteps}</label>
                <span className="mono-value">{workflowSteps} Services {workflowSteps > 4 ? '(>4 Threshold!)' : ''}</span>
              </div>
              <input
                id="slider-steps"
                type="range"
                min={2}
                max={8}
                value={workflowSteps}
                onChange={(e) => setWorkflowSteps(Number(e.target.value))}
              />
            </div>

            <hr className="divider-line" />

            <div className="panel-title-row">
              <h3>
                <ShieldCheck size={18} /> {copy.safeguards}
              </h3>
              <div className="quick-btn-row">
                <button id="btn-enable-all-safeguards" className="btn-secondary-sm" onClick={applyAllResilienceDefenses}>
                  {copy.enableAll}
                </button>
                <button id="btn-disable-all-safeguards" className="btn-ghost-sm" onClick={disableAllResilienceDefenses}>
                  {copy.disableAll}
                </button>
              </div>
            </div>

            <div className="toggle-list">
              <label
                className={`toggle-card ${bypassCdnDynamic ? 'enabled' : ''}`}
                data-vi-title="Render Lai & Bỏ qua CDN cho Tồn kho"
                data-vi-tip="CDN chỉ cache khung tĩnh HTML/JS/CSS (<50ms); tồn kho thực tế đi thẳng về Backend để tránh bán âm kho (Overselling)."
              >
                <input
                  type="checkbox"
                  checked={bypassCdnDynamic}
                  onChange={(e) => setBypassCdnDynamic(e.target.checked)}
                />
                <div>
                  <strong>Hybrid Rendering + CDN Bypass for Inventory</strong>
                  <span>Static shell on CDN (&lt;50ms); real-time stock bypasses Edge cache to prevent Overselling.</span>
                </div>
              </label>

              <label
                className={`toggle-card ${redisMutexLock ? 'enabled' : ''}`}
                data-vi-title="Khóa Mutex Phân tán trên Redis"
                data-vi-tip="Khi hot key hết hạn, chỉ 1 request duy nhất được xuống DB tái tạo cache — ngăn chặn bão truy vấn (Cache Stampede)."
              >
                <input
                  type="checkbox"
                  checked={redisMutexLock}
                  onChange={(e) => setRedisMutexLock(e.target.checked)}
                />
                <div>
                  <strong>Distributed Mutex Lock on Cache-Aside (Redis)</strong>
                  <span>Single-flight DB rebuild on hot key expiration—prevents Cache Stampede (Dog-piling).</span>
                </div>
              </label>

              <label
                className={`toggle-card ${feBeIdempotency ? 'enabled' : ''}`}
                data-vi-title="Idempotency: FE sinh UUID, BE khóa Redlock"
                data-vi-tip="Ngăn chặn trừ tiền 2 lần khi người dùng bấm thanh toán lại trên mạng 4G chập chờn."
              >
                <input
                  type="checkbox"
                  checked={feBeIdempotency}
                  onChange={(e) => setFeBeIdempotency(e.target.checked)}
                />
                <div>
                  <strong>Idempotency: FE Generates UUID, BE Enforces Redlock</strong>
                  <span>Blocks duplicate payment charges when mobile clients retry timed-out POST requests.</span>
                </div>
              </label>

              <label
                className={`toggle-card ${circuitBreakerEnabled ? 'enabled' : ''}`}
                data-vi-title="Cầu dao ngắt mạch 3 trạng thái"
                data-vi-tip="Tự động chuyển sang OPEN khi API đối tác treo >3s — Fail-Fast trong 1ms và trả về phương án dự phòng."
              >
                <input
                  type="checkbox"
                  checked={circuitBreakerEnabled}
                  onChange={(e) => setCircuitBreakerEnabled(e.target.checked)}
                />
                <div>
                  <strong>3-State Circuit Breaker (CLOSED / OPEN / HALF-OPEN)</strong>
                  <span>Trips to OPEN on partner hang—Fail-Fast in 1ms with Graceful Degradation fallback.</span>
                </div>
              </label>

              <label
                className={`toggle-card ${bulkheadIsolation ? 'enabled' : ''}`}
                data-vi-title="Cô lập Tài nguyên Bulkhead (80% / 20%)"
                data-vi-tip="Tách riêng pool xử lý đơn hàng (80%) và xuất báo cáo PDF nặng (20%) để kế toán không kéo sập luồng bán hàng."
              >
                <input
                  type="checkbox"
                  checked={bulkheadIsolation}
                  onChange={(e) => setBulkheadIsolation(e.target.checked)}
                />
                <div>
                  <strong>Bulkhead Pattern (80% Sales / 20% PDF Report Pool)</strong>
                  <span>Isolates heavy 5-year PDF exports so accountant workloads never starve checkout threads.</span>
                </div>
              </label>

              <label
                className={`toggle-card ${orchestrationOutbox ? 'enabled' : ''}`}
                data-vi-title="Orchestration Saga + Transactional Outbox"
                data-vi-tip="Quản lý rollback theo thứ tự LIFO cho quy trình >4 bước và đảm bảo không mất event nhờ Outbox + CDC."
              >
                <input
                  type="checkbox"
                  checked={orchestrationOutbox}
                  onChange={(e) => setOrchestrationOutbox(e.target.checked)}
                />
                <div>
                  <strong>Orchestration Saga + Transactional Outbox</strong>
                  <span>State machine manages &gt;4 step LIFO rollbacks cleanly without Event Spaghetti or Dual-Write loss.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Live Telemetry Output Column */}
          <div className="sim-panel telemetry-panel">
            <div className="panel-title-row">
              <h3>
                <Activity size={18} /> Live Production Telemetry & Blast Radius
              </h3>
              <span className={chaos.activeFailures.length === 0 ? 'status-pill pass' : 'status-pill fail'}>
                {chaos.activeFailures.length === 0 ? 'ALL SLA GATES HEALTHY' : `${chaos.activeFailures.length} ACTIVE INCIDENTS`}
              </span>
            </div>

            <div className="kpi-grid-4">
              <div className={`kpi-box ${chaos.salesAvailability >= 99.9 ? 'good' : 'bad'}`}>
                <span className="kpi-label">Sales Checkout Availability</span>
                <strong className="kpi-val">{chaos.salesAvailability}%</strong>
                <span className="kpi-sub">Target SLA: 99.95%</span>
              </div>

              <div className={`kpi-box ${chaos.checkoutLatencyMs <= 200 ? 'good' : 'bad'}`}>
                <span className="kpi-label">Checkout P99 Latency</span>
                <strong className="kpi-val">{chaos.checkoutLatencyMs.toLocaleString()} ms</strong>
                <span className="kpi-sub">Target: &lt; 200 ms</span>
              </div>

              <div className={`kpi-box ${chaos.oversoldUnits === 0 ? 'good' : 'bad'}`}>
                <span className="kpi-label">Oversold Inventory Units</span>
                <strong className="kpi-val">{chaos.oversoldUnits.toLocaleString()}</strong>
                <span className="kpi-sub">{bypassCdnDynamic ? 'CDN Bypassed' : 'Stale CDN Cache!'}</span>
              </div>

              <div className={`kpi-box ${chaos.duplicateCharges === 0 ? 'good' : 'bad'}`}>
                <span className="kpi-label">Double-Charged Orders</span>
                <strong className="kpi-val">{chaos.duplicateCharges.toLocaleString()}</strong>
                <span className="kpi-sub">{feBeIdempotency ? 'Redlock Enforced' : 'No Idempotency Key!'}</span>
              </div>
            </div>

            <div className="meter-block">
              <div className="control-label-row">
                <span>Primary SQL Database CPU Utilization</span>
                <strong className={chaos.dbCpuPercent > 80 ? 'text-danger' : 'text-success'}>{chaos.dbCpuPercent}%</strong>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill ${chaos.dbCpuPercent > 80 ? 'danger' : 'teal'}`}
                  style={{ width: `${chaos.dbCpuPercent}%` }}
                />
              </div>
            </div>

            <div className="architecture-state-diagram">
              <h4>Live Request &amp; Fault Isolation Topology</h4>
              <Sim1LiveDiagram
                trafficMultiplier={trafficMultiplier}
                pdfAccountants={pdfAccountants}
                partnerApiLatencyMs={partnerApiLatencyMs}
                workflowSteps={workflowSteps}
                bypassCdnDynamic={bypassCdnDynamic}
                redisMutexLock={redisMutexLock}
                feBeIdempotency={feBeIdempotency}
                circuitBreakerEnabled={circuitBreakerEnabled}
                bulkheadIsolation={bulkheadIsolation}
                orchestrationOutbox={orchestrationOutbox}
              />
            </div>

            <div className="incident-feed">
              <h4>Real-Time Architectural Diagnostics</h4>
              {chaos.activeFailures.length === 0 ? (
                <div className="alert-banner success">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Zero Cascading Failures Detected:</strong> Despite a {trafficMultiplier}x Flash Sale spike, {pdfAccountants} concurrent 5-year PDF exports, and a {(partnerApiLatencyMs / 1000).toFixed(1)}s partner outage, your Bulkhead, Circuit Breaker, Mutex Lock, CDN Bypass, and FE/BE Idempotency boundaries kept checkout running at {chaos.checkoutLatencyMs}ms.
                  </div>
                </div>
              ) : (
                chaos.activeFailures.map((fail, idx) => (
                  <div key={idx} className="alert-banner danger">
                    <AlertTriangle size={18} />
                    <div>{fail}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* === LAB 2: PILLARS 2, 3, 4 SIMULATOR === */
        <div className="sim-grid">
          <div className="sim-panel">
            <div className="panel-title-row">
              <h3>
                <Sliders size={18} /> Enterprise Data, AI FinOps & Zero-Trust Controls
              </h3>
              <span className="badge-neutral">Pillars 2, 3 & 4</span>
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-queries">Monthly Enterprise AI Queries</label>
                <span className="mono-value">{(monthlyQueriesK / 1000).toFixed(1)}M Queries / mo</span>
              </div>
              <input
                id="slider-queries"
                type="range"
                min={100}
                max={5000}
                step={100}
                value={monthlyQueriesK}
                onChange={(e) => setMonthlyQueriesK(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-slm">AI Gateway Model Router: SLM Offload % (Phi-4 / Llama-3-8B)</label>
                <span className="mono-value">
                  {slmRoutePercent}% SLM / {100 - slmRoutePercent}% Frontier LLM
                </span>
              </div>
              <input
                id="slider-slm"
                type="range"
                min={0}
                max={90}
                step={5}
                value={slmRoutePercent}
                onChange={(e) => setSlmRoutePercent(Number(e.target.value))}
              />
              <small className="helper-note">
                Handbook Golden Target: Route 70–80% simple queries to SLMs (1/50th token cost) with Confidence Escalation.
              </small>
            </div>

            <div className="control-group">
              <label className="field-label">Knowledge Grounding Strategy (Chip Huyen Matrix)</label>
              <div className="radio-group-grid">
                <button
                  type="button"
                  className={`choice-pill ${ragStrategy === 'hybrid-rerank' ? 'selected' : ''}`}
                  onClick={() => setRagStrategy('hybrid-rerank')}
                >
                  <strong>Hybrid RAG (BM25 + Vector + Reranker)</strong>
                  <span>Solves Technical Code Blindness + 100% Citations</span>
                </button>
                <button
                  type="button"
                  className={`choice-pill ${ragStrategy === 'pure-vector' ? 'selected' : ''}`}
                  onClick={() => setRagStrategy('pure-vector')}
                >
                  <strong>Pure Vector Search Only (HNSW)</strong>
                  <span>Fails on exact SKUs &amp; error codes (EADDRNOTAVAIL)</span>
                </button>
                <button
                  type="button"
                  className={`choice-pill ${ragStrategy === 'long-context' ? 'selected' : ''}`}
                  onClick={() => setRagStrategy('long-context')}
                >
                  <strong>1M+ Long Context Prompt Stuffing</strong>
                  <span>Extreme inference cost + &quot;Lost in the Middle&quot;</span>
                </button>
                <button
                  type="button"
                  className={`choice-pill ${ragStrategy === 'weekly-finetune' ? 'selected' : ''}`}
                  onClick={() => setRagStrategy('weekly-finetune')}
                >
                  <strong>Weekly LoRA Finetuning for Facts</strong>
                  <span>0% citations, frozen weights, GPU overhead</span>
                </button>
              </div>
            </div>

            <hr className="divider-line" />

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="slider-rw">Enterprise Data Read/Write Ratio (5-Year History vs. Writes)</label>
                <span className="mono-value">{readWriteRatio}:1 Ratio {readWriteRatio >= 50 ? '(>50:1 CQRS Gate!)' : ''}</span>
              </div>
              <input
                id="slider-rw"
                type="range"
                min={10}
                max={120}
                step={5}
                value={readWriteRatio}
                onChange={(e) => setReadWriteRatio(Number(e.target.value))}
              />
            </div>

            <div className="two-col-controls">
              <div>
                <label className="field-label">CQRS Separation (SQL + Elasticsearch)</label>
                <button
                  type="button"
                  className={`choice-pill full-width ${cqrsEnabled ? 'selected' : ''}`}
                  onClick={() => setCqrsEnabled(!cqrsEnabled)}
                >
                  <strong>{cqrsEnabled ? 'CQRS Enabled (Async CDC Sync)' : 'Single SQL DB (No CQRS)'}</strong>
                  <span>{cqrsEnabled ? '3NF Write DB + Denormalized Elasticsearch' : 'Shared table for writes & 5Y search'}</span>
                </button>
              </div>
              <div>
                <label className="field-label">SAP ERP Extraction Boundary</label>
                <button
                  type="button"
                  className={`choice-pill full-width ${sapExtractionMode === 'odp-cdc' ? 'selected' : ''}`}
                  onClick={() => setSapExtractionMode(sapExtractionMode === 'odp-cdc' ? 'raw-triggers' : 'odp-cdc')}
                >
                  <strong>{sapExtractionMode === 'odp-cdc' ? 'Sanctioned SAP ODP / SLT CDC' : 'Raw JDBC Triggers on BSEG/BKPF'}</strong>
                  <span>{sapExtractionMode === 'odp-cdc' ? 'License compliant + Canonical Model' : 'Violates SAP license & breaks on upgrade'}</span>
                </button>
              </div>
            </div>

            <div className="control-group" style={{ marginTop: '1rem' }}>
              <label className="field-label">M365 / SharePoint RBAC Security Trimming (Pillar 4 Zero Trust)</label>
              <div className="radio-group-stack">
                <button
                  type="button"
                  className={`choice-pill ${aclMode === 'obo-hybrid-trim' ? 'selected' : ''}`}
                  onClick={() => setAclMode('obo-hybrid-trim')}
                >
                  <strong>Entra ID On-Behalf-Of (OBO) + Hybrid Security Trimming</strong>
                  <span>Webhook ACL pre-filter + live Top-K permission check + WORM Audit Log</span>
                </button>
                <button
                  type="button"
                  className={`choice-pill ${aclMode === 'index-weekly' ? 'selected' : ''}`}
                  onClick={() => setAclMode('index-weekly')}
                >
                  <strong>Weekly Batch Index-Time ACL Sync Only</strong>
                  <span>Fast query, but 7-day exposure window after permission revocation</span>
                </button>
                <button
                  type="button"
                  className={`choice-pill ${aclMode === 'shared-sp-unsafe' ? 'selected' : ''}`}
                  onClick={() => setAclMode('shared-sp-unsafe')}
                >
                  <strong>Shared Backend Admin Service Principal (No User ACL Filter)</strong>
                  <span>CRITICAL BREACH: Interns can query Board M&amp;A and HR Payroll chunks</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lab 2 Telemetry Output */}
          <div className="sim-panel telemetry-panel">
            <div className="panel-title-row">
              <h3>
                <DollarSign size={18} /> FinOps, Retrieval Accuracy & Zero-Trust Posture
              </h3>
              <span className={aiData.warnings.length === 0 ? 'status-pill pass' : 'status-pill fail'}>
                {aiData.warnings.length === 0 ? 'OPTIMAL ENTERPRISE ARCHITECTURE' : `${aiData.warnings.length} ARCHITECTURAL RISKS`}
              </span>
            </div>

            <div className="kpi-grid-4">
              <div className={`kpi-box ${aiData.monthlyAiCost <= 15000 ? 'good' : 'bad'}`}>
                <span className="kpi-label">Monthly AI Inference Cost</span>
                <strong className="kpi-val">${aiData.monthlyAiCost.toLocaleString()}</strong>
                <span className="kpi-sub">3Y Router Savings: ${aiData.threeYearSavingsUsd.toLocaleString()}</span>
              </div>

              <div className={`kpi-box ${aiData.technicalCodeRecall >= 90 ? 'good' : 'bad'}`}>
                <span className="kpi-label">Exact SKU / Error Code Recall</span>
                <strong className="kpi-val">{aiData.technicalCodeRecall}%</strong>
                <span className="kpi-sub">Citations: {aiData.citationAccuracy}% Grounded</span>
              </div>

              <div className={`kpi-box ${aiData.historySearchMs <= 500 ? 'good' : 'bad'}`}>
                <span className="kpi-label">5-Year History Query Latency</span>
                <strong className="kpi-val">{aiData.historySearchMs} ms</strong>
                <span className="kpi-sub">{cqrsEnabled ? 'Elasticsearch Read DB' : 'Single SQL Table Scan'}</span>
              </div>

              <div className={`kpi-box ${aiData.securityBreachRisk.startsWith('ZERO') ? 'good' : 'bad'}`}>
                <span className="kpi-label">M365 RBAC Leakage Risk</span>
                <strong className="kpi-val" style={{ fontSize: '0.95rem' }}>{aiData.securityBreachRisk}</strong>
                <span className="kpi-sub">Zero-Trust Gatekeeper</span>
              </div>
            </div>

            <div className="architecture-state-diagram">
              <h4>Active Data &amp; AI Pipeline Blueprint</h4>
              <Sim2LiveDiagram
                sapExtractionMode={sapExtractionMode}
                cqrsEnabled={cqrsEnabled}
                readWriteRatio={readWriteRatio}
                slmRoutePercent={slmRoutePercent}
                ragStrategy={ragStrategy}
                aclMode={aclMode}
              />
            </div>

            <div className="incident-feed">
              <h4>Architectural Trade-off &amp; Governance Findings</h4>
              {aiData.warnings.length === 0 ? (
                <div className="alert-banner success">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>All Pillars Aligned:</strong> Model Router offloads {slmRoutePercent}% of traffic to SLMs (saving ${aiData.threeYearSavingsUsd.toLocaleString()} over 36 months), Hybrid BM25+Vector+Reranker cures Technical Code Blindness ({aiData.technicalCodeRecall}% recall), CQRS handles the {readWriteRatio}:1 skew in {aiData.historySearchMs}ms, and Entra ID OBO prevents unauthorized M365 data leaks.
                  </div>
                </div>
              ) : (
                aiData.warnings.map((w, idx) => (
                  <div key={idx} className="alert-banner danger">
                    <ShieldAlert size={18} />
                    <div>{w}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
