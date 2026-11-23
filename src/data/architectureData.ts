export interface TradeOffAxis {
  metric: string;
  optionA: number;
  optionB: number;
  optionC?: number;
}

export interface ArchitectureOption {
  id: string;
  name: string;
  tagline: string;
  pros: string[];
  cons: string[];
  whenToUse: string;
  costProfile: 'Low' | 'Medium' | 'High' | 'Variable';
  opsComplexity: 'Low' | 'Medium' | 'High';
}

export interface ArchitectureTopic {
  id: string;
  pillarId: string;
  code: string;
  title: string;
  subtitle: string;
  goldenRule: string;
  businessContext: string;
  asciiFlow: string;
  antiPatterns: {
    name: string;
    symptom: string;
    businessImpact: string;
    remediation: string;
  }[];
  boundaries: {
    zone: string;
    responsibility: string;
    mustNeverCross: string;
  }[];
  day2Ops: {
    failureMode: string;
    blastRadius: string;
    mitigationMechanism: string;
    keyMetric: string;
  }[];
  governanceRules: string[];
  optionsComparison: {
    optionALabel: string;
    optionBLabel: string;
    optionCLabel?: string;
    options: ArchitectureOption[];
    axes: TradeOffAxis[];
  };
}

export interface ArchitecturePillar {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  accentColor: string;
  coreFocus: string[];
}

export const PILLARS: ArchitecturePillar[] = [
  {
    id: 'pillar-1',
    number: 1,
    title: 'Distributed Foundations, Resilience & Integration',
    shortTitle: 'Pillar 1: Distributed & Resilience',
    subtitle: 'Edge Caching, API Gateway, Cache-Aside, EDA, Idempotency, Saga, Outbox, Circuit Breaker, Bulkhead & Strangler Fig',
    accentColor: '#0ea5e9',
    coreFocus: [
      'Hybrid Rendering & CDN Bypass for real-time inventory',
      'Cache Stampede mitigation via Distributed Mutex Locks',
      'Idempotency (FE Generates UUID, BE Enforces Redlock)',
      'Choreography (<=3 steps) vs. Orchestration Saga (>4 steps) & Outbox',
      'Circuit Breaker (1ms Fail-Fast), Bulkhead (80/20 Pool) & Strangler Fig'
    ]
  },
  {
    id: 'pillar-2',
    number: 2,
    title: 'Enterprise Data Architecture',
    shortTitle: 'Pillar 2: Enterprise Data',
    subtitle: 'CQRS (>50:1 Read/Write), SAP CDC Extraction, Data Mesh vs. Lakehouse, MDM Golden Record & End-to-End Lineage',
    accentColor: '#10b981',
    coreFocus: [
      'CQRS separation of 3NF SQL Write DB & Denormalized Elasticsearch Read DB',
      'Real-time CDC from SAP ERP (ODP/SLT vs. Log-based) without license violation',
      'Data Mesh domain autonomy vs. centralized Lakehouse consistency',
      'MDM System of Record vs. Reference & column-level Data Lineage'
    ]
  },
  {
    id: 'pillar-3',
    number: 3,
    title: 'AI Architecture & Enterprise Integration',
    shortTitle: 'Pillar 3: Enterprise AI & FinOps',
    subtitle: 'Model Router (SLM vs. LLM), Semantic Caching, Multi-LLM Fallback, Hybrid RAG (BM25 + Vector + Reranker), Agentic MCP & Guardrails',
    accentColor: '#f59e0b',
    coreFocus: [
      'AI Gateway routing 70-80% traffic to SLMs (1/50th cost) & 20-30% to Frontier LLMs',
      'RBAC-Partitioned Semantic Caching (cosine > 0.92, <50ms) & Multi-LLM Fallback (429/5xx)',
      'Hybrid Search (BM25 + Vector + Reranker) curing Technical Code Blindness',
      'Chip Huyen Rule: "Finetuning is for Form, RAG is for Facts"',
      'Model Context Protocol (MCP) boundaries, Guardrails & RAGAS Evaluation'
    ]
  },
  {
    id: 'pillar-4',
    number: 4,
    title: 'Security, Compliance & Zero Trust',
    shortTitle: 'Pillar 4: Zero Trust & Security',
    subtitle: 'M365/Azure RBAC/ABAC Inheritance in RAG, Entra ID OBO Flow, Data Sovereignty & Immutable AI Audit Trails',
    accentColor: '#f43f5e',
    coreFocus: [
      'Index-time ACL Sync vs. Query-time Security Trimming for M365/SharePoint',
      'Entra ID On-Behalf-Of (OBO) propagation preventing over-privileged AI leaks',
      'Data Sovereignty boundaries, BYOK encryption & Purview Sensitivity Labels',
      'Tamper-proof AI Audit Trail reconstructing exact chunks, prompts & ACL state'
    ]
  },
  {
    id: 'pillar-5',
    number: 5,
    title: 'Architect Leadership & Delivery',
    shortTitle: 'Pillar 5: Delivery & Governance',
    subtitle: '7-Layer SA Decision Gatekeeper, Modular Monolith vs. Microservices FinOps, Data Egress Control, ADRs & CxO Boardroom Defense',
    accentColor: '#14b8a6',
    coreFocus: [
      '7-Question SA Decision Checklist across Edge, Data, Async, Resilience, Enterprise Data, AI & Zero Trust',
      'Right-Sizing Architecture: Modular Monolith (<30 devs) vs. Microservices & Cross-AZ/Cloud Egress Control',
      'Structured ADR authoring capturing Context, Trade-offs & Reversibility',
      '36-Month TCO & FinOps Sensitivity Analysis (CapEx, OpEx, Storage Tiering & Token costs)',
      'Defending architecture trade-offs against CFO, CISO, SRE & Business VPs'
    ]
  }
];

export const TOPICS: ArchitectureTopic[] = [
  // ================= PILLAR 1 =================
  {
    id: 'p1-edge-gateway',
    pillarId: 'pillar-1',
    code: 'P1.1',
    title: 'CDN Edge Caching vs. Dynamic API & Gateway Routing',
    subtitle: 'Separating static shells from real-time transactional state and avoiding the Fat Gateway trap',
    goldenRule: 'Cache Static Shells at the Edge (<50ms); ALWAYS Bypass CDN for real-time Inventory, Pricing & Cart state. Keep Business Logic out of the API Gateway.',
    businessContext: 'In high-volume Headless Commerce and Enterprise Portals, serving static assets from origin wastes bandwidth and degrades conversion rates. Conversely, caching dynamic inventory at the CDN Edge causes catastrophic Overselling during Flash Sales.',
    asciiFlow: `[ Mobile / Web Client ]
          │
          ├──► (Static Shell: HTML/JS/Images) ──► [ CDN Edge Cache (<50ms) ]
          │
          └──► (Dynamic State: Inventory/Cart) ──► [ NLB ] ──► [ HA API Gateway Cluster ]
                                                                       │
                                               ┌───────────────────────┼───────────────────────┐
                                               ▼                       ▼                       ▼
                                        [ /orders Svc ]        [ /catalog Svc ]        [ /users Svc ]`,
    antiPatterns: [
      {
        name: 'CDN Stale Inventory Caching (Overselling Trap)',
        symptom: 'Caching /api/inventory or product stock counts at the CDN Edge with a 60s TTL during a Flash Sale.',
        businessImpact: 'Thousands of customers see "In Stock" and complete payment after stock is exhausted, causing fulfillment failure, chargebacks, and brand damage.',
        remediation: 'Use Hybrid Rendering: serve the Static App Shell via CDN, and fetch dynamic stock/pricing client-side via API Gateway with Cache-Control: no-store, private.'
      },
      {
        name: 'Fat Gateway Anti-Pattern',
        symptom: 'Embedding complex domain validation, multi-table aggregation, and heavy payload transformation inside the API Gateway.',
        businessImpact: 'Turns the API Gateway into a fragile Distributed Monolith bottleneck, exhausting CPU and requiring coordinated deployments across teams.',
        remediation: 'Restrict API Gateway to Layer-7 cross-cutting concerns (AuthN, Rate Limiting, SSL Termination, Routing, Service Discovery) and push domain composition to BFFs or Services.'
      },
      {
        name: 'Single Gateway Instance (SPOF)',
        symptom: 'Deploying a single API Gateway node without multi-AZ active-active clustering.',
        businessImpact: 'Total outage across all microservices when the gateway node restarts or saturates.',
        remediation: 'Deploy an Auto-Scaling High-Availability Gateway Cluster behind a multi-zone Network Load Balancer (NLB).'
      }
    ],
    boundaries: [
      {
        zone: 'CDN Edge Layer',
        responsibility: 'Static HTML shells, JS/CSS bundles, public media, DDoS volumetric absorption.',
        mustNeverCross: 'User-specific PII, real-time inventory counts, flash-sale pricing, or mutable shopping cart state.'
      },
      {
        zone: 'API Gateway Layer',
        responsibility: 'Single consolidated endpoint, OAuth/JWT verification, rate limiting, canary routing, service discovery.',
        mustNeverCross: 'Domain business rules, database queries, or synchronous multi-minute batch orchestration.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Gateway CPU Saturation from Heavy Payload Transformation',
        blastRadius: '100% of ingress API traffic experiences P99 latency > 3,000ms.',
        mitigationMechanism: 'Offload transformation to downstream BFFs; enforce strict payload size limits and stateless JWT validation at the edge.',
        keyMetric: 'Gateway CPU Utilization (<65%) & Added Proxy Latency (<5ms)'
      }
    ],
    governanceRules: [
      'Every API exposed through the Gateway MUST declare explicit Cache-Control headers reviewed in OpenAPI specs.',
      'Zero custom business logic scripts permitted inside the Gateway configuration repository.',
      'Mandatory per-tenant Rate Limiting and Quota enforcement on all public endpoints.'
    ],
    optionsComparison: {
      optionALabel: 'Hybrid Edge + Lean HA Gateway',
      optionBLabel: 'Full CDN Caching (Aggressive)',
      optionCLabel: 'Fat Enterprise ESB / Gateway',
      options: [
        {
          id: 'hybrid-lean',
          name: 'Hybrid Rendering + Lean HA API Gateway',
          tagline: 'Static shell on CDN + bypassed dynamic APIs routed through a stateless L7 Gateway cluster.',
          pros: ['Sub-50ms initial paint with 100% real-time stock accuracy', 'Zero business logic coupling in gateway', 'Horizontal scalability across AZs'],
          cons: ['Requires client-side hydration state management', 'Slightly higher origin RPS for dynamic endpoints'],
          whenToUse: 'Default enterprise standard for E-Commerce, Banking, and SaaS portals.',
          costProfile: 'Medium',
          opsComplexity: 'Low'
        },
        {
          id: 'full-cdn',
          name: 'Aggressive Full-Page CDN Caching',
          tagline: 'Cache both HTML and API responses at Edge POPs with short TTLs (15-60s).',
          pros: ['Lowest origin server cost', 'Extreme throughput for read-only media/news sites'],
          cons: ['Guaranteed overselling on high-velocity inventory', 'Impossible to personalize per-user RBAC state safely'],
          whenToUse: 'Public content portals, documentation, or static marketing catalogs only.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        },
        {
          id: 'fat-gateway',
          name: 'Fat Gateway / Monolithic ESB Aggregation',
          tagline: 'Centralize orchestration, data mapping, and business rules inside the gateway tier.',
          pros: ['Clients make a single composite call without BFFs'],
          cons: ['Severe CPU bottleneck', 'Cross-team deployment lockstep', 'High blast radius on config change'],
          whenToUse: 'Avoid in modern cloud-native architectures; legacy brownfield transitional wrapper only.',
          costProfile: 'High',
          opsComplexity: 'High'
        }
      ],
      axes: [
        { metric: 'Data Freshness', optionA: 98, optionB: 35, optionC: 85 },
        { metric: 'Edge Performance', optionA: 92, optionB: 99, optionC: 45 },
        { metric: 'Team Autonomy', optionA: 95, optionB: 80, optionC: 25 },
        { metric: 'Fault Isolation', optionA: 90, optionB: 85, optionC: 30 },
        { metric: 'Cost Efficiency', optionA: 85, optionB: 95, optionC: 40 }
      ]
    }
  },
  {
    id: 'p1-cache-stampede',
    pillarId: 'pillar-1',
    code: 'P1.2',
    title: 'Cache-Aside Pattern & Cache Stampede Prevention',
    subtitle: 'In-memory Redis acceleration and protecting the primary database from Thundering Herd collapse',
    goldenRule: 'Never allow thousands of concurrent Cache Misses to hit the Disk DB simultaneously. Enforce Distributed Mutex Locking or Probabilistic Early Expiration.',
    businessContext: 'Disk databases bottleneck on random I/O under high read concurrency. Cache-Aside with Redis delivers sub-millisecond reads, but when a celebrity or Flash Sale hot key expires, 100,000 concurrent requests can experience a Cache Miss in the same millisecond—crushing the primary database.',
    asciiFlow: `[ Client Request ] ──► [ App Service ] ──(1. Check Key)──► [ Redis In-Memory Cache ]
                              │                                    │
                              │ (2. Cache Miss!)                   │ (Cache Hit < 1ms)
                              ▼                                    ▼
                    [ Acquire Redis Mutex Lock ]          [ Return Cached Data ]
                       ├──► (Lock Acquired: 1 Thread) ──► Query Primary DB ──► Populate Redis (TTL)
                       └──► (Lock Busy: 9,999 Threads) ──► Wait 20ms / Serve Stale Fallback`,
    antiPatterns: [
      {
        name: 'Unprotected Hot-Key Expiration (Cache Stampede / Dog-Piling)',
        symptom: 'A popular catalog key expires at 12:00:00, and 50,000 worker threads simultaneously execute a complex SQL JOIN to recompute it.',
        businessImpact: 'Primary SQL database hits 100% CPU and connection pool exhaustion, causing a cascading outage across all write and read operations.',
        remediation: 'Implement a Distributed Mutex Lock (single-flight pattern) so only 1 request queries the DB and repopulates Redis while others wait briefly or read slightly stale data.'
      },
      {
        name: 'Synchronized Mass TTL Expiry',
        symptom: 'Pre-warming 100,000 keys at midnight with an identical TTL of 3600 seconds.',
        businessImpact: 'Every hour on the hour, all keys expire simultaneously, triggering periodic latency spikes.',
        remediation: 'Add random TTL jitter (e.g., TTL = 3600s + random(0, 300s)) to spread expirations smoothly.'
      }
    ],
    boundaries: [
      {
        zone: 'Ephemeral Cache Layer (Redis)',
        responsibility: 'High-frequency read acceleration, distributed locks, rate-limit counters.',
        mustNeverCross: 'Treating Redis as the sole System of Record without durable DB persistence.'
      },
      {
        zone: 'Primary Transactional DB',
        responsibility: 'ACID state durability and source-of-truth computation on single-flight cache rebuilds.',
        mustNeverCross: 'Absorbing unthrottled public read spikes directly.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Redis Cluster Node Failover / Cold Cache Reboot',
        blastRadius: 'Sudden drop in Cache Hit Ratio from 99% to 0% floods the relational DB.',
        mitigationMechanism: 'Cache pre-warming scripts + DB Read Circuit Breaker + Mutex single-flight coalescing.',
        keyMetric: 'Cache Hit Ratio (>95%) & Primary DB Active Connections'
      }
    ],
    governanceRules: [
      'All hot-path Cache-Aside implementations MUST use single-flight / Mutex Locking + TTL jitter.',
      'Explicit memory eviction policy (allkeys-lru or volatile-lfu) and maxmemory limits must be configured per Redis cluster.'
    ],
    optionsComparison: {
      optionALabel: 'Cache-Aside + Mutex Lock + Jitter',
      optionBLabel: 'Naive Cache-Aside (No Lock)',
      optionCLabel: 'Write-Through Synchronous Cache',
      options: [
        {
          id: 'mutex-cache-aside',
          name: 'Cache-Aside with Distributed Mutex & Stale-While-Revalidate',
          tagline: 'Single thread rebuilds expired hot keys while concurrent requests coalesce or read stale.',
          pros: ['Sub-1ms read latency', 'Complete immunity to Cache Stampede', 'Resilient to read spikes'],
          cons: ['Requires lock timeout handling to avoid deadlocks if worker crashes'],
          whenToUse: 'High-concurrency enterprise read paths, catalog pages, and user profile lookups.',
          costProfile: 'Low',
          opsComplexity: 'Medium'
        },
        {
          id: 'naive-cache-aside',
          name: 'Naive Cache-Aside',
          tagline: 'Every cache miss directly queries the database and writes back to Redis.',
          pros: ['Simplest 10-line implementation'],
          cons: ['Catastrophic DB collapse under hot-key expiration during peak traffic'],
          whenToUse: 'Low-traffic internal tools with uniform key distribution.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        },
        {
          id: 'write-through',
          name: 'Synchronous Write-Through Caching',
          tagline: 'Every database write synchronously updates the cache in the same request.',
          pros: ['Cache is rarely stale'],
          cons: ['Increases write latency', 'Pollutes cache with cold data that may never be read again', 'Dual-write inconsistency risk'],
          whenToUse: 'Workloads where every written record is guaranteed to be read immediately and repeatedly.',
          costProfile: 'Medium',
          opsComplexity: 'High'
        }
      ],
      axes: [
        { metric: 'Stampede Protection', optionA: 98, optionB: 15, optionC: 85 },
        { metric: 'Read Latency', optionA: 96, optionB: 95, optionC: 96 },
        { metric: 'Write Throughput', optionA: 95, optionB: 95, optionC: 50 },
        { metric: 'Memory Efficiency', optionA: 90, optionB: 90, optionC: 45 },
        { metric: 'Operational Safety', optionA: 94, optionB: 30, optionC: 65 }
      ]
    }
  },
  {
    id: 'p1-eda-idempotency-saga',
    pillarId: 'pillar-1',
    code: 'P1.3',
    title: 'Event-Driven Architecture, Idempotency, Saga & Outbox',
    subtitle: 'Backpressure buffering, duplicate payment prevention, and distributed transactions without 2PC',
    goldenRule: 'Idempotency: "Front-End MUST Generate (UUID), Back-End MUST Enforce (Redlock/Unique Constraint)". Saga: Use Choreography for <=3 steps, Orchestration for >4 steps.',
    businessContext: 'During a 100x Flash Sale or unstable 4G mobile connectivity, synchronous REST chains collapse and client retries cause double-charging. Distributed business workflows across Order, Payment, Inventory, and Delivery require atomic reliability without blocking Two-Phase Commits (2PC).',
    asciiFlow: `[ Client (Generates Idempotency-Key UUID) ]
          │
          ▼
[ Order API ] ──► Check Redis Redlock (Idempotency)
          │
          ▼ (Single Local DB Tx)
[ Write Order Table + Outbox Table ] ──(CDC / Debezium)──► [ Kafka Backpressure Buffer ]
                                                                     │
                                                                     ▼
                                                      [ Saga Orchestrator State Machine ]
                                                       ├─► 1. Reserve Inventory
                                                       ├─► 2. Charge Payment
                                                       └─► (If Fail) ──► LIFO Compensating Tx`,
    antiPatterns: [
      {
        name: 'Backend-Generated Idempotency Key (Double Charge Bug)',
        symptom: 'Generating the transaction UUID inside the backend controller after receiving the POST request.',
        businessImpact: 'When a mobile client times out on 3G/4G and retries the POST, the backend sees a brand new request and charges the customer twice.',
        remediation: 'Front-End MUST generate the Idempotency-Key (UUID) when rendering the checkout screen and send it in the header; Back-End MUST enforce uniqueness via Redis Redlock + DB Unique Constraint.'
      },
      {
        name: 'Dual-Write Without Transactional Outbox',
        symptom: 'Saving an Order to PostgreSQL and directly calling kafkaProducer.send() in application code.',
        businessImpact: 'If the process crashes or network blips after DB commit but before Kafka ack, the Order exists in DB but downstream services never know—ghost orders.',
        remediation: 'Write both the domain entity and the event payload into the same relational database transaction (Outbox table) and stream to Kafka via CDC (Debezium).'
      },
      {
        name: 'Choreography "Event Spaghetti" (>4 Steps)',
        symptom: 'Chaining 6+ microservices via peer-to-peer pub/sub events without a central coordinator.',
        businessImpact: 'Cyclic dependencies, impossible end-to-end debugging, and uncoordinated rollback chaos when step 5 fails.',
        remediation: 'Switch to an Orchestration Saga (State Machine) whenever a workflow exceeds 3-4 steps or involves cross-domain compensating transactions.'
      }
    ],
    boundaries: [
      {
        zone: 'Event Notification vs. Event-Carried State Transfer',
        responsibility: 'Event Notification sends minimal IDs (light payload, requires callback REST call -> risk of Chatty Network). Event-Carried State Transfer sends full delta/snapshot (consumers run autonomously without calling source).',
        mustNeverCross: 'Using Event Notification for high-fanout consumers that all hammer the source DB simultaneously on every event.'
      },
      {
        zone: 'Local ACID Boundary vs. Saga Boundary',
        responsibility: 'Strict ACID inside a single microservice DB + Outbox; eventual consistency across services via LIFO Compensating Transactions.',
        mustNeverCross: 'Distributed XA / Two-Phase Commit (2PC) locks across independent microservices.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Compensating Transaction Failure in Saga Rollback',
        blastRadius: 'Order fails at Delivery step, but Payment refund fails due to gateway timeout—leaving inconsistent financial state.',
        mitigationMechanism: 'Infinite idempotent retry with exponential backoff on compensating steps + Dead-Letter Queue (DLQ) alert for manual operations reconciliation.',
        keyMetric: 'Outbox Relay Lag (<500ms) & Saga DLQ Unresolved Count (Target: 0)'
      }
    ],
    governanceRules: [
      'Every state-mutating POST/PUT/PATCH endpoint MUST require an X-Idempotency-Key header enforced at the backend.',
      'Workflows spanning >4 microservices MUST use an explicit Saga Orchestrator state machine rather than ad-hoc choreography.',
      'All domain events published to Kafka MUST pass through a Transactional Outbox and validate against the Schema Registry.'
    ],
    optionsComparison: {
      optionALabel: 'Orchestration Saga + Outbox + Redlock',
      optionBLabel: 'Choreography Saga (Peer-to-Peer)',
      optionCLabel: 'Synchronous REST / Distributed 2PC',
      options: [
        {
          id: 'orchestration-outbox',
          name: 'Orchestration Saga + Transactional Outbox + FE/BE Idempotency',
          tagline: 'Centralized state machine coordinates >4 step workflows with LIFO compensation and atomic Outbox publishing.',
          pros: ['Single source of truth for workflow state & timeouts', 'Zero dual-write data loss', 'Immune to duplicate client retries'],
          cons: ['Requires operating Debezium/Outbox relay and orchestrator state store'],
          whenToUse: 'Complex multi-step enterprise workflows (Order-to-Cash, Payment Settlement, Loan Origination).',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        },
        {
          id: 'choreography-saga',
          name: 'Choreography Saga (Event Peer-to-Peer)',
          tagline: 'Services subscribe and react to each other’s events without a central coordinator.',
          pros: ['High decoupling for simple 2-3 step flows', 'No central orchestrator component'],
          cons: ['Degrades into unmaintainable "Event Spaghetti" beyond 4 steps', 'Hard to track global timeout or compensation state'],
          whenToUse: 'Simple 2-3 step decoupled notifications (e.g., User Registered -> Send Welcome Email -> Grant Trial Badge).',
          costProfile: 'Low',
          opsComplexity: 'Medium'
        },
        {
          id: 'sync-2pc',
          name: 'Synchronous Chained REST / 2PC',
          tagline: 'Blocking HTTP calls or distributed DB locks across all participating services.',
          pros: ['Immediate synchronous response to caller'],
          cons: ['Availability multiplies downward (4 services at 99% = 96% uptime)', 'Collapses during 100x Flash Sale spikes'],
          whenToUse: 'Never for multi-service high-throughput mutations.',
          costProfile: 'High',
          opsComplexity: 'High'
        }
      ],
      axes: [
        { metric: 'Observability (>4 steps)', optionA: 96, optionB: 30, optionC: 70 },
        { metric: 'Spike Absorption (100x)', optionA: 95, optionB: 92, optionC: 15 },
        { metric: 'Data Consistency', optionA: 96, optionB: 75, optionC: 85 },
        { metric: 'Rollback Reliability', optionA: 94, optionB: 40, optionC: 50 },
        { metric: 'Simplicity (2-3 steps)', optionA: 65, optionB: 95, optionC: 75 }
      ]
    }
  },
  {
    id: 'p1-resilience-modernization',
    pillarId: 'pillar-1',
    code: 'P1.4',
    title: 'Resilience & Modernization: Strangler Fig, Circuit Breaker & Bulkhead',
    subtitle: 'Preventing cascading failures, isolating resource starvation, and de-risking legacy migration',
    goldenRule: 'Never do Big Bang Migrations (>80% failure rate)—use Strangler Fig (90/10 -> 100%). Isolate heavy workloads with Bulkheads (80/20) and Fail-Fast in 1ms with Circuit Breakers.',
    businessContext: 'Enterprise landscapes combine legacy monoliths, flaky third-party insurance/payment APIs, and heavy internal batch reporting. Without fault-isolation boundaries, 100 accountants exporting 5-year PDF reports will starve the thread pool and block all customer sales.',
    asciiFlow: `[ Strangler Fig Façade Proxy ] ──► 90% Legacy Monolith / 10% New Microservice
          │
          ├──► [ Bulkhead Pool A: 80% Threads ] ──► Sales & Checkout (0.05s SLA)
          │         └──► [ Circuit Breaker ] ──(OPEN: Fail-Fast 1ms)──► Graceful Fallback
          │
          └──► [ Bulkhead Pool B: 20% Threads ] ──► 5-Year Financial PDF Export (Heavy)`,
    antiPatterns: [
      {
        name: 'Big Bang Legacy Rewrite',
        symptom: 'Freezing feature development for 24 months to rewrite a legacy ERP/Mainframe from scratch.',
        businessImpact: 'Over 80% industry failure rate, double maintenance cost (Double Effort), and broken undocumented business rules on launch day.',
        remediation: 'Place a Façade Proxy / API Gateway in front of the monolith (Strangler Fig Pattern) and migrate one bounded context at a time (10% -> 50% -> 100% traffic).'
      },
      {
        name: 'Shared Thread Pool Starvation (Missing Bulkhead)',
        symptom: 'Running 5-year PDF financial report generation on the same worker pool as real-time order checkout.',
        businessImpact: 'When 100 accountants click "Export PDF" at month-end, 100% of threads block on I/O, causing 0.05s checkout requests to time out.',
        remediation: 'Apply the Bulkhead Pattern: isolate 80% of threads/pods exclusively for Sales and cap PDF Reporting at 20%.'
      },
      {
        name: 'Unbounded 30s Downstream Timeouts (Missing Circuit Breaker)',
        symptom: 'Waiting 30 seconds on every request when an external Insurance or Payment API hangs.',
        businessImpact: 'Ties up all caller threads within seconds, triggering a Cascading Failure across the entire enterprise platform.',
        remediation: 'Configure a 3-State Circuit Breaker (CLOSED -> OPEN Fail-Fast in 1ms -> HALF-OPEN 5% probe) paired with Graceful Degradation.'
      }
    ],
    boundaries: [
      {
        zone: 'Bulkhead Partition Boundary',
        responsibility: 'Dedicated thread pools, connection pools, and Kubernetes pod quotas per criticality tier (Tier-1 Checkout vs. Tier-3 Reporting).',
        mustNeverCross: 'Sharing a single database connection pool or worker pool between real-time customer traffic and heavy analytical exports.'
      },
      {
        zone: 'Strangler Façade Boundary',
        responsibility: 'Routing rules and anti-corruption translation between legacy schemas and modern microservices.',
        mustNeverCross: 'Allowing clients to hardcode direct links to both legacy and modern endpoints simultaneously.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Third-Party Payment/Insurance Partner Latency Spike (30s hang)',
        blastRadius: 'Contained to partner feature only; Circuit Breaker trips to OPEN and returns cached estimate or queued confirmation in 1ms.',
        mitigationMechanism: '3-State Circuit Breaker + Graceful Degradation fallback.',
        keyMetric: 'Circuit Breaker State Transitions & Thread Pool Saturation %'
      }
    ],
    governanceRules: [
      'All external third-party API integrations MUST be wrapped in a Circuit Breaker with a defined Graceful Degradation fallback.',
      'Heavy reporting, export, and batch endpoints MUST run in isolated Bulkhead thread/pod pools.',
      'Legacy modernization initiatives >$500k MUST use phased Strangler Fig routing with automated rollback.'
    ],
    optionsComparison: {
      optionALabel: 'Strangler Fig + Bulkhead + Circuit Breaker',
      optionBLabel: 'Shared Pool + Retry Only (No Breaker)',
      optionCLabel: 'Big Bang Rewrite',
      options: [
        {
          id: 'resilient-strangler',
          name: 'Strangler Fig + 80/20 Bulkhead + 3-State Circuit Breaker',
          tagline: 'Incremental traffic shifting with strict resource compartmentalization and 1ms fail-fast protection.',
          pros: ['Zero cascading outages during partner downtime', 'Sales unaffected by heavy reporting', 'Continuous business value during migration'],
          cons: ['Requires maintaining temporary Façade routing and anti-corruption adapters'],
          whenToUse: 'All mission-critical enterprise systems and modernization programs.',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        },
        {
          id: 'shared-pool-retry',
          name: 'Shared Thread Pool with Naive Retries',
          tagline: 'All endpoints share resources and retry 3 times on downstream timeout.',
          pros: ['Zero upfront configuration'],
          cons: ['Retry storms amplify outages', 'Report exports freeze customer checkout'],
          whenToUse: 'Never in multi-tenant or customer-facing production.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        },
        {
          id: 'big-bang',
          name: '2-Year Big Bang Monolith Replacement',
          tagline: 'Build a complete replacement system in parallel and cut over all traffic on a single weekend.',
          pros: ['No transitional adapter code'],
          cons: ['>80% failure rate', 'Massive business disruption risk on cutover', '2 years with zero ROI'],
          whenToUse: 'Avoid whenever incremental Strangler Fig routing is technically feasible.',
          costProfile: 'High',
          opsComplexity: 'High'
        }
      ],
      axes: [
        { metric: 'Cascading Fault Immunity', optionA: 98, optionB: 15, optionC: 50 },
        { metric: 'Migration Success Rate', optionA: 94, optionB: 60, optionC: 20 },
        { metric: 'Checkout SLA Protection', optionA: 97, optionB: 20, optionC: 65 },
        { metric: 'Time to First ROI', optionA: 92, optionB: 80, optionC: 15 },
        { metric: 'Operational Predictability', optionA: 95, optionB: 25, optionC: 30 }
      ]
    }
  },

  // ================= PILLAR 2 =================
  {
    id: 'p2-cqrs-sap-cdc',
    pillarId: 'pillar-2',
    code: 'P2.1',
    title: 'CQRS (>50:1 Skew) & Real-Time CDC from SAP ERP',
    subtitle: 'Decoupling ACID write transactions from high-speed analytical reads and extracting SAP data safely',
    goldenRule: 'When Read/Write ratio exceeds 50:1, separate 3NF SQL Command DB from Denormalized Elasticsearch/NoSQL Query DB via Async CDC. Never query SAP BSEG/BKPF directly from customer apps.',
    businessContext: 'In digital banking and enterprise ERP integrations, financial writes require strict 3NF ACID guarantees, while users also demand sub-0.5s search across 5 years of transaction history and real-time SAP inventory/order visibility.',
    asciiFlow: `[ SAP ERP (HANA / ECC) ] ──(ODP / SLT / CDC Stream)──┐
                                                     ▼
[ Client Write ] ──► [ Command Model (3NF SQL ACID) ] ──(Async CDC)──► [ Query Model (Elasticsearch Denormalized) ]
                                                                                      │
[ Client Read (>50:1 Ratio) ] ──────────────────────(< 0.5s Search)───────────────────┘`,
    antiPatterns: [
      {
        name: 'Single DB for Heavy 3NF Writes + 5-Year Historical Search',
        symptom: 'Adding 15 secondary indexes to a transactional PostgreSQL/SAP HANA table to support full-text search and multi-year filtering.',
        businessImpact: 'Write throughput collapses due to index maintenance overhead, and complex read queries lock rows needed for payment processing.',
        remediation: 'Apply CQRS when Read/Write skew exceeds 50:1: keep Command DB normalized (3NF) for fast ACID writes and sync asynchronously via CDC to Elasticsearch for <0.5s reads.'
      },
      {
        name: 'Direct Database Table Polling on SAP HANA (License & Lock Violation)',
        symptom: 'Connecting external microservices directly to SAP underlying tables (BSEG, BKPF, MARA) via raw JDBC triggers or heavy polling.',
        businessImpact: 'Violates SAP indirect access / runtime database licensing, causes HANA lock contention, and breaks immediately when SAP Support Packs alter internal structures.',
        remediation: 'Extract via sanctioned SAP ODP (Operational Data Provisioning), SAP SLT, or CDC connectors into an external Canonical Data Model.'
      }
    ],
    boundaries: [
      {
        zone: 'Command DB & SAP Core (System of Record)',
        responsibility: 'Strict ACID financial integrity, 3NF schema, SAP business posting validation via BAPIs/OData.',
        mustNeverCross: 'Serving high-concurrency public search, dashboard aggregations, or AI vector similarity queries directly.'
      },
      {
        zone: 'Query DB / Read Store (System of Reference)',
        responsibility: 'Denormalized document projections in Elasticsearch/MongoDB/Lakehouse optimized for <500ms query latency.',
        mustNeverCross: 'Accepting direct financial mutations without going through the Command Model.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'CDC Replication Lag Spike (Eventual Consistency Window)',
        blastRadius: 'Customer completes a wire transfer, immediately opens Transaction History, and does not see the new transfer for 3 seconds.',
        mitigationMechanism: 'Read-your-own-writes session caching (merge local pending command state in UI) + CDC lag alerting.',
        keyMetric: 'CDC End-to-End Replication Lag (<1,000ms) & SAP Source CPU Overhead (<5%)'
      }
    ],
    governanceRules: [
      'Any workload with Read/Write ratio > 50:1 and complex filtering MUST evaluate CQRS separation.',
      'Direct JDBC/ODBC reads against SAP ERP underlying tables by non-SAP applications are strictly prohibited without ARB & SAP License review.',
      'All SAP CDC pipelines MUST map cryptically named SAP fields (e.g., MANDT, BUKRS, KUNNR) into a documented business Canonical Data Model.'
    ],
    optionsComparison: {
      optionALabel: 'CQRS + Sanctioned SAP ODP/CDC',
      optionBLabel: 'Single Monolithic SQL DB (Heavy Indexes)',
      optionCLabel: 'Direct SAP DB Trigger Scraping',
      options: [
        {
          id: 'cqrs-sap-odp',
          name: 'CQRS (SQL + Elasticsearch) with SAP ODP/SLT CDC',
          tagline: 'ACID writes on normalized SQL/SAP, async CDC projection to denormalized read stores.',
          pros: ['Sub-0.5s search across 5 years of history', '100% SAP license & upgrade compliant', 'Zero lock contention on write path'],
          cons: ['Eventual consistency window (ms to seconds)', 'Higher infrastructure footprint'],
          whenToUse: 'High-volume banking, e-commerce order history, and enterprise SAP digital twin platforms.',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        },
        {
          id: 'single-sql-indexed',
          name: 'Single Relational DB for Commands & Queries',
          tagline: 'Run both OLTP writes and historical search queries on the same database cluster.',
          pros: ['Strong read-after-write consistency', 'Single database technology to manage'],
          cons: ['Severe write amplification from indexes', 'Table locks during heavy reporting queries'],
          whenToUse: 'CRUD applications with Read/Write ratio < 20:1 and simple primary-key lookups.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        },
        {
          id: 'raw-sap-triggers',
          name: 'Direct SAP Database Trigger / Log Scraping',
          tagline: 'Bypass SAP application layer to scrape raw HANA/Oracle tables directly.',
          pros: ['Low initial latency without SAP Basis setup'],
          cons: ['Severe SAP license audit penalty risk', 'Breaks on SAP upgrades', 'Cryptic unjoined physical tables'],
          whenToUse: 'Avoid unless explicitly licensed with enterprise-wide full-use SAP HANA licenses and Basis sign-off.',
          costProfile: 'High',
          opsComplexity: 'High'
        }
      ],
      axes: [
        { metric: 'Read Scalability (>50:1)', optionA: 98, optionB: 35, optionC: 80 },
        { metric: 'Write ACID Integrity', optionA: 96, optionB: 60, optionC: 50 },
        { metric: 'SAP License Compliance', optionA: 98, optionB: 90, optionC: 15 },
        { metric: 'Schema Upgrade Safety', optionA: 92, optionB: 85, optionC: 20 },
        { metric: 'Immediate Read Consistency', optionA: 75, optionB: 99, optionC: 70 }
      ]
    }
  },
  {
    id: 'p2-mesh-lakehouse-mdm',
    pillarId: 'pillar-2',
    code: 'P2.2',
    title: 'Data Mesh vs. Lakehouse, MDM & End-to-End Lineage',
    subtitle: 'Balancing domain autonomy with enterprise consistency, Golden Records, and impact traceability',
    goldenRule: 'Do not adopt Data Mesh unless domains have engineering maturity and Federated Automated Governance. Always establish MDM Golden Records and End-to-End Lineage before feeding AI.',
    businessContext: 'Enterprises struggle between a central Data Lakehouse team that becomes a 6-month ticket bottleneck and an ungoverned Data Mesh that devolves into isolated data silos with conflicting definitions of "Customer" and "Net Revenue".',
    asciiFlow: `[ Sources: SAP ERP | Salesforce CRM | M365 ]
                      │
                      ▼
       [ MDM Hub (Golden Record Match/Merge) ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ Domain Data Product A ]   [ Domain Data Product B ]   (Shared Delta/Iceberg Lakehouse Storage)
        └─────────────┬─────────────┘
                      ▼
     [ Automated Data Contract & Lineage Graph ] ──► [ CFO BI & Enterprise RAG ]`,
    antiPatterns: [
      {
        name: 'Premature Data Mesh Without Federated Governance (Anarchy Mesh)',
        symptom: 'Declaring "Data Mesh" and telling 10 business domains to build their own data pipelines without a shared platform or automated Data Contracts.',
        businessImpact: 'Duplicated infrastructure cost, 10 incompatible definitions of Customer ID, and zero cross-domain joinability.',
        remediation: 'Build a unified Lakehouse storage foundation (Delta/Iceberg) first, enforce automated Data Contracts, and federate domain ownership progressively.'
      },
      {
        name: 'Feeding AI/BI Without MDM Golden Record',
        symptom: 'Ingesting customer records directly from SAP, CRM, and Marketing into RAG/Analytics without Master Data Management survivorship rules.',
        businessImpact: 'AI Assistant gives contradictory credit limits and contract statuses for the same enterprise client spelled slightly differently across systems.',
        remediation: 'Establish an MDM Consolidation/Coexistence hub that resolves entities into a single Golden Record with clear System of Record (SoR) lineage.'
      }
    ],
    boundaries: [
      {
        zone: 'Domain Data Product Boundary',
        responsibility: 'Domain team owns schema quality, SLA, and business semantics of published data products.',
        mustNeverCross: 'Exposing internal operational database tables directly as external domain interfaces (violates encapsulation).'
      },
      {
        zone: 'Central Self-Serve Platform & MDM Boundary',
        responsibility: 'Storage engine (Iceberg/Delta), RBAC enforcement, MDM entity resolution, and automated column-level Lineage.',
        mustNeverCross: 'Central platform engineers writing domain-specific transformation SQL for every business unit.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Upstream SAP/CRM Schema Breaking Change',
        blastRadius: 'Downstream CFO Revenue Dashboard and Supply Chain AI Agent silently compute wrong margins.',
        mitigationMechanism: 'CI/CD Data Contract validation + Column-Level Data Lineage impact analysis that blocks breaking schema deploys.',
        keyMetric: 'Data Contract SLA Compliance (%) & Lineage Coverage (100% of Tier-1 Assets)'
      }
    ],
    governanceRules: [
      'Every Tier-1 Data Product MUST publish a machine-readable Data Contract (Schema, Freshness SLA, Null thresholds, Owner).',
      'Customer, Vendor, and Material entities MUST resolve to an MDM Golden Record ID before entering Gold Lakehouse tables or AI Indexes.',
      'End-to-End Column-Level Lineage is mandatory from source ERP table to BI metric and AI prompt context.'
    ],
    optionsComparison: {
      optionALabel: 'Hybrid Lakehouse + Federated Mesh + MDM',
      optionBLabel: 'Pure Decentralized Data Mesh',
      optionCLabel: 'Monolithic Central Data Warehouse Team',
      options: [
        {
          id: 'hybrid-lakehouse-mesh',
          name: 'Unified Lakehouse Storage + Federated Domain Data Products + MDM',
          tagline: 'Shared Delta/Iceberg platform and MDM hub with domain-owned data products governed by automated contracts.',
          pros: ['High domain delivery velocity', 'Single storage engine & zero data copying', 'Consistent MDM Golden Records across enterprise'],
          cons: ['Requires upfront investment in self-serve data platform & contract automation'],
          whenToUse: 'Mid-to-large enterprises scaling analytics and AI across multiple business units.',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        },
        {
          id: 'pure-mesh',
          name: 'Pure Decentralized Data Mesh',
          tagline: 'Every domain provisions and manages its own independent data stack and pipelines.',
          pros: ['Maximum domain autonomy for highly mature tech organizations'],
          cons: ['Severe risk of data silos, duplicated infra spend, and inconsistent governance'],
          whenToUse: 'Only very large tech-native enterprises with dedicated data engineers embedded in every domain.',
          costProfile: 'High',
          opsComplexity: 'High'
        },
        {
          id: 'central-dwh',
          name: 'Centralized Monolithic Data Team',
          tagline: 'One central IT data team ingests, models, and builds all reports for all departments.',
          pros: ['Tight centralized schema control', 'Low tooling sprawl'],
          cons: ['Severe organizational bottleneck (months of backlog)', 'Central team lacks deep domain context'],
          whenToUse: 'Smaller organizations with <3 business domains and stable reporting needs.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        }
      ],
      axes: [
        { metric: 'Domain Delivery Speed', optionA: 92, optionB: 96, optionC: 30 },
        { metric: 'Cross-Domain Consistency', optionA: 95, optionB: 40, optionC: 90 },
        { metric: 'Cost Efficiency', optionA: 88, optionB: 35, optionC: 85 },
        { metric: 'Lineage & Auditability', optionA: 96, optionB: 50, optionC: 88 },
        { metric: 'Org Scalability', optionA: 94, optionB: 85, optionC: 25 }
      ]
    }
  },

  // ================= PILLAR 3 =================
  {
    id: 'p3-model-router-rag',
    pillarId: 'pillar-3',
    code: 'P3.1',
    title: 'Model Router, Hybrid RAG & RAG vs. Finetuning vs. Long Context',
    subtitle: 'Routing 70-80% traffic to SLMs, curing Technical Code Blindness with BM25+Vector+Reranker, and applying Chip Huyen’s Golden Rule',
    goldenRule: '1) Route 70-80% simple queries to SLMs (1/50th cost) & 20-30% to Frontier LLMs. 2) Cure Vector Technical Code Blindness with Hybrid Search (BM25 + Vector + Reranker). 3) "Finetuning is for Form, RAG is for Facts."',
    businessContext: 'Sending 100% of enterprise queries to Frontier LLMs (GPT-4o / Claude) or stuffing 1M-token context windows destroys ROI. Meanwhile, pure Vector Search fails miserably when engineers or support agents search exact error codes (EADDRNOTAVAIL), SKUs, or national IDs.',
    asciiFlow: `[ User Query ] ──► [ AI Gateway / Semantic Model Router ]
                         │
                         ├─► (75% Simple Lookup/Summary) ──► [ SLM: Phi-4 / Llama-3-8B ] (1/50th Cost)
                         │       └──► (If Confidence < Threshold) ──► Escalate to Frontier LLM
                         │
                         └─► (25% Complex Multi-step) ─────► [ Frontier LLM: GPT-4o / Claude ]
                                                                   ▲
[ Hybrid Retrieval Loop ]: Query ──► [ BM25 Keyword + Vector HNSW ] ──► [ Cross-Encoder Reranker (Top-5) ]`,
    antiPatterns: [
      {
        name: '100% Frontier LLM Monoculture (Token Bankruptcy)',
        symptom: 'Calling a flagship reasoning LLM for every simple greeting, FAQ lookup, and formatting task.',
        businessImpact: '50x higher inference TCO and 3-5s P95 latency, causing CFO rejection during production scaling.',
        remediation: 'Deploy an AI Gateway with an Intent Classifier / Semantic Router that sends 70-80% of traffic to an SLM (Phi-4 / Llama-3-8B) with Confidence-Score Escalation to the Frontier LLM.'
      },
      {
        name: 'Pure Vector Search (Technical Code Blindness)',
        symptom: 'Relying solely on dense vector embeddings (Cosine Similarity) to search enterprise manuals, part numbers, and error logs.',
        businessImpact: 'Vector search understands general semantics but fails to match exact strings like error code EADDRNOTAVAIL, invoice #INV-99412, or citizen IDs—returning hallucinated advice.',
        remediation: 'Mandate Hybrid Search: combine BM25 Keyword Search (exact match) + Dense Vector Search (HNSW) followed by a Cross-Encoder Reranker (e.g., Cohere Rerank) to select the Top-5 grounded chunks.'
      },
      {
        name: 'Finetuning LLMs to Memorize Changing Company Facts',
        symptom: 'Running expensive GPU LoRA/QLoRA training jobs every week to teach the model new product prices and policy updates.',
        businessImpact: 'Knowledge freezes inside model weights immediately, provides zero source citations, and risks hallucinating outdated policies.',
        remediation: 'Follow Chip Huyen’s Golden Rule: "Finetuning is for Form (tone, JSON schema, domain syntax); RAG is for Facts (real-time cited knowledge)."'
      }
    ],
    boundaries: [
      {
        zone: 'AI Gateway & Semantic Router Boundary',
        responsibility: 'Intent classification, PII scrubbing, Semantic Cache lookup, SLM vs. LLM routing, token quota enforcement.',
        mustNeverCross: 'Allowing individual microservices to hardcode direct external LLM vendor API keys without gateway governance.'
      },
      {
        zone: 'RAG vs. Finetuning vs. Long Context Decision Boundary',
        responsibility: 'RAG for dynamic facts with 100% citations; PEFT/LoRA for output form/style; Long Context only for single-session whole-document reasoning.',
        mustNeverCross: 'Stuffing 500k tokens into every prompt as a substitute for a properly indexed Hybrid RAG pipeline ("Lost in the Middle" + extreme per-query cost).'
      }
    ],
    day2Ops: [
      {
        failureMode: 'SLM Misclassification or Low-Confidence Generation',
        blastRadius: 'SLM gives shallow answer on a nuanced legal clause if escalation threshold is miscalibrated.',
        mitigationMechanism: 'Automated Confidence Score check + LLM-as-a-Judge shadow sampling + seamless fallback escalation to Frontier LLM.',
        keyMetric: 'SLM Offload Ratio (Target: 70-80%), Cost per 1k Queries & RAG Citation Faithfulness (>95%)'
      }
    ],
    governanceRules: [
      'All production AI apps MUST route through the Enterprise AI Gateway with per-department Token Quotas.',
      'Enterprise RAG pipelines MUST implement Hybrid Search (BM25 + Vector) + Reranking and enforce 100% source citations.',
      'Any proposal for GPU Finetuning MUST prove via ADR why Prompt Engineering + Hybrid RAG cannot achieve the required output form.'
    ],
    optionsComparison: {
      optionALabel: 'Model Router + Hybrid RAG (BM25+Vector+Rerank)',
      optionBLabel: 'PEFT / LoRA Finetuning Only',
      optionCLabel: '1M+ Long Context Window Stuffing',
      options: [
        {
          id: 'router-hybrid-rag',
          name: 'Model Router (75% SLM / 25% LLM) + Hybrid RAG + Reranker',
          tagline: 'Smart SLM/LLM routing combined with BM25 + Vector retrieval and Cross-Encoder Reranking.',
          pros: ['Reduces token TCO by up to 70%', '100% transparent citations & real-time data freshness', 'High precision on both exact error codes and semantic concepts'],
          cons: ['Requires maintaining Vector DB index and Reranker pipeline'],
          whenToUse: 'Default architecture for Enterprise Knowledge Assistants, Copilot integrations, and Support Triage.',
          costProfile: 'Low',
          opsComplexity: 'Medium'
        },
        {
          id: 'peft-finetuning',
          name: 'PEFT / LoRA Finetuning',
          tagline: 'Adapt model weights on curated instruction datasets to teach specialized format, tone, or DSL.',
          pros: ['Teaches strict output schemas, brand voice, or legacy code syntax', 'Shorter inference prompts'],
          cons: ['Zero citations (facts frozen in weights)', 'Must retrain whenever facts change', 'Upfront GPU training & evaluation overhead'],
          whenToUse: 'Teaching a small model to output specialized SQL/ABAP syntax or adhere to strict structured formatting (Form, not Facts).',
          costProfile: 'Medium',
          opsComplexity: 'High'
        },
        {
          id: 'long-context',
          name: '1M+ Token Long Context Stuffing',
          tagline: 'Dump entire manuals or repositories directly into the prompt on every user request.',
          pros: ['Zero vector indexing pipeline required for small ad-hoc corpora'],
          cons: ['Astronomical per-request inference cost', 'Severe latency (Time-to-First-Token)', 'Susceptible to "Lost in the Middle" attention degradation'],
          whenToUse: 'One-off deep analysis of a single uploaded contract or M&A due diligence bundle.',
          costProfile: 'High',
          opsComplexity: 'Low'
        }
      ],
      axes: [
        { metric: 'Fact Freshness & Citations', optionA: 98, optionB: 15, optionC: 80 },
        { metric: 'Exact Code/SKU Precision', optionA: 96, optionB: 30, optionC: 70 },
        { metric: 'Inference Cost Efficiency', optionA: 94, optionB: 80, optionC: 15 },
        { metric: 'Low P95 Latency', optionA: 90, optionB: 88, optionC: 20 },
        { metric: 'Custom Style/Form Control', optionA: 75, optionB: 98, optionC: 70 }
      ]
    }
  },
  {
    id: 'p3-agentic-mcp-guardrails',
    pillarId: 'pillar-3',
    code: 'P3.2',
    title: 'Agentic AI, Model Context Protocol (MCP), Guardrails & RAGAS Eval',
    subtitle: 'Standardizing enterprise tool execution, bounding autonomous loops, and quantifying LLM quality',
    goldenRule: 'Use Deterministic Workflows whenever steps are predictable; use Autonomous Agents only for dynamic reasoning. Standardize tool boundaries via MCP and require Human-in-the-Loop for write/delete actions.',
    businessContext: 'Enterprises moving beyond read-only chatbots want AI Agents that can query SAP inventory, draft purchase orders, and update CRM tickets. Without standardized MCP boundaries, strict Guardrails, and automated RAGAS evaluation, agents can enter infinite token-burning loops or execute unauthorized database mutations.',
    asciiFlow: `[ User Goal ] ──► [ Input Guardrails (Prompt Injection / PII Check) ]
                         │
                         ▼
             [ Agent Orchestrator (Max Step Budget = 5) ]
                         │
              (Model Context Protocol - MCP)
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
[ MCP: SAP Read ]  [ MCP: M365 Docs ]  [ MCP: ERP Write (Requires Human Approval) ]
                         │
                         ▼
         [ Output Guardrails & RAGAS Eval Pipeline ]`,
    antiPatterns: [
      {
        name: 'Unbounded Autonomous Agent Loops in Production',
        symptom: 'Giving an autonomous ReAct agent unrestricted tool access without a max-iteration budget or deterministic state machine.',
        businessImpact: 'When a downstream API returns an ambiguous error, the agent loops 40 times trying variations, burning $12 in tokens per request and timing out.',
        remediation: 'Cap agent execution at a strict step/token budget (e.g., max 5 tool turns) and wrap high-value flows in a deterministic LangGraph/Workflow state machine.'
      },
      {
        name: 'Direct Database Credentials Inside Agent Prompts/Tools',
        symptom: 'Writing ad-hoc Python functions with admin SQL credentials for each agent instead of governed MCP servers.',
        businessImpact: 'Prompt injection tricks the agent into running destructive queries or exfiltrating unauthorized rows.',
        remediation: 'Expose enterprise capabilities strictly through typed, scoped Model Context Protocol (MCP) servers with explicit read vs. write separation and Human-in-the-Loop approval gates.'
      }
    ],
    boundaries: [
      {
        zone: 'MCP Server Boundary',
        responsibility: 'Typed JSON-Schema tool contracts, parameter validation, scoped OBO identity enforcement, rate limiting.',
        mustNeverCross: 'Allowing raw arbitrary SQL execution or shell command generation from LLM outputs.'
      },
      {
        zone: 'Input/Output Guardrail & Eval Boundary',
        responsibility: 'Fast pre-check (Jailbreak, PII, Topic boundary) and post-check (Hallucination grounding, PII leak, RAGAS metrics).',
        mustNeverCross: 'Deploying prompt or model version updates to production without passing Golden Dataset RAGAS regression thresholds.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Prompt Drift / Model Upgrade Regression',
        blastRadius: 'Cloud provider updates minor model checkpoint, causing JSON tool-calling accuracy to drop from 98% to 79%.',
        mitigationMechanism: 'Automated CI/CD LLMOps evaluation pipeline scoring Faithfulness, Answer Relevance, and Context Precision on a 500-case Golden Dataset before traffic shift.',
        keyMetric: 'RAGAS Composite Score (>0.88), Guardrail Block Latency (<80ms) & Agent Loop Termination Rate'
      }
    ],
    governanceRules: [
      'Every enterprise tool exposed to AI Agents MUST be registered as a versioned MCP Server with least-privilege scopes.',
      'All state-mutating agent actions (Approve PO, Issue Refund, Delete Record) MUST enforce a synchronous Human-in-the-Loop confirmation token.',
      'Production releases require automated evaluation passing Faithfulness >= 0.90 and Context Precision >= 0.85.'
    ],
    optionsComparison: {
      optionALabel: 'Bounded Workflow Agent + MCP + Guardrails',
      optionBLabel: 'Fully Autonomous Open-Loop Agent',
      optionCLabel: 'Fixed Linear RAG Pipeline (No Tools)',
      options: [
        {
          id: 'bounded-mcp-agent',
          name: 'Bounded State-Graph Agent + Governed MCP Servers + Guardrails',
          tagline: 'Controlled multi-step reasoning with strict step budgets, typed MCP tool boundaries, and Human-in-the-Loop gates.',
          pros: ['Safe integration with SAP/CRM actions', 'Predictable latency and token ceiling', 'Reusable MCP servers across teams'],
          cons: ['Requires designing state transitions and Golden Evaluation datasets'],
          whenToUse: 'Enterprise Copilot workflows that combine multi-source retrieval with governed business actions.',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        },
        {
          id: 'open-loop-agent',
          name: 'Unconstrained Autonomous Agent',
          tagline: 'LLM freely decides how many loops and tools to call until it deems the task finished.',
          pros: ['Flexible for open-ended exploratory research'],
          cons: ['Unpredictable cost & latency', 'High risk of runaway loops and prompt-injected tool misuse'],
          whenToUse: 'Internal sandboxed R&D coding or research assistants only.',
          costProfile: 'High',
          opsComplexity: 'High'
        },
        {
          id: 'linear-rag',
          name: 'Fixed Single-Step RAG Pipeline',
          tagline: 'Retrieve once, generate once—no dynamic tool invocations or multi-step planning.',
          pros: ['Lowest latency and deterministic token cost', 'Simplest to audit'],
          cons: ['Cannot answer multi-hop questions across ERP + Docs or execute workflow actions'],
          whenToUse: 'Read-only policy Q&A and documentation search.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        }
      ],
      axes: [
        { metric: 'Operational Predictability', optionA: 92, optionB: 25, optionC: 98 },
        { metric: 'Multi-System Task Capability', optionA: 94, optionB: 95, optionC: 30 },
        { metric: 'Security & Blast Containment', optionA: 95, optionB: 20, optionC: 96 },
        { metric: 'Token Cost Control', optionA: 88, optionB: 20, optionC: 98 },
        { metric: 'Audit & Eval Readiness', optionA: 93, optionB: 30, optionC: 95 }
      ]
    }
  },
  {
    id: 'p3-ai-gateway-cache-fallback',
    pillarId: 'pillar-3',
    code: 'P3.3',
    title: 'AI Gateway: Semantic Caching, Multi-LLM Fallback & Token FinOps',
    subtitle: 'Cutting 30–40% LLM inference spend (<50ms latency) via RBAC-partitioned Semantic Caching and surviving 429/5xx outages via Multi-Provider Fallback',
    goldenRule: 'Never hit an LLM twice for the same semantic intent—use Semantic Caching (cosine > 0.92) partitioned by user RBAC scope, and always configure Multi-Provider Fallback to eliminate single-vendor outages.',
    businessContext: 'At 1.5M monthly enterprise queries, 35% of employee questions share identical intent phrased slightly differently (e.g., "How do I claim travel?" vs. "Travel expense policy?"). Calling Frontier LLMs repeatedly wastes $15k+/month and adds 2–4s latency, while relying on a single Azure OpenAI region exposes the business to 429 Rate Limit storms and vendor outages.',
    asciiFlow: `[ User Prompt + Entra ID Security Group Hash ]
                      │
                      ▼
        [ AI Gateway Semantic Cache (Redis / Vector) ]
         ├─► Cosine > 0.92 & SAME RBAC Hash ──► HIT (<50ms, $0 Token Cost!)
         └─► Cache MISS ──► [ Multi-LLM Circuit Breaker & Fallback Router ]
                              ├─► Primary: Azure OpenAI (429 / 5xx?)
                              ├─► Fallback 1: Anthropic Claude (Cross-Vendor)
                              └─► Fallback 2: Self-Hosted SLM (VLLM / Phi-4)`,
    antiPatterns: [
      {
        name: 'Cross-User Semantic Cache Leak (Global Cache Key)',
        symptom: 'Caching prompt embeddings globally without hashing the user’s RBAC/Security Group scope into the cache key.',
        businessImpact: 'CRITICAL SECURITY BREACH: A junior employee asks a similar question to the CFO and receives a cached answer containing confidential M&A or payroll figures.',
        remediation: 'Partition every Semantic Cache lookup by User Security Group Hash (namespace: `tenant:rbac_group_hash`) AND exclude prompts flagged with high-sensitivity Purview/PII labels.'
      },
      {
        name: 'Single-Vendor LLM Lock-in (No 429/5xx Fallback)',
        symptom: 'Application code hardcodes one Azure OpenAI endpoint; during peak hours or regional outages, users hit HTTP 429/503 errors.',
        businessImpact: 'Enterprise AI Copilot goes completely dark during month-end peaks, destroying user adoption and SLA.',
        remediation: 'Configure an AI Gateway with Circuit Breakers and automatic Multi-Provider Fallback (e.g., Azure OpenAI -> Anthropic Claude -> Self-Hosted SLM) plus normalized prompt/schema adapters.'
      }
    ],
    boundaries: [
      {
        zone: 'Semantic Cache Layer (Redis Vector)',
        responsibility: 'Embed incoming prompt, filter strictly by User RBAC Group Hash, and return cached response if cosine similarity > 0.92 in <50ms.',
        mustNeverCross: 'Must NEVER serve a cached response across different RBAC permission groups or cache real-time transactional queries (e.g., "my current leave balance").'
      },
      {
        zone: 'Multi-LLM Fallback Router',
        responsibility: 'Track per-provider TPM/RPM quotas, trip Circuit Breakers on HTTP 429/5xx, and fail over seamlessly across providers.',
        mustNeverCross: 'Must NEVER retry synchronously in an unbounded loop on 429; use exponential backoff with immediate cross-provider failover.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Primary LLM Provider hits HTTP 429 Quota Exhaustion or Regional 503 Outage',
        blastRadius: '100% of uncached AI requests fail or hang for 30+ seconds.',
        mitigationMechanism: 'AI Gateway trips provider Circuit Breaker in <5ms, shifts traffic to Secondary Provider (Anthropic Claude) or Self-Hosted SLM, and serves Semantic Cache hits (<50ms) unaffected.',
        keyMetric: 'Semantic Cache Hit Ratio (>=30%), Cache Hit Latency (<50ms P95), Multi-LLM Failover Time (<200ms)'
      }
    ],
    governanceRules: [
      'Enforce `User Security Group Hash` partitioning on 100% of Semantic Cache keys—never share a global vector cache across RBAC tiers.',
      'Set strict cosine similarity threshold (>= 0.92) and TTL invalidation tied to source document updates.',
      'Maintain tested fallback routes across at least 2 distinct LLM providers plus a self-hosted SLM tier.'
    ],
    optionsComparison: {
      optionALabel: 'RBAC Semantic Cache + Multi-LLM Gateway',
      optionBLabel: 'Direct Single-Vendor LLM API Calls',
      optionCLabel: 'Global Unpartitioned Exact-Match Cache',
      options: [
        {
          id: 'rbac-semantic-gateway',
          name: 'RBAC-Partitioned Semantic Cache + Multi-LLM Fallback',
          tagline: 'Redis Vector cache (cosine > 0.92) scoped by Security Group Hash + automated 429/5xx cross-vendor failover.',
          pros: [
            'Cuts LLM inference costs by 30–40% and drops repeat-intent latency to <50ms',
            'Zero Cross-User RBAC leakage via Security Group Hash partitioning',
            '99.95%+ AI availability during single-provider 429 or regional outages'
          ],
          cons: [
            'Requires embedding model latency (~10–15ms) on cache lookup',
            'Need cache invalidation webhooks when underlying policy documents change'
          ],
          whenToUse: 'Default production standard for all Enterprise AI Copilots above 100k queries/month.',
          costProfile: 'Low',
          opsComplexity: 'Medium'
        },
        {
          id: 'direct-single-llm',
          name: 'Direct Single-Vendor LLM Calls (No Cache, No Fallback)',
          tagline: 'Every user prompt calls a single cloud LLM endpoint directly.',
          pros: ['Zero gateway infrastructure to manage'],
          cons: [
            'Pays 100% token cost repeatedly for identical FAQ/policy intents',
            'Complete outage whenever vendor hits 429 Rate Limit or 5xx'
          ],
          whenToUse: 'Early internal POCs only.',
          costProfile: 'High',
          opsComplexity: 'Low'
        },
        {
          id: 'global-exact-cache',
          name: 'Global Unpartitioned Exact-Match Cache',
          tagline: 'Caches exact string matches globally in Redis without RBAC scope or semantic matching.',
          pros: ['Simple key-value lookup'],
          cons: [
            'Low hit rate (<5%) because phrasing varies slightly',
            'Severe Cross-User RBAC leak risk if confidential answers are cached globally'
          ],
          whenToUse: 'Strictly public, non-authenticated FAQ bots only.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        }
      ],
      axes: [
        { metric: 'Token Cost Reduction', optionA: 92, optionB: 10, optionC: 35 },
        { metric: 'Repeat Query Latency (<50ms)', optionA: 94, optionB: 15, optionC: 90 },
        { metric: 'Outage & 429 Resilience', optionA: 96, optionB: 20, optionC: 25 },
        { metric: 'RBAC Cache Isolation Safety', optionA: 97, optionB: 90, optionC: 15 },
        { metric: 'Operational Simplicity', optionA: 72, optionB: 96, optionC: 85 }
      ]
    }
  },

  // ================= PILLAR 4 =================
  {
    id: 'p4-m365-rbac-zero-trust',
    pillarId: 'pillar-4',
    code: 'P4.1',
    title: 'Inherited Permissions (M365/Azure RBAC/ABAC) & Zero-Trust RAG',
    subtitle: 'Preventing unauthorized data leakage in Enterprise RAG via Entra ID On-Behalf-Of (OBO) and Security Trimming',
    goldenRule: 'Never query a Vector Database using a global Service Principal without User ACL filtering. Enforce Entra ID On-Behalf-Of (OBO) + Hybrid Security Trimming.',
    businessContext: 'An enterprise indexes 2 million SharePoint/M365 documents into a Vector DB for its internal AI Copilot. If the RAG pipeline retrieves chunks using an app-level admin key without enforcing SharePoint’s complex inherited permissions, a junior intern can ask "What is the CEO’s M&A target and executive bonus?" and the AI will happily summarize confidential Board folders.',
    asciiFlow: `[ User (Entra ID JWT) ] ──► [ AI App Backend ]
                                    │
                       (Entra ID On-Behalf-Of Flow)
                                    ▼
             [ Hybrid ACL Security Trimming Engine ]
              ├─► 1. Pre-Filter Vector Search by User Group/Role ACL Tags (Index-Time Metadata)
              └─► 2. Post-Verify Top-K Document Access via MS Graph / Purview Sensitivity Labels
                                    │
                                    ▼
                        [ Grounded LLM Response ]`,
    antiPatterns: [
      {
        name: 'Over-Privileged Service Principal RAG (The #1 Enterprise AI Breach)',
        symptom: 'Indexing all SharePoint sites into one Vector Index and querying it with a static backend API key without user-context ACL filtering.',
        businessImpact: 'Instant privilege escalation: every employee can extract salary spreadsheets, M&A docs, and HR disciplinary files through natural language queries.',
        remediation: 'Propagate the caller’s identity via Microsoft Entra ID On-Behalf-Of (OBO) tokens and enforce mandatory Security Trimming on every retrieval query.'
      },
      {
        name: 'Stale Index-Time ACL Only on Broken SharePoint Inheritance',
        symptom: 'Syncing document permissions to the Vector DB only once per week during batch indexing.',
        businessImpact: 'When an employee changes departments or a sensitive folder breaks permission inheritance at 10:00 AM, they can still query those secrets via AI for 7 days.',
        remediation: 'Combine Event-Driven ACL Delta Sync (via MS Graph Webhooks) at Index-Time with lightweight Query-Time permission verification for Confidential/Purview-labeled chunks.'
      }
    ],
    boundaries: [
      {
        zone: 'Identity Propagation Boundary (Entra ID OBO)',
        responsibility: 'Cryptographically binding the human user’s Entra ID claims, group memberships, and ABAC clearance attributes to every downstream RAG & MCP call.',
        mustNeverCross: 'Caching RAG answers globally across users who do not share identical RBAC/ABAC security scopes.'
      },
      {
        zone: 'Vector Index ACL Boundary',
        responsibility: 'Storing allowed_principals, deny_principals, and sensitivity_label metadata on every vector chunk for pre-filtering.',
        mustNeverCross: 'Applying ACL filtering after the LLM has already seen the unauthorized chunks in its prompt.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'SharePoint Nested Group / Broken Inheritance Permission Drift',
        blastRadius: 'User removed from "Project-X-Confidential" Entra group retains cached vector visibility if webhook fails.',
        mitigationMechanism: 'Hybrid Trimming: Index-time ACL filter for speed (<20ms) + real-time Graph/Cache entitlement check on top-5 retrieved document IDs before prompt construction.',
        keyMetric: 'ACL Revocation Propagation SLA (<60s) & Zero Unauthorized Chunk Exposure'
      }
    ],
    governanceRules: [
      'Zero-Trust Mandate: No document chunk may enter an LLM prompt unless its ACL has been validated against the requesting user’s Entra ID token.',
      'Semantic Cache keys MUST partition by User Security Group Hash to prevent cross-user data leakage.',
      'Documents tagged "Highly Confidential / Board Only" in Microsoft Purview are excluded from general AI indexing by default unless explicitly allow-listed.'
    ],
    optionsComparison: {
      optionALabel: 'Hybrid Trimming (Webhook ACL Index + Top-K Verify)',
      optionBLabel: 'Index-Time ACL Filtering Only',
      optionCLabel: 'Query-Time Live Graph Check Only',
      options: [
        {
          id: 'hybrid-acl-trimming',
          name: 'Hybrid Security Trimming (Index-Time ACL Filter + Query-Time Top-K Verification)',
          tagline: 'Fast vector pre-filtering via webhook-synced ACL tags, plus real-time verification on the final Top-5 documents.',
          pros: ['Zero data leakage even when permissions change seconds ago', 'Preserves high recall in top-K vector search', 'Low latency (<60ms overhead)'],
          cons: ['Requires Graph webhook listener + permission cache layer'],
          whenToUse: 'Enterprise M365/SharePoint + SAP RAG systems handling HR, Finance, and Legal documents.',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        },
        {
          id: 'index-time-only',
          name: 'Index-Time ACL Metadata Filtering Only',
          tagline: 'Store security group IDs on vector chunks and filter inside the vector query.',
          pros: ['Very fast query execution (<10ms overhead)', 'No runtime call to source system'],
          cons: ['Permission revocation lag during batch sync windows', 'Complex re-indexing when a parent folder inheritance breaks across 100k child files'],
          whenToUse: 'Internal technical documentation with stable, coarse-grained department permissions.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        },
        {
          id: 'query-time-only',
          name: 'Query-Time Post-Retrieval Trimming Only',
          tagline: 'Fetch top-20 vector results blindly, then call SharePoint API to drop unauthorized files.',
          pros: ['Always reflects live permissions'],
          cons: ['Severe Recall Collapse (if user lacks access to top 20 matches, they get 0 results even if match #21 was public)', 'High runtime API latency'],
          whenToUse: 'Federated search wrappers over external APIs that do not expose ACL metadata.',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        }
      ],
      axes: [
        { metric: 'Zero-Leakage Security', optionA: 99, optionB: 75, optionC: 95 },
        { metric: 'Search Recall Quality', optionA: 96, optionB: 96, optionC: 35 },
        { metric: 'Query Latency', optionA: 88, optionB: 98, optionC: 45 },
        { metric: 'ACL Revocation Speed', optionA: 98, optionB: 55, optionC: 99 },
        { metric: 'Compliance Auditability', optionA: 98, optionB: 80, optionC: 90 }
      ]
    }
  },
  {
    id: 'p4-sovereignty-audit-trail',
    pillarId: 'pillar-4',
    code: 'P4.2',
    title: 'Data Sovereignty, Residency & Immutable AI Audit Trail',
    subtitle: 'Complying with national data residency laws, Customer-Managed Keys (BYOK), and forensic AI decision reconstruction',
    goldenRule: 'Keep regulated PII & core financial records inside Sovereign/Regional boundaries with BYOK encryption. Log every AI decision in an immutable, PII-redacted Audit Trail.',
    businessContext: 'Regulated enterprises (Banking, Healthcare, Government, Multi-national Manufacturing) face strict Data Sovereignty laws (GDPR, Vietnam PDPD / Decree 13) and regulator audits demanding proof: "Why did your AI Assistant advise rejecting Loan #8821 on March 14 at 10:05 AM, and did any citizen PII leave national borders?"',
    asciiFlow: `[ Regulated User Prompt ]
          │
          ▼
[ Sovereign Edge / PII Redaction & Tokenization Vault (In-Country) ]
          │ (Anonymized Payload via Private Link)
          ▼
[ Regional Cloud AI / BYOK Encrypted Vector Store ]
          │
          ▼
[ Immutable WORM Audit Log ]: { Timestamp, UserOID, ModelVersion, ChunkIDs, ACLProof, RedactedPromptHash }`,
    antiPatterns: [
      {
        name: 'Cross-Border Unredacted PII Streaming to Global Public LLM Endpoints',
        symptom: 'Sending raw customer names, national IDs, and bank account statements to a multi-region global LLM API without residency pinning or PII tokenization.',
        businessImpact: 'Direct regulatory violation, heavy statutory fines, and forced shutdown of the AI program by the CISO.',
        remediation: 'Deploy an in-country PII Tokenization/Redaction gateway and pin AI/Vector workloads to approved Regional/Sovereign Cloud zones with Private Endpoints and Customer-Managed Keys (BYOK).'
      },
      {
        name: 'Ephemeral Un-Audited AI Responses',
        symptom: 'Returning LLM answers to users without recording which document chunk versions, model weights, and RBAC checks produced the answer.',
        businessImpact: 'Total inability to defend the organization during a regulatory audit, customer dispute, or hallucination incident investigation.',
        remediation: 'Write an asynchronous, append-only Immutable Audit Record (WORM storage) capturing User OID, Prompt/Response hashes, retrieved Chunk IDs + version hashes, Model Router path, and RBAC evaluation proof.'
      }
    ],
    boundaries: [
      {
        zone: 'Sovereign In-Country Residency Zone',
        responsibility: 'Raw PII storage, identity vault, tokenization mapping table, immutable compliance audit ledger.',
        mustNeverCross: 'Replicating unmasked PII or encryption master keys outside the mandated sovereign jurisdiction.'
      },
      {
        zone: 'Immutable Audit Ledger Boundary',
        responsibility: 'Append-only WORM storage managed by InfoSec/Compliance, completely segregated from application developer write/delete permissions.',
        mustNeverCross: 'Storing raw unmasked credit card numbers or passwords in plaintext application debug logs.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Regulator Forensic Audit Request ("Reconstruct AI Decision #99102")',
        blastRadius: 'Legal penalty if compliance team cannot prove within 24 hours what data sources and guardrails were active.',
        mitigationMechanism: 'One-click Forensic Audit Replay using immutable Chunk Version IDs, Model Router telemetry, and OBO ACL verification receipt.',
        keyMetric: 'Audit Log Completeness (100% of AI Transactions) & Forensic Reconstruction Time (<15 mins)'
      }
    ],
    governanceRules: [
      'All production AI & Vector stores MUST use Customer-Managed Encryption Keys (BYOK) with automated annual rotation.',
      'PII Detection & Tokenization MUST execute before any payload crosses an on-prem or sovereign network boundary.',
      'AI Audit Logs MUST be retained in WORM (Write-Once-Read-Many) storage for the statutory retention period (e.g., 5-7 years).'
    ],
    optionsComparison: {
      optionALabel: 'Hybrid Sovereign Vault + Regional BYOK Cloud + WORM Audit',
      optionBLabel: '100% Air-Gapped On-Premises GPU Cluster',
      optionCLabel: 'Unrestricted Global Public SaaS API',
      options: [
        {
          id: 'hybrid-sovereign-byok',
          name: 'In-Country PII Tokenization + Regional Private Cloud (BYOK) + Immutable WORM Audit',
          tagline: 'Keep raw PII in-country, process pseudonymized workloads on regional private endpoints with BYOK and full forensic audit logs.',
          pros: ['Meets strict regulatory residency & CISO compliance', 'Access to elastic cloud scale & managed SLMs/LLMs', 'Complete forensic replayability'],
          cons: ['Requires maintaining tokenization mapping proxy'],
          whenToUse: 'Default enterprise architecture for Banking, Insurance, Telecom, and Multi-national enterprises.',
          costProfile: 'Medium',
          opsComplexity: 'Medium'
        },
        {
          id: 'airgapped-onprem',
          name: '100% Air-Gapped On-Premises Open-Weights Cluster',
          tagline: 'Host all GPUs, Vector DBs, and LLMs inside physical company data centers.',
          pros: ['Zero external cloud data movement', 'Total physical hardware control'],
          cons: ['High CapEx GPU procurement & depreciation', 'Requires specialized MLOps hardware engineering team', 'Lags behind frontier model capabilities'],
          whenToUse: 'Defense, classified government workloads, or strictly air-gapped factory floors.',
          costProfile: 'High',
          opsComplexity: 'High'
        },
        {
          id: 'global-public-api',
          name: 'Direct Global Public LLM API (No Residency / No Redaction)',
          tagline: 'Call public multi-region APIs directly from application servers.',
          pros: ['Zero setup time'],
          cons: ['Fails Data Sovereignty & CISO review immediately for regulated data'],
          whenToUse: 'Public, non-sensitive marketing copy generation only.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        }
      ],
      axes: [
        { metric: 'Regulatory Compliance', optionA: 96, optionB: 99, optionC: 15 },
        { metric: 'Forensic Auditability', optionA: 98, optionB: 90, optionC: 25 },
        { metric: 'Model Capability Access', optionA: 92, optionB: 60, optionC: 98 },
        { metric: 'CapEx / TCO Efficiency', optionA: 88, optionB: 30, optionC: 90 },
        { metric: 'Operational Elasticity', optionA: 90, optionB: 35, optionC: 95 }
      ]
    }
  },

  // ================= PILLAR 5 =================
  {
    id: 'p5-gatekeeper-adr-tco',
    pillarId: 'pillar-5',
    code: 'P5.1',
    title: '7-Layer SA Decision Gatekeeper, ADR Mastery & 3-Year TCO Defense',
    subtitle: 'Systematic design validation, writing bulletproof Architecture Decision Records, and defending ROI in the CxO Boardroom',
    goldenRule: 'An architecture is only as strong as its explicit Trade-offs, Day-2 Operational Feasibility, and 3-Year TCO. Never walk into an Architecture Review Board without passing the 7 Gatekeeper Questions.',
    businessContext: 'Brilliant technical diagrams fail in enterprise delivery when architects cannot justify 3-year TCO to the CFO, prove Zero-Trust ACL safety to the CISO, guarantee Day-2 operability to the Head of SRE, or document irreversible trade-offs in crisp ADRs.',
    asciiFlow: `[ Proposed Enterprise Architecture ]
          │
          ▼
[ 7-Layer SA Decision Gatekeeper Checklist ]
  ├─► 1. Edge: Dynamic data bypassing CDN?
  ├─► 2. Data: Read/Write > 50:1 using CQRS + Eventual Consistency handling?
  ├─► 3. Async: FE Idempotency-Key + BE Redlock & Saga (>4 steps Orchestrated)?
  ├─► 4. Resilience: Circuit Breaker (1ms Fail-Fast) + Bulkhead (80/20) + Strangler Fig?
  ├─► 5. Enterprise Data: Sanctioned SAP CDC + MDM Golden Record + Column Lineage?
  ├─► 6. AI Engineering: Model Router (75% SLM / 25% LLM) + Hybrid RAG (BM25+Vector+Rerank)?
  └─► 7. Zero Trust: Entra ID OBO + Security Trimming + Immutable WORM Audit Trail?
          │
          ▼
[ Signed ADR + 36-Month TCO Model ] ──► [ CxO Stakeholder Boardroom Approval ]`,
    antiPatterns: [
      {
        name: 'Resume-Driven Architecture (Hype Over TCO)',
        symptom: 'Proposing Pure Data Mesh + Autonomous Multi-Agent Frontier LLMs + 30 Microservices for a mid-sized workflow without calculating 3-year OpEx or team readiness.',
        businessImpact: '300% budget overrun, SRE burnout, and project cancellation by the CFO after 9 months.',
        remediation: 'Anchor every architectural choice in a quantitative 3-Year TCO model (CapEx + OpEx + Token FinOps + Staffing) and document rejected simpler alternatives in an ADR.'
      },
      {
        name: 'encyclopedia-Length Architecture Docs Nobody Reads',
        symptom: 'Writing 120-page Word documents that hide critical risks instead of concise, version-controlled ADRs.',
        businessImpact: 'Engineering teams ignore the document, repeat already-rejected mistakes, and lose institutional memory when architects rotate.',
        remediation: 'Use crisp 1-2 page ADRs stored as Docs-as-Code capturing Context, Considered Options, Quantitative Trade-offs, Negative Consequences, and Compliance Gates.'
      }
    ],
    boundaries: [
      {
        zone: 'Architectural Decision (ADR) vs. Implementation Detail',
        responsibility: 'ADRs govern high-cost-of-change decisions (Boundaries, Consistency models, Security trimming, FinOps routing, Data contracts).',
        mustNeverCross: 'Micromanaging internal variable names or local helper functions inside an enterprise ADR.'
      },
      {
        zone: 'Technical Metrics vs. Executive Business Metrics',
        responsibility: 'Translate P99 Latency, Circuit Breaker trips, and SLM offload ratios into Conversion Rate, Revenue Protection, Compliance Risk Reduction, and 3-Year Net ROI.',
        mustNeverCross: 'Pitching HNSW graph hyperparameters to the CFO instead of Cost-per-Resolved-Ticket.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Unmonitored Technical Debt & Expired Architecture Exceptions',
        blastRadius: 'Temporary tactical workarounds become permanent production vulnerabilities.',
        mitigationMechanism: 'Maintain an Architecture Exception Register with mandatory expiration dates, automated Fitness Functions in CI/CD, and ADR superseding reviews.',
        keyMetric: 'ADR Coverage (100% of Tier-1 Decisions) & TCO Variance (<10% vs. Forecast)'
      }
    ],
    governanceRules: [
      'No Tier-1 project may pass Architecture Review Board (ARB) without completing the 7-Layer SA Decision Gatekeeper Checklist.',
      'Every ADR MUST explicitly state the Negative Consequences / Risks accepted and the trigger conditions for revisiting the decision.',
      'All AI and Data initiatives MUST include a 36-month TCO sensitivity stress test (modeling 3x traffic growth and token price/volume variance).'
    ],
    optionsComparison: {
      optionALabel: 'Docs-as-Code ADRs + 7-Gate Checklist + FinOps TCO',
      optionBLabel: 'Informal Tribal Knowledge (No ADRs)',
      optionCLabel: 'Heavyweight Ivory-Tower Waterfall Docs',
      options: [
        {
          id: 'lean-governed-delivery',
          name: 'Lean Governed Delivery (7-Layer Gatekeeper + Docs-as-Code ADRs + 3Y TCO Model)',
          tagline: 'Fast, automated architectural guardrails paired with concise ADRs and financial sensitivity modeling.',
          pros: ['High engineering velocity with clear guardrails', 'Wins immediate trust from CFO, CISO, and SRE', 'Preserves decision history'],
          cons: ['Requires discipline to maintain ADRs in Git PR reviews'],
          whenToUse: 'All modern Enterprise & Solution Architecture organizations.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        },
        {
          id: 'tribal-knowledge',
          name: 'Ad-hoc Tribal Decisions (No Formal Governance)',
          tagline: 'Teams pick technologies in Slack threads without trade-off analysis or security review.',
          pros: ['Zero upfront documentation time'],
          cons: ['Guaranteed security/compliance blind spots', 'Repeated costly rewrites every 12 months'],
          whenToUse: 'Throwaway 48-hour hackathon prototypes only.',
          costProfile: 'High',
          opsComplexity: 'High'
        },
        {
          id: 'ivory-tower',
          name: 'Ivory-Tower 150-Page Upfront Blueprints',
          tagline: 'Architects spend 6 months writing static documents without hands-on simulators or code validation.',
          pros: ['Looks thorough on paper initially'],
          cons: ['Obsolete before implementation starts', 'Disconnected from Day-2 operational reality'],
          whenToUse: 'Avoid in modern iterative enterprise engineering.',
          costProfile: 'High',
          opsComplexity: 'High'
        }
      ],
      axes: [
        { metric: 'Stakeholder Buy-In (CxO)', optionA: 97, optionB: 20, optionC: 60 },
        { metric: 'Engineering Alignment', optionA: 95, optionB: 45, optionC: 30 },
        { metric: 'Risk & Cost Control', optionA: 96, optionB: 15, optionC: 65 },
        { metric: 'Delivery Velocity', optionA: 90, optionB: 85, optionC: 20 },
        { metric: 'Audit & Handover Value', optionA: 98, optionB: 10, optionC: 70 }
      ]
    }
  },
  {
    id: 'p5-finops-monolith-egress',
    pillarId: 'pillar-5',
    code: 'P5.2',
    title: 'FinOps & Cloud Economics: Modular Monolith vs. Microservices & Data Egress Control',
    subtitle: 'Right-sizing architecture for 1x vs. 10x scale, avoiding Distributed Monoliths, and eliminating silent Cross-AZ & Cloud Egress burn',
    goldenRule: 'Start with a Modular Monolith until team size (>30 engineers) or independent scaling bottlenecks justify Microservices. Watch Cloud Data Egress and Cross-AZ traffic—they silently burn 40% of cloud budgets.',
    businessContext: 'An 18-engineer product team splits an internal ERP portal into 22 Kubernetes Microservices across 3 Availability Zones and 2 cloud regions. Within 6 months, Cloud OpEx triples ($42k/mo -> $135k/mo): 40% of the bill comes from unmonitored Cross-AZ NAT Gateway & Cross-Cloud Data Egress charges, while feature velocity drops 60% due to Distributed Monolith coupling.',
    asciiFlow: `[ <30 Engineers: Modular Monolith ] ──► Single Deployable · In-Process Calls ($0 Network Egress)
        │
        ├─► Hot Compute / Independent Scale Bottleneck? ──► Extract ONLY Targeted Microservice
        │
        └─► Cloud Cost & Data Lifecycle Tiering:
              ├─► Hot Tier (0–30d): NVMe / Primary SQL SSD (High IOPS)
              ├─► Warm Tier (30d–1y): Object Storage Standard (S3/Blob, 1/5th cost)
              └─► Cold Tier (1y–7y): Glacier / Archive Storage (1/20th cost, Same-Region VPC Endpoint)`,
    antiPatterns: [
      {
        name: 'Distributed Monolith (Microservices Premature Split)',
        symptom: 'A <30-engineer team splits into 20+ microservices that still share a database or must all be deployed together for every feature.',
        businessImpact: 'You pay 100% of the distributed systems tax (network latency, Kubernetes overhead, distributed tracing) with zero independent deployability.',
        remediation: 'Consolidate into a Modular Monolith with strict internal module boundaries (bounded contexts); extract a microservice ONLY when a module has an independent scaling or compliance need.'
      },
      {
        name: 'Unbounded Cross-AZ / Cross-Cloud Data Egress',
        symptom: 'Chatty microservices, Kafka replication, and uncached S3/Blob downloads cross Availability Zones and NAT Gateways continuously.',
        businessImpact: 'Silent 30–40% Cloud OpEx tax ($0.01–$0.09/GB) that scales linearly with traffic and destroys 36-month TCO.',
        remediation: 'Enforce Topology-Aware Routing (keep traffic within the same AZ), use Private VPC Endpoints instead of NAT Gateways, and co-locate compute with data.'
      }
    ],
    boundaries: [
      {
        zone: 'Compute & Service Granularity Boundary',
        responsibility: 'Match architecture topology to Conway’s Law (<30 devs -> Modular Monolith; >30 devs / distinct SLA -> Targeted Microservices).',
        mustNeverCross: 'Must NEVER split into microservices purely for "resume-driven development" without proving an independent scaling or team-autonomy bottleneck.'
      },
      {
        zone: 'Storage Lifecycle & Network Egress Boundary',
        responsibility: 'Automatically tier data across Hot SSD (0–30d), Warm Object Storage (30d–1y), and Cold Archive (1–7y) while keeping traffic inside same-region Private Endpoints.',
        mustNeverCross: 'Must NEVER store 5-year audit logs or raw PDFs on expensive Primary SQL SSDs or route internal object-storage traffic over public NAT Gateways.'
      }
    ],
    day2Ops: [
      {
        failureMode: 'Monthly Cloud Bill Spikes 2.5x During 10x Traffic Growth Without Revenue Proportionality',
        blastRadius: 'Unit economics turn negative; CFO freezes new AI and product initiatives.',
        mitigationMechanism: 'Enable FinOps cost-allocation tags per domain, enforce AZ-local routing + VPC Gateway Endpoints, automate Hot->Warm->Cold storage lifecycle policies, and right-size idle K8s nodes.',
        keyMetric: 'Cross-AZ / Egress % of Total Bill (<10%), Cost per Transaction (1x vs. 10x Scale), Storage Tiering Savings (>=60%)'
      }
    ],
    governanceRules: [
      'Every Microservices proposal for teams under 30 engineers must pass a "Modular Monolith vs. Microservices TCO Justification" in the ADR.',
      'Mandate Same-Region VPC Endpoints and Topology-Aware Routing for high-throughput data/AI pipelines.',
      'Enforce automated Hot -> Warm -> Cold storage lifecycle rules on all logs, backups, and document archives.'
    ],
    optionsComparison: {
      optionALabel: 'Modular Monolith + Targeted Services + Lifecycle Tiering',
      optionBLabel: 'Premature 25-Microservice K8s Mesh',
      optionCLabel: '100% Serverless / Managed Primitives',
      options: [
        {
          id: 'modular-monolith-finops',
          name: 'Modular Monolith + Targeted Extraction + FinOps Tiering',
          tagline: 'In-process bounded contexts for <30 devs, extracting only hot bottlenecks, with AZ-local routing and Hot/Warm/Cold storage.',
          pros: [
            'Lowest TCO at 1x and predictable linear scaling at 10x ($0 internal network egress)',
            'Fastest developer velocity with zero distributed-debugging tax',
            'Cuts storage and egress bills by 40–60% via lifecycle tiering and VPC endpoints'
          ],
          cons: [
            'Requires disciplined code-level module boundaries (e.g. ArchUnit / package isolation)',
            'Entire monolith scales as one unit until hot modules are extracted'
          ],
          whenToUse: 'Default starting architecture for teams <30 engineers and 90% of enterprise internal platforms.',
          costProfile: 'Low',
          opsComplexity: 'Low'
        },
        {
          id: 'premature-microservices',
          name: 'Premature Distributed Microservices (25+ Services)',
          tagline: 'Full Kubernetes + Service Mesh + Cross-AZ RPC for a small engineering team.',
          pros: ['Theoretical independent scaling per service'],
          cons: [
            '3–5x higher Cloud TCO from K8s control planes, Cross-AZ egress, and observability',
            '60% slower delivery when services degrade into a Distributed Monolith'
          ],
          whenToUse: 'Only justified at >30–50 engineers with genuinely decoupled domains and scaling profiles.',
          costProfile: 'High',
          opsComplexity: 'High'
        },
        {
          id: 'serverless-managed',
          name: 'Serverless / Managed Primitives (Lambda / Functions)',
          tagline: 'Pay-per-invocation functions and managed queues with zero idle server cost.',
          pros: [
            'Near-zero cost at 1x low/spiky traffic and minimal server patching'
          ],
          cons: [
            'At steady 10x high-throughput scale, per-invocation & API Gateway egress costs can exceed containers by 2–3x',
            'Cold starts and execution duration limits for heavy workloads'
          ],
          whenToUse: 'Event-driven glue workloads, cron jobs, and unpredictable spiky APIs.',
          costProfile: 'Variable',
          opsComplexity: 'Medium'
        }
      ],
      axes: [
        { metric: '1x Scale TCO Efficiency', optionA: 94, optionB: 25, optionC: 92 },
        { metric: '10x Scale TCO Predictability', optionA: 90, optionB: 45, optionC: 55 },
        { metric: 'Cross-AZ & Egress Control', optionA: 96, optionB: 30, optionC: 70 },
        { metric: 'Team Velocity (<30 Devs)', optionA: 95, optionB: 35, optionC: 82 },
        { metric: 'Future Extraction Readiness', optionA: 88, optionB: 90, optionC: 65 }
      ]
    }
  }
];

export interface GatekeeperItem {
  id: string;
  layer: string;
  pillarBadge: string;
  question: string;
  redLineFailure: string;
  architectRemediation: string;
}

export const SA_DECISION_CHECKLIST: GatekeeperItem[] = [
  {
    id: 'gate-1',
    layer: '1. Edge & Gateway Layer',
    pillarBadge: 'Pillar 1',
    question: 'Is this endpoint serving real-time dynamic state (Inventory, Flash Sale Price, Cart)? If yes, have we enforced CDN Caching Bypass and kept business logic out of the API Gateway?',
    redLineFailure: 'Stale CDN cache causes massive Overselling; Fat Gateway becomes a CPU-bound Single Point of Failure.',
    architectRemediation: 'Apply Hybrid Rendering (Static Shell on CDN <50ms, Dynamic API with Cache-Control: no-store) + HA Stateless Gateway Cluster + Distributed Mutex Lock on Redis Cache-Aside.'
  },
  {
    id: 'gate-2',
    layer: '2. Data & CQRS Layer',
    pillarBadge: 'Pillar 2',
    question: 'Does this workload exhibit a Read/Write skew exceeding 50:1? If yes, have we separated the 3NF ACID Command DB from the Denormalized Query DB (CQRS) and handled Eventual Consistency?',
    redLineFailure: 'Heavy historical search queries lock transactional tables and degrade payment/order write throughput.',
    architectRemediation: 'Route writes to 3NF SQL (PostgreSQL/HANA) and replicate asynchronously via CDC to Elasticsearch/NoSQL for <0.5s reads with Read-Your-Own-Writes UI handling.'
  },
  {
    id: 'gate-3',
    layer: '3. Async, Idempotency & Saga Layer',
    pillarBadge: 'Pillar 1',
    question: 'Does the Front-End generate a UUID Idempotency-Key enforced by Back-End Redis Redlock/Unique Constraints, and do workflows >4 steps use an Orchestration Saga + Transactional Outbox?',
    redLineFailure: 'Mobile 3G/4G retries double-charge customers; Dual-Writes lose events; >4 step Choreography creates un-debuggable Event Spaghetti.',
    architectRemediation: 'Enforce "FE Generates, BE Enforces" Idempotency, publish events atomically via Transactional Outbox + Debezium, and manage >4 step LIFO rollbacks with a Saga Orchestrator.'
  },
  {
    id: 'gate-4',
    layer: '4. Resilience & Modernization Layer',
    pillarBadge: 'Pillar 1',
    question: 'Are external partner dependencies wrapped in a 3-State Circuit Breaker (1ms Fail-Fast + Graceful Fallback), heavy workloads isolated in Bulkheads (80/20), and legacy migrations using Strangler Fig?',
    redLineFailure: 'A hung partner API or 100 accountants exporting 5-year PDFs starves 100% of worker threads, crashing customer sales.',
    architectRemediation: 'Configure Circuit Breakers (CLOSED/OPEN/HALF-OPEN), partition Thread/Pod Bulkheads (80% Sales / 20% Reporting), and phase legacy cutovers via a Strangler Fig Façade Proxy.'
  },
  {
    id: 'gate-5',
    layer: '5. Enterprise Data, SAP CDC & Lineage Layer',
    pillarBadge: 'Pillar 2',
    question: 'Are we extracting SAP ERP data via sanctioned ODP/SLT CDC (never raw BSEG/BKPF table scraping), resolving entities to an MDM Golden Record, and enforcing Automated Data Contracts & Lineage?',
    redLineFailure: 'SAP indirect-access license audit penalties, broken pipelines on SAP upgrades, and conflicting Customer/Revenue numbers in AI & BI.',
    architectRemediation: 'Use SAP ODP/SLT CDC into a Canonical Model, reconcile Customer/Vendor IDs in MDM, and enforce column-level Lineage & Data Contracts on Lakehouse/Mesh products.'
  },
  {
    id: 'gate-6',
    layer: '6. AI Engineering, Model Router, Semantic Cache & Hybrid RAG Layer',
    pillarBadge: 'Pillar 3',
    question: 'Are we using a 70-80% SLM Model Router, RBAC-partitioned Semantic Caching (cosine > 0.92 with User Security Group Hash), Multi-LLM Fallback (429/5xx), and Hybrid Search (BM25 + Vector + Reranker)?',
    redLineFailure: '50x Token TCO blowout; Cross-User Semantic Cache Leak exposes executive data; single-vendor 429 outages; pure Vector Search fails on exact SKUs (Technical Code Blindness).',
    architectRemediation: 'Deploy an AI Gateway with 75/25 SLM/LLM routing, Semantic Cache partitioned by User Security Group Hash, Multi-Provider Fallback, BM25 + Vector + Reranker, and MCP + RAGAS Eval.'
  },
  {
    id: 'gate-7',
    layer: '7. Zero Trust, Cloud FinOps, Egress & Right-Sizing Layer',
    pillarBadge: 'Pillars 4 & 5',
    question: 'Does AI enforce Entra ID OBO + BYOK/WORM Audit, and does our ADR justify Modular Monolith (<30 devs) vs. Microservices TCO (1x vs 10x) with Cross-AZ/Cloud Egress & Hot/Warm/Cold storage controls?',
    redLineFailure: 'Unauthorized M365 data leaks in RAG; premature Microservices create a Distributed Monolith; unmonitored Cross-AZ Egress & Hot SSD hoarding burn 40% of cloud budget.',
    architectRemediation: 'Enforce Entra ID OBO + Hybrid Security Trimming + WORM Audit, start with Modular Monolith unless >30 devs/scaling demands split, use Same-AZ VPC Endpoints, and automate Hot->Warm->Cold tiering.'
  }
];

export interface CapstoneStage {
  id: string;
  stageNumber: number;
  pillarBadge: string;
  title: string;
  scenarioPrompt: string;
  constraints: string[];
  choices: {
    id: string;
    label: string;
    architectureSummary: string;
    isOptimal: boolean;
    scoreDelta: {
      tradeOffMastery: number;
      boundaryIntegrity: number;
      day2Feasibility: number;
      governanceCompliance: number;
    };
    monthlyCostUsd: number;
    p95LatencyMs: number;
    riskLevel: 'Low' | 'Moderate' | 'Critical';
    architectFeedback: string;
    stakeholderReaction: string;
  }[];
}

export const CAPSTONE_STAGES: CapstoneStage[] = [
  {
    id: 'cap-stage-1',
    stageNumber: 1,
    pillarBadge: 'Pillar 1: Distributed & Resilience',
    title: 'Global Flash Sale Order & Inventory Ingestion',
    scenarioPrompt: 'GlobalManufacturing Corp is launching a B2B/B2C Flash Promotion (100x traffic spike) while 200 regional accountants run 5-year financial PDF closing reports at month-end. Orders span 5 services (Order, CreditCheck, SAP Reservation, Payment, Logistics). How do you architect the Edge, Async & Resilience layer?',
    constraints: [
      'Peak ingress: 85,000 RPS during Flash Sale; Checkout SLA < 200ms',
      'Mobile dealers operate on flaky 4G connections with frequent client retries',
      'Month-end 5-year PDF exports must not degrade Order Checkout availability'
    ],
    choices: [
      {
        id: 'c1-optimal',
        label: 'Option A: Hybrid CDN + Mutex Cache-Aside + FE/BE Idempotency + Outbox Orchestration Saga + 80/20 Bulkhead & Circuit Breaker',
        architectureSummary: 'Static shell on CDN, bypass CDN for stock; Redis Mutex Lock for hot SKUs; FE UUID + BE Redlock idempotency; Kafka backpressure + Outbox + Orchestration Saga (5 steps); 80% Sales / 20% PDF Bulkhead pools.',
        isOptimal: true,
        scoreDelta: { tradeOffMastery: 20, boundaryIntegrity: 20, day2Feasibility: 20, governanceCompliance: 20 },
        monthlyCostUsd: 14500,
        p95LatencyMs: 85,
        riskLevel: 'Low',
        architectFeedback: 'Exemplary SA decision. You prevented Overselling (CDN Bypass), Cache Stampede (Mutex Lock), Double-Charging (FE/BE Idempotency), Event Spaghetti (Orchestration for 5-step workflow), and Thread Starvation (80/20 Bulkhead).',
        stakeholderReaction: 'Head of SRE: "Zero cascading failures during our chaos drill. Checkout stayed at 85ms even while 200 accountants exported PDFs."'
      },
      {
        id: 'c1-naive-cdn-choreo',
        label: 'Option B: Full CDN Caching (30s TTL) + 5-Step Choreography Saga + Shared Worker Pool',
        architectureSummary: 'Cache product & stock APIs on CDN for 30s; let 5 services react via peer-to-peer events; run PDF reports and checkout on the same Kubernetes deployment.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 8, boundaryIntegrity: 5, day2Feasibility: 4, governanceCompliance: 8 },
        monthlyCostUsd: 9200,
        p95LatencyMs: 2400,
        riskLevel: 'Critical',
        architectFeedback: 'Critical failures triggered: 30s stale CDN stock caused 4,200 oversold orders; 5-step Choreography devolved into un-debuggable Event Spaghetti during rollback; PDF exports exhausted the shared thread pool.',
        stakeholderReaction: 'VP of Sales: "We oversold 4,200 high-margin units and checkout froze at 4:00 PM when Finance ran their month-end PDF reports!"'
      },
      {
        id: 'c1-sync-fat-gw',
        label: 'Option C: Fat API Gateway Orchestration + Synchronous REST Chain + Backend-Generated UUID',
        architectureSummary: 'Embed 5-step orchestration inside the API Gateway calling services synchronously; generate transaction UUID inside the backend payment controller.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 5, boundaryIntegrity: 4, day2Feasibility: 5, governanceCompliance: 6 },
        monthlyCostUsd: 19800,
        p95LatencyMs: 4800,
        riskLevel: 'Critical',
        architectFeedback: 'Fat Gateway anti-pattern maxed out CPU; synchronous chain collapsed under 100x Flash Sale load; backend-generated UUID failed to catch 4G client retries, double-charging 680 dealers.',
        stakeholderReaction: 'CFO: "Dealers were charged twice on mobile retries and our central gateway crashed under peak load."'
      }
    ]
  },
  {
    id: 'cap-stage-2',
    stageNumber: 2,
    pillarBadge: 'Pillar 2: Enterprise Data Architecture',
    title: 'SAP ERP Real-Time Extraction, High-Skew Read Store & Enterprise Data Topology',
    scenarioPrompt: 'Dealers and internal AI agents query 5 years of order/invoice history at a 90:1 Read/Write ratio while financial postings land in SAP S/4HANA (`BSEG`/`BKPF`) and customer records live across SAP, Salesforce CRM, and regional ERPs. How do you design the Enterprise Data layer?',
    constraints: [
      'Read/Write ratio is 90:1 (exceeds the 50:1 CQRS threshold); historical search SLA < 400ms',
      'Strict SAP Enterprise License compliance & zero HANA lock contention',
      'AI and CFO dashboards require a single Golden Record for Customer & Vendor entities'
    ],
    choices: [
      {
        id: 'c2-optimal',
        label: 'Option A: Sanctioned SAP ODP/SLT CDC + CQRS (SQL + Elasticsearch) + MDM Golden Record + Governed Lakehouse/Mesh',
        architectureSummary: 'Extract SAP deltas via ODP/SLT into a Canonical Model; apply CQRS with Elasticsearch for <0.4s 5-year history search; resolve Customer/Vendor in MDM; enforce automated Data Contracts & Column Lineage on Delta/Iceberg Lakehouse.',
        isOptimal: true,
        scoreDelta: { tradeOffMastery: 20, boundaryIntegrity: 20, day2Feasibility: 20, governanceCompliance: 20 },
        monthlyCostUsd: 18000,
        p95LatencyMs: 190,
        riskLevel: 'Low',
        architectFeedback: 'Spot-on enterprise data architecture. CQRS absorbs the 90:1 read skew effortlessly, SAP ODP protects HANA performance and licensing, and MDM + Column Lineage guarantees trusted data for AI and Finance.',
        stakeholderReaction: 'Chief Data Officer: "SAP Basis confirmed <2% CPU overhead, 5-year history loads in 190ms, and every customer entity maps cleanly to a single MDM Golden ID."'
      },
      {
        id: 'c2-direct-sap-mesh',
        label: 'Option B: Direct JDBC Triggers on SAP BSEG/BKPF + Decentralized Un-governed Data Mesh',
        architectureSummary: 'Attach custom database triggers directly to SAP HANA physical tables and let each regional business unit build its own independent data store without central MDM.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 6, boundaryIntegrity: 4, day2Feasibility: 5, governanceCompliance: 3 },
        monthlyCostUsd: 31000,
        p95LatencyMs: 650,
        riskLevel: 'Critical',
        architectFeedback: 'Severe governance and operational breach: raw triggers on SAP BSEG/BKPF violated SAP runtime licensing and broke during the quarterly SAP patch; lack of MDM produced 4 conflicting revenue figures.',
        stakeholderReaction: 'General Counsel & CIO: "SAP auditors flagged an indirect access violation, and our quarterly SAP patch broke all downstream pipelines!"'
      },
      {
        id: 'c2-monolith-sql',
        label: 'Option C: Single Relational DB for Both OLTP Writes & 5-Year Search Queries',
        architectureSummary: 'Batch-export SAP nightly into a single PostgreSQL database with 18 secondary indexes serving both live order writes and 5-year historical search.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 9, boundaryIntegrity: 10, day2Feasibility: 8, governanceCompliance: 11 },
        monthlyCostUsd: 11500,
        p95LatencyMs: 3200,
        riskLevel: 'Moderate',
        architectFeedback: 'Ignoring the >50:1 CQRS threshold caused severe index write amplification and 3.2s search latency, while nightly batch exports left AI agents blind to intraday supply chain changes.',
        stakeholderReaction: 'VP of Operations: "Data is 24 hours stale and searching 5-year invoice history takes over 3 seconds."'
      }
    ]
  },
  {
    id: 'cap-stage-3',
    stageNumber: 3,
    pillarBadge: 'Pillar 3: AI Architecture & FinOps',
    title: 'Enterprise AI Copilot: Model Routing, Technical Retrieval & Agentic MCP',
    scenarioPrompt: 'You are building an Enterprise Supply Chain & Engineering Copilot for 15,000 employees handling 1.2M queries/month. 75% of queries are routine SKU/status lookups, while 25% require multi-step root-cause analysis across SAP part numbers (`MATNR-8841-X`), error codes (`ERR_SAP_LOCK_09`), and M365 engineering specs, plus drafting Purchase Order adjustments.',
    constraints: [
      'Strict FinOps budget: Monthly AI inference cost must stay under $12,000',
      'Must accurately retrieve exact technical error codes & part numbers with 100% source citations',
      'Agent actions that modify SAP Purchase Orders require strict safety boundaries'
    ],
    choices: [
      {
        id: 'c3-optimal',
        label: 'Option A: AI Gateway Model Router (75% SLM / 25% Frontier LLM) + Hybrid RAG (BM25 + Vector + Reranker) + Bounded MCP Servers with Human-in-the-Loop',
        architectureSummary: 'Semantic Router sends 75% routine queries to Phi-4/Llama-3-8B (with Confidence Escalation) and 25% to GPT-4o/Claude; Hybrid BM25 + HNSW Vector + Cross-Encoder Reranker (Top-5); scoped MCP tools with mandatory Human approval for PO writes; RAGAS CI/CD eval.',
        isOptimal: true,
        scoreDelta: { tradeOffMastery: 20, boundaryIntegrity: 20, day2Feasibility: 20, governanceCompliance: 20 },
        monthlyCostUsd: 6800,
        p95LatencyMs: 620,
        riskLevel: 'Low',
        architectFeedback: 'Masterclass in AI Systems Engineering. You slashed Token TCO by 74% via SLM routing, cured Vector Technical Code Blindness with BM25 + Reranker, respected "Finetuning for Form, RAG for Facts", and bounded agent execution via MCP.',
        stakeholderReaction: 'CFO & VP of Engineering: "Inference cost is only $6.8k/month—well below our $12k cap—and engineers get 100% cited matches on exact SAP error codes."'
      },
      {
        id: 'c3-frontier-pure-vector',
        label: 'Option B: 100% Frontier LLM + Pure Dense Vector Search + Autonomous Open-Loop Agent',
        architectureSummary: 'Route 100% of queries to a flagship Frontier LLM using pure Cosine Similarity vector search and an unconstrained autonomous ReAct loop with direct API credentials.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 6, boundaryIntegrity: 5, day2Feasibility: 5, governanceCompliance: 6 },
        monthlyCostUsd: 46500,
        p95LatencyMs: 4100,
        riskLevel: 'Critical',
        architectFeedback: 'Triple failure: 100% Frontier LLM usage blew the FinOps budget by nearly 400%; Pure Vector Search failed on exact SKU/error codes (Technical Code Blindness); unconstrained agent loops caused runaway token spikes.',
        stakeholderReaction: 'CFO: "$46,500 a month in token bills?! And support engineers say it still hallucinates when they search exact part numbers!"'
      },
      {
        id: 'c3-weekly-finetune-longctx',
        label: 'Option C: Weekly Full LoRA Finetuning on Inventory Facts + 500k Long-Context Prompt Stuffing',
        architectureSummary: 'Retrain a LoRA model weekly on changing inventory tables and dump 500k tokens of manuals into every prompt instead of maintaining a Hybrid RAG pipeline.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 5, boundaryIntegrity: 7, day2Feasibility: 4, governanceCompliance: 5 },
        monthlyCostUsd: 62000,
        p95LatencyMs: 7800,
        riskLevel: 'Critical',
        architectFeedback: 'Violated Chip Huyen’s Golden Rule ("Finetuning is for Form, RAG is for Facts"). Weights became stale immediately, zero citations were possible, and 500k-token prompts caused extreme latency and "Lost in the Middle" errors.',
        stakeholderReaction: 'Head of AI Platform: "Our GPU and token bills exploded to $62k/month and the model quotes last week’s inventory without any source links."'
      }
    ]
  },
  {
    id: 'cap-stage-4',
    stageNumber: 4,
    pillarBadge: 'Pillar 4: Security, Compliance & Zero Trust',
    title: 'M365 Inherited Permissions, Data Sovereignty & Forensic AI Auditability',
    scenarioPrompt: 'The Copilot indexes 1.5M SharePoint/M365 files (including Board M&A decks and HR payroll sheets with complex inherited permissions) and serves subsidiaries subject to strict national Data Sovereignty laws. CISO demands zero privilege escalation and 100% forensic auditability.',
    constraints: [
      'SharePoint folders frequently break permission inheritance and update Entra ID group memberships',
      'Regulated PII and financial records must not leave sovereign national borders unmasked',
      'Compliance requires reconstructing any past AI recommendation within 15 minutes'
    ],
    choices: [
      {
        id: 'c4-optimal',
        label: 'Option A: Entra ID On-Behalf-Of (OBO) + Hybrid Security Trimming (Webhook ACL Index + Top-K Verify) + Sovereign PII Vault (BYOK) + Immutable WORM Audit Trail',
        architectureSummary: 'Propagate user Entra ID via OBO token; filter vector search by synced ACL tags AND verify Top-5 doc permissions at query-time; tokenize PII in-country with BYOK keys; log chunk hashes, ACL proofs & model routing to WORM storage.',
        isOptimal: true,
        scoreDelta: { tradeOffMastery: 20, boundaryIntegrity: 20, day2Feasibility: 20, governanceCompliance: 20 },
        monthlyCostUsd: 8900,
        p95LatencyMs: 110,
        riskLevel: 'Low',
        architectFeedback: 'Gold-standard Zero-Trust AI architecture. Hybrid Security Trimming prevents both Recall Collapse and stale-ACL leaks, Sovereign PII tokenization satisfies data residency laws, and WORM logs guarantee forensic audit replay.',
        stakeholderReaction: 'CISO: "Our Red Team tried 200 prompt-injection and permission-escalation attacks—zero unauthorized SharePoint chunks leaked, and audit replay took 4 minutes."'
      },
      {
        id: 'c4-service-principal',
        label: 'Option B: Shared App Service Principal Vector Query + System Prompt Warning ("Do Not Share Secrets")',
        architectureSummary: 'Query the Vector DB with a single backend admin Service Principal and instruct the LLM in the system prompt not to reveal executive salaries to regular staff.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 2, boundaryIntegrity: 0, day2Feasibility: 5, governanceCompliance: 0 },
        monthlyCostUsd: 3500,
        p95LatencyMs: 40,
        riskLevel: 'Critical',
        architectFeedback: 'Catastrophic Zero-Trust violation. System prompts are NEVER a security boundary. Any user can bypass the prompt instruction when confidential chunks are injected into the context window via an over-privileged Service Principal.',
        stakeholderReaction: 'CISO: "STOP DEPLOYMENT IMMEDIATELY! Our intern just extracted the Q4 M&A target list and executive compensation table in 30 seconds."'
      },
      {
        id: 'c4-weekly-acl-global',
        label: 'Option C: Weekly Batch ACL Sync Only + Global Multi-Region Public LLM Without PII Redaction',
        architectureSummary: 'Sync SharePoint ACLs once every Sunday night and send raw prompts directly to a global public LLM endpoint with standard application debug logs.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 7, boundaryIntegrity: 6, day2Feasibility: 8, governanceCompliance: 4 },
        monthlyCostUsd: 5200,
        p95LatencyMs: 65,
        riskLevel: 'Critical',
        architectFeedback: 'Two major compliance failures: 7-day ACL revocation lag means employees removed from sensitive projects retain AI access all week, and streaming unredacted PII across borders violates Data Sovereignty regulations.',
        stakeholderReaction: 'Data Protection Officer: "We cannot accept a 7-day window where revoked users can still query confidential files, nor unmasked PII leaving the country."'
      }
    ]
  },
  {
    id: 'cap-stage-5',
    stageNumber: 5,
    pillarBadge: 'Pillar 5: Architect Leadership & Delivery',
    title: 'Architecture Review Board (ARB), Rollout Strategy & Executive TCO Defense',
    scenarioPrompt: 'You are presenting the final architecture to the Executive Board (CFO, CISO, Head of SRE, VP of Supply Chain). Legacy ERP modules still handle 100% of traffic today, and the CFO challenges your 3-year TCO and migration risk. How do you structure the delivery & governance plan?',
    constraints: [
      'Must avoid the >80% failure rate of Big Bang legacy replacement',
      'Must demonstrate positive 36-month Net ROI with sensitivity protection against 3x traffic growth',
      'Must establish sustainable governance so engineering teams do not drift from the architecture'
    ],
    choices: [
      {
        id: 'c5-optimal',
        label: 'Option A: Phased Strangler Fig Rollout (10% -> 50% -> 100%) + 7-Layer Gatekeeper Fitness Functions + Docs-as-Code ADRs + 36-Month Sensitivity TCO Model',
        architectureSummary: 'Deploy Façade Proxy routing 10% pilot traffic first; enforce the 7-Layer SA Checklist in CI/CD; publish concise ADRs in Git; present a 3-Year TCO model proving 74% token savings via Model Router and zero SAP license penalty.',
        isOptimal: true,
        scoreDelta: { tradeOffMastery: 20, boundaryIntegrity: 20, day2Feasibility: 20, governanceCompliance: 20 },
        monthlyCostUsd: 2400,
        p95LatencyMs: 0,
        riskLevel: 'Low',
        architectFeedback: 'Complete mastery of Pillar 5. By combining incremental Strangler Fig value delivery, automated 7-Layer Gatekeeper checks, crisp ADRs, and a rigorous 3-Year TCO sensitivity model, you aligned technical excellence with executive priorities.',
        stakeholderReaction: 'CEO & CFO: "Unanimously approved. The phased Strangler Fig de-risks go-live, and the 3-year TCO model proves payback in 7.5 months."'
      },
      {
        id: 'c5-big-bang-doc',
        label: 'Option B: 18-Month Big Bang Cutover + 140-Page Static Word Architecture Specification',
        architectureSummary: 'Spend 6 months writing a 140-page specification and cut over 100% of global plants on a single weekend after 18 months of isolated development.',
        isOptimal: false,
        scoreDelta: { tradeOffMastery: 5, boundaryIntegrity: 8, day2Feasibility: 3, governanceCompliance: 7 },
        monthlyCostUsd: 15000,
        p95LatencyMs: 0,
        riskLevel: 'Critical',
        architectFeedback: 'Big Bang cutovers carry an >80% failure rate and deliver zero business value for 18 months, while static 140-page documents become obsolete as soon as implementation begins.',
        stakeholderReaction: 'VP of Business: "We cannot wait 18 months for first value or risk shutting down global plants on a single cutover weekend."'
      }
    ]
  }
];
