import React from 'react';
import {
  Activity,
  Bot,
  Cpu,
  Database,
  FileText,
  Globe,
  KeyRound,
  Layers,
  Lock,
  Server,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Split,
  Workflow,
  Zap
} from 'lucide-react';
import { GlossaryText } from './GlossaryText';

export type NodeTone = 'sky' | 'teal' | 'emerald' | 'amber' | 'crimson' | 'slate';

interface FlowNodeProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  tone?: NodeTone;
}

const FlowNode: React.FC<FlowNodeProps> = ({ icon, title, subtitle, badge, tone = 'slate' }) => (
  <div className={`arch-node tone-${tone}`}>
    <div className="arch-node-head">
      <span className="arch-node-icon">{icon}</span>
      {badge && (
        <span className="arch-node-badge">
          <GlossaryText text={badge} />
        </span>
      )}
    </div>
    <strong className="arch-node-title">
      <GlossaryText text={title} />
    </strong>
    {subtitle && (
      <span className="arch-node-sub">
        <GlossaryText text={subtitle} />
      </span>
    )}
  </div>
);

interface FlowArrowProps {
  label?: string;
  tone?: 'normal' | 'safe' | 'danger' | 'amber';
  vertical?: boolean;
}

const FlowArrow: React.FC<FlowArrowProps> = ({ label, tone = 'normal', vertical = false }) => (
  <div className={`arch-arrow ${vertical ? 'vertical' : 'horizontal'} tone-${tone}`}>
    <div className="arch-arrow-line">
      <span className="arch-arrow-pulse" />
    </div>
    {label && (
      <span className="arch-arrow-label">
        <GlossaryText text={label} />
      </span>
    )}
    <span className="arch-arrow-tip">{vertical ? '▼' : '▶'}</span>
  </div>
);

export const TopicFlowDiagram: React.FC<{ topicId: string }> = ({ topicId }) => {
  switch (topicId) {
    case 'p1-edge-gateway':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Smartphone size={18} />}
              title="Mobile / Web Client"
              subtitle="Browser & App Ingress"
              tone="slate"
            />
            <div className="flow-branches-col">
              <div className="flow-branch-line">
                <FlowArrow label="Static Shell (HTML/JS/CSS)" tone="safe" />
                <FlowNode
                  icon={<Globe size={18} />}
                  title="CDN Edge Cache"
                  subtitle="Edge POPs · Public Assets"
                  badge="< 50 ms"
                  tone="emerald"
                />
              </div>
              <div className="flow-branch-line">
                <FlowArrow label="Dynamic Inventory / Cart (Bypass CDN)" tone="amber" />
                <FlowNode
                  icon={<Split size={18} />}
                  title="Multi-AZ NLB"
                  subtitle="L4 High Availability"
                  tone="sky"
                />
                <FlowArrow label="L7 Route" tone="normal" />
                <FlowNode
                  icon={<Server size={18} />}
                  title="HA Lean API Gateway"
                  subtitle="AuthN · Rate Limit · Discovery"
                  badge="No Biz Logic"
                  tone="teal"
                />
                <div className="flow-mini-stack">
                  <span className="mini-svc-pill">/orders Svc</span>
                  <span className="mini-svc-pill">/catalog Svc</span>
                  <span className="mini-svc-pill">/users Svc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'p1-cache-stampede':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Smartphone size={18} />}
              title="100k Concurrent Reads"
              subtitle="Hot Key Expired"
              tone="slate"
            />
            <FlowArrow label="1. Lookup" tone="normal" />
            <FlowNode
              icon={<Zap size={18} />}
              title="Redis Cache-Aside"
              subtitle="Hit: <1ms | Miss: Coalesce"
              badge="TTL + Jitter"
              tone="sky"
            />
            <FlowArrow label="2. Cache Miss" tone="amber" />
            <FlowNode
              icon={<Lock size={18} />}
              title="Distributed Mutex Lock"
              subtitle="Single-Flight Coalescing"
              badge="1 Thread Only"
              tone="emerald"
            />
            <div className="flow-branches-col">
              <div className="flow-branch-line">
                <FlowArrow label="Lock Acquired (1 Thread)" tone="safe" />
                <FlowNode
                  icon={<Database size={18} />}
                  title="Primary SQL DB"
                  subtitle="Computes & Refills Redis"
                  tone="teal"
                />
              </div>
              <div className="flow-branch-line">
                <FlowArrow label="Lock Busy (99,999 Threads)" tone="amber" />
                <FlowNode
                  icon={<Activity size={18} />}
                  title="Wait 20ms / Serve Stale"
                  subtitle="Zero DB Stampede"
                  tone="slate"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'p1-eda-idempotency-saga':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Smartphone size={18} />}
              title="Client (3G/4G)"
              subtitle="FE Generates UUID Key"
              badge="Idempotency-Key"
              tone="sky"
            />
            <FlowArrow label="POST + UUID" tone="normal" />
            <FlowNode
              icon={<Lock size={18} />}
              title="Order API + Redlock"
              subtitle="BE Enforces Uniqueness"
              badge="No Double Charge"
              tone="emerald"
            />
            <FlowArrow label="1 Local ACID Tx" tone="safe" />
            <FlowNode
              icon={<Database size={18} />}
              title="Order + Outbox Table"
              subtitle="Debezium CDC Relay"
              tone="teal"
            />
            <FlowArrow label="Backpressure" tone="normal" />
            <FlowNode
              icon={<Workflow size={18} />}
              title="Kafka + Saga Orchestrator"
              subtitle=">4 Steps State Machine"
              badge="LIFO Rollback"
              tone="amber"
            />
          </div>
        </div>
      );

    case 'p1-resilience-modernization':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Split size={18} />}
              title="Strangler Fig Façade"
              subtitle="90% Legacy -> 10% New"
              badge="Phased Cutover"
              tone="sky"
            />
            <div className="flow-branches-col">
              <div className="flow-branch-line">
                <FlowArrow label="80% Dedicated Pool" tone="safe" />
                <FlowNode
                  icon={<ShieldCheck size={18} />}
                  title="Bulkhead Pool A: Sales"
                  subtitle="0.05s Checkout SLA"
                  badge="80% Threads"
                  tone="emerald"
                />
                <FlowArrow label="Circuit Breaker" tone="amber" />
                <FlowNode
                  icon={<Zap size={18} />}
                  title="Partner Payment API"
                  subtitle="OPEN: 1ms Fail-Fast + Fallback"
                  badge="3-State CB"
                  tone="teal"
                />
              </div>
              <div className="flow-branch-line">
                <FlowArrow label="20% Isolated Pool" tone="normal" />
                <FlowNode
                  icon={<FileText size={18} />}
                  title="Bulkhead Pool B: PDF"
                  subtitle="100 Accountants · 5Y Reports"
                  badge="20% Capped"
                  tone="amber"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'p2-cqrs-sap-cdc':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Server size={18} />}
              title="SAP S/4HANA ERP"
              subtitle="BSEG / BKPF Protected"
              badge="ODP / SLT CDC"
              tone="sky"
            />
            <FlowArrow label="Sanctioned CDC" tone="safe" />
            <FlowNode
              icon={<Database size={18} />}
              title="Command DB (3NF SQL)"
              subtitle="Strict ACID Financial Writes"
              badge="Write Model"
              tone="teal"
            />
            <FlowArrow label="Async CDC Sync" tone="amber" />
            <FlowNode
              icon={<Zap size={18} />}
              title="Query DB (Elasticsearch)"
              subtitle="Denormalized 5Y History"
              badge="< 0.5s (>50:1)"
              tone="emerald"
            />
          </div>
        </div>
      );

    case 'p2-mesh-lakehouse-mdm':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Database size={18} />}
              title="SAP · CRM · M365"
              subtitle="Fragmented Sources"
              tone="slate"
            />
            <FlowArrow label="Match & Merge" tone="normal" />
            <FlowNode
              icon={<ShieldCheck size={18} />}
              title="MDM Golden Record"
              subtitle="Single Customer / SKU ID"
              badge="System of Record"
              tone="teal"
            />
            <FlowArrow label="Data Contracts" tone="safe" />
            <FlowNode
              icon={<Layers size={18} />}
              title="Lakehouse + Domain Mesh"
              subtitle="Delta / Iceberg Shared Storage"
              badge="Federated Gov"
              tone="sky"
            />
            <FlowArrow label="Column Lineage" tone="safe" />
            <FlowNode
              icon={<Bot size={18} />}
              title="CFO BI & Enterprise RAG"
              subtitle="100% Traceable"
              tone="emerald"
            />
          </div>
        </div>
      );

    case 'p3-model-router-rag':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Smartphone size={18} />}
              title="User Query"
              subtitle="SKUs · Policies · Reasoning"
              tone="slate"
            />
            <FlowArrow label="AI Gateway" tone="normal" />
            <FlowNode
              icon={<Split size={18} />}
              title="Semantic Model Router"
              subtitle="Confidence Escalation"
              badge="FinOps Gate"
              tone="teal"
            />
            <div className="flow-branches-col">
              <div className="flow-branch-line">
                <FlowArrow label="75% Routine Queries" tone="safe" />
                <FlowNode
                  icon={<Cpu size={18} />}
                  title="SLM (Phi-4 / Llama-3-8B)"
                  subtitle="Low Latency · 1/50th Cost"
                  badge="75% Traffic"
                  tone="emerald"
                />
              </div>
              <div className="flow-branch-line">
                <FlowArrow label="25% Complex Reasoning" tone="amber" />
                <FlowNode
                  icon={<Bot size={18} />}
                  title="Frontier LLM (GPT-4o/Claude)"
                  subtitle="Grounded via Hybrid RAG"
                  badge="25% Traffic"
                  tone="sky"
                />
                <FlowArrow label="Top-5 Citations" tone="safe" />
                <FlowNode
                  icon={<Database size={18} />}
                  title="BM25 + Vector + Reranker"
                  subtitle="Cures Code Blindness"
                  tone="teal"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'p3-agentic-mcp-guardrails':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<ShieldCheck size={18} />}
              title="Input Guardrails"
              subtitle="Jailbreak & PII Check"
              tone="sky"
            />
            <FlowArrow label="Sanitized" tone="safe" />
            <FlowNode
              icon={<Workflow size={18} />}
              title="Bounded Orchestrator"
              subtitle="Deterministic State Graph"
              badge="Max 5 Steps"
              tone="teal"
            />
            <FlowArrow label="MCP Protocol" tone="normal" />
            <div className="flow-branches-col">
              <div className="flow-branch-line">
                <FlowNode
                  icon={<Database size={18} />}
                  title="MCP: SAP & M365 Read"
                  subtitle="Scoped OBO Credentials"
                  tone="emerald"
                />
              </div>
              <div className="flow-branch-line">
                <FlowNode
                  icon={<Lock size={18} />}
                  title="MCP: ERP Write Action"
                  subtitle="Human-in-the-Loop Gate"
                  badge="Approval Req."
                  tone="amber"
                />
              </div>
            </div>
            <FlowArrow label="CI/CD Eval" tone="safe" />
            <FlowNode
              icon={<Activity size={18} />}
              title="Output Guard + RAGAS"
              subtitle="Faithfulness >= 0.90"
              tone="emerald"
            />
          </div>
        </div>
      );

    case 'p4-m365-rbac-zero-trust':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<KeyRound size={18} />}
              title="User Entra ID JWT"
              subtitle="Human Security Context"
              badge="Zero Trust"
              tone="sky"
            />
            <FlowArrow label="OBO Token Flow" tone="safe" />
            <FlowNode
              icon={<ShieldCheck size={18} />}
              title="Hybrid ACL Trimming"
              subtitle="1. Index ACL Pre-Filter + 2. Live Top-5 Verify"
              badge="< 60s Revoke"
              tone="emerald"
            />
            <FlowArrow label="Authorized Chunks Only" tone="safe" />
            <FlowNode
              icon={<Bot size={18} />}
              title="Grounded LLM"
              subtitle="No Admin Service Principal"
              tone="teal"
            />
          </div>
        </div>
      );

    case 'p4-sovereignty-audit-trail':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Lock size={18} />}
              title="In-Country PII Vault"
              subtitle="Tokenize PII Before Cloud"
              badge="Sovereign Zone"
              tone="sky"
            />
            <FlowArrow label="Private Link" tone="safe" />
            <FlowNode
              icon={<Server size={18} />}
              title="Regional AI + BYOK"
              subtitle="Customer-Managed Keys"
              tone="teal"
            />
            <FlowArrow label="Append-Only" tone="normal" />
            <FlowNode
              icon={<FileText size={18} />}
              title="Immutable WORM Audit"
              subtitle="UserOID · ChunkIDs · ACL Proof"
              badge="< 15m Replay"
              tone="emerald"
            />
          </div>
        </div>
      );

    case 'p3-ai-gateway-cache-fallback':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<KeyRound size={18} />}
              title="Prompt + RBAC Hash"
              subtitle="Entra Security Group Scope"
              tone="slate"
            />
            <FlowArrow label="Cosine > 0.92?" tone="normal" />
            <FlowNode
              icon={<Zap size={18} />}
              title="Semantic Cache (Redis)"
              subtitle="Scoped by RBAC Group Hash"
              badge="HIT <50ms · $0"
              tone="emerald"
            />
            <div className="flow-branches-col">
              <div className="flow-branch-line">
                <FlowArrow label="Miss → Primary" tone="normal" />
                <FlowNode
                  icon={<Bot size={18} />}
                  title="Azure OpenAI"
                  subtitle="429 / 5xx Circuit Breaker"
                  tone="sky"
                />
              </div>
              <div className="flow-branch-line">
                <FlowArrow label="Fallback 1" tone="amber" />
                <FlowNode
                  icon={<ShieldCheck size={18} />}
                  title="Anthropic Claude"
                  subtitle="Cross-Vendor Failover"
                  tone="teal"
                />
              </div>
              <div className="flow-branch-line">
                <FlowArrow label="Fallback 2" tone="safe" />
                <FlowNode
                  icon={<Cpu size={18} />}
                  title="Self-Hosted SLM"
                  subtitle="vLLM / Phi-4 Sovereign"
                  badge="99.95% SLA"
                  tone="emerald"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'p5-finops-monolith-egress':
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Layers size={18} />}
              title="Modular Monolith"
              subtitle="<30 Devs · In-Process Calls"
              badge="$0 Internal Egress"
              tone="emerald"
            />
            <FlowArrow label="Hot Scale?" tone="amber" />
            <FlowNode
              icon={<Split size={18} />}
              title="Targeted Extraction"
              subtitle="Extract Only Bottleneck"
              badge="Same-AZ VPC"
              tone="teal"
            />
            <FlowArrow label="Lifecycle Tier" tone="safe" />
            <div className="flow-branches-col">
              <div className="flow-branch-line">
                <FlowNode
                  icon={<Database size={18} />}
                  title="Hot Tier (0–30d)"
                  subtitle="Primary SQL SSD"
                  tone="amber"
                />
              </div>
              <div className="flow-branch-line">
                <FlowNode
                  icon={<Server size={18} />}
                  title="Warm / Cold (30d–7y)"
                  subtitle="Object + Archive · VPC Endpoint"
                  badge="-60% Storage"
                  tone="sky"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'p5-gatekeeper-adr-tco':
    default:
      return (
        <div className="visual-flow-canvas">
          <div className="flow-row">
            <FlowNode
              icon={<Layers size={18} />}
              title="Proposed Design"
              subtitle="5-Pillar Architecture"
              tone="slate"
            />
            <FlowArrow label="Validate" tone="normal" />
            <FlowNode
              icon={<ShieldCheck size={18} />}
              title="7-Layer SA Gatekeeper"
              subtitle="Edge · CQRS · Saga · Bulkhead · SAP · AI · Zero Trust"
              badge="7 Red-Line Gates"
              tone="teal"
            />
            <FlowArrow label="Document" tone="safe" />
            <FlowNode
              icon={<FileText size={18} />}
              title="Docs-as-Code ADR + 3Y TCO"
              subtitle="Sensitivity @ 3x Growth"
              tone="sky"
            />
            <FlowArrow label="Defend" tone="safe" />
            <FlowNode
              icon={<Activity size={18} />}
              title="CxO Board Approval"
              subtitle="CFO · CISO · SRE · VP"
              badge="Go-Live Ready"
              tone="emerald"
            />
          </div>
        </div>
      );
  }
};

export const Sim1LiveDiagram: React.FC<{
  trafficMultiplier: number;
  pdfAccountants: number;
  partnerApiLatencyMs: number;
  workflowSteps: number;
  bypassCdnDynamic: boolean;
  redisMutexLock: boolean;
  feBeIdempotency: boolean;
  circuitBreakerEnabled: boolean;
  bulkheadIsolation: boolean;
  orchestrationOutbox: boolean;
}> = ({
  trafficMultiplier,
  pdfAccountants,
  partnerApiLatencyMs,
  workflowSteps,
  bypassCdnDynamic,
  redisMutexLock,
  feBeIdempotency,
  circuitBreakerEnabled,
  bulkheadIsolation,
  orchestrationOutbox
}) => (
  <div className="visual-flow-canvas compact">
    <div className="flow-row">
      <FlowNode
        icon={<Smartphone size={17} />}
        title={`Client (${trafficMultiplier}x)`}
        subtitle={`${(trafficMultiplier * 850).toLocaleString()} RPS`}
        tone="slate"
      />
      <FlowArrow label="Edge" tone={bypassCdnDynamic ? 'safe' : 'danger'} />
      <FlowNode
        icon={bypassCdnDynamic ? <Globe size={17} /> : <ShieldAlert size={17} />}
        title="CDN Edge"
        subtitle={bypassCdnDynamic ? 'Static Shell Only' : 'Caching Dynamic Stock!'}
        badge={bypassCdnDynamic ? 'SAFE' : 'OVERSELLING'}
        tone={bypassCdnDynamic ? 'emerald' : 'crimson'}
      />
      <FlowArrow label="Idempotency" tone={feBeIdempotency ? 'safe' : 'danger'} />
      <FlowNode
        icon={<Lock size={17} />}
        title="Gateway + Redlock"
        subtitle={feBeIdempotency ? 'FE UUID + BE Redlock' : 'No Idempotency Key!'}
        badge={feBeIdempotency ? 'SAFE' : '2x CHARGE'}
        tone={feBeIdempotency ? 'emerald' : 'crimson'}
      />
    </div>

    <div className="flow-row" style={{ marginTop: '0.65rem' }}>
      <FlowNode
        icon={<Zap size={17} />}
        title="Redis Cache"
        subtitle={redisMutexLock ? 'Mutex Single-Flight' : 'Unprotected Misses!'}
        badge={redisMutexLock ? 'SAFE' : 'STAMPEDE'}
        tone={redisMutexLock ? 'emerald' : 'crimson'}
      />
      <FlowArrow label="Pool" tone={bulkheadIsolation ? 'safe' : 'danger'} />
      <FlowNode
        icon={<Layers size={17} />}
        title="Thread Bulkhead"
        subtitle={
          bulkheadIsolation
            ? `80% Sales | 20% PDF (${pdfAccountants})`
            : `Shared Pool (${pdfAccountants} PDFs!)`
        }
        badge={bulkheadIsolation ? 'ISOLATED' : 'STARVED'}
        tone={bulkheadIsolation ? 'emerald' : 'crimson'}
      />
      <FlowArrow label="Partner" tone={circuitBreakerEnabled || partnerApiLatencyMs < 3000 ? 'safe' : 'danger'} />
      <FlowNode
        icon={<Activity size={17} />}
        title="Circuit Breaker"
        subtitle={
          circuitBreakerEnabled
            ? 'OPEN: 1ms Fail-Fast'
            : `Blocking ${(partnerApiLatencyMs / 1000).toFixed(1)}s`
        }
        badge={circuitBreakerEnabled ? 'PROTECTED' : 'HANG RISK'}
        tone={circuitBreakerEnabled ? 'emerald' : 'crimson'}
      />
      <FlowArrow label={`${workflowSteps} Steps`} tone={orchestrationOutbox || workflowSteps <= 4 ? 'safe' : 'amber'} />
      <FlowNode
        icon={<Workflow size={17} />}
        title="Saga & Outbox"
        subtitle={orchestrationOutbox ? 'Orchestrator + CDC' : 'Choreography Spaghetti'}
        badge={orchestrationOutbox ? 'ATOMIC' : 'RISK'}
        tone={orchestrationOutbox ? 'emerald' : 'amber'}
      />
    </div>
  </div>
);

export const Sim2LiveDiagram: React.FC<{
  sapExtractionMode: 'odp-cdc' | 'raw-triggers';
  cqrsEnabled: boolean;
  readWriteRatio: number;
  slmRoutePercent: number;
  ragStrategy: string;
  aclMode: string;
}> = ({
  sapExtractionMode,
  cqrsEnabled,
  readWriteRatio,
  slmRoutePercent,
  ragStrategy,
  aclMode
}) => (
  <div className="visual-flow-canvas compact">
    <div className="flow-row">
      <FlowNode
        icon={<Server size={17} />}
        title="SAP S/4HANA"
        subtitle={sapExtractionMode === 'odp-cdc' ? 'Sanctioned ODP/SLT' : 'Raw BSEG Triggers!'}
        badge={sapExtractionMode === 'odp-cdc' ? 'COMPLIANT' : 'LICENSE RISK'}
        tone={sapExtractionMode === 'odp-cdc' ? 'emerald' : 'crimson'}
      />
      <FlowArrow label={`${readWriteRatio}:1 R/W`} tone={cqrsEnabled || readWriteRatio < 50 ? 'safe' : 'danger'} />
      <FlowNode
        icon={<Database size={17} />}
        title={cqrsEnabled ? 'CQRS (SQL + Elastic)' : 'Single SQL DB'}
        subtitle={cqrsEnabled ? 'Async CDC Read Store' : 'Lock Contention!'}
        badge={cqrsEnabled ? '< 0.5s' : 'SLOW'}
        tone={cqrsEnabled || readWriteRatio < 50 ? 'emerald' : 'crimson'}
      />
      <FlowArrow label="Router" tone={slmRoutePercent >= 60 ? 'safe' : 'amber'} />
      <FlowNode
        icon={<Split size={17} />}
        title="AI Model Router"
        subtitle={`${slmRoutePercent}% SLM | ${100 - slmRoutePercent}% LLM`}
        badge={slmRoutePercent >= 60 ? 'FINOPS OK' : 'HIGH TCO'}
        tone={slmRoutePercent >= 60 ? 'emerald' : 'amber'}
      />
      <FlowArrow label="Grounding" tone={ragStrategy === 'hybrid-rerank' ? 'safe' : 'danger'} />
      <FlowNode
        icon={<Bot size={17} />}
        title={
          ragStrategy === 'hybrid-rerank'
            ? 'Hybrid RAG + Rerank'
            : ragStrategy === 'pure-vector'
            ? 'Pure Vector Only'
            : ragStrategy === 'long-context'
            ? '1M Long Context'
            : 'Weekly Finetuning'
        }
        subtitle={ragStrategy === 'hybrid-rerank' ? 'BM25 + HNSW + Citations' : 'Accuracy / Cost Flaw!'}
        tone={ragStrategy === 'hybrid-rerank' ? 'emerald' : 'crimson'}
      />
      <FlowArrow label="RBAC" tone={aclMode === 'obo-hybrid-trim' ? 'safe' : 'danger'} />
      <FlowNode
        icon={<KeyRound size={17} />}
        title="M365 Security"
        subtitle={
          aclMode === 'obo-hybrid-trim'
            ? 'Entra OBO + Hybrid Trim'
            : aclMode === 'index-weekly'
            ? '7-Day Stale ACL'
            : 'Shared Admin SP!'
        }
        badge={aclMode === 'obo-hybrid-trim' ? 'ZERO TRUST' : 'LEAK RISK'}
        tone={aclMode === 'obo-hybrid-trim' ? 'emerald' : 'crimson'}
      />
    </div>
  </div>
);
