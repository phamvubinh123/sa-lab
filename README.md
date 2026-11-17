# SA-Lab: Enterprise Architecture & AI Systems Engineering Mastery Workbench

An interactive **Flight Simulator & Mastery Workbench** for Solution Architects (SA) and Enterprise Architects (EA) designed around **Trade-Off Analysis**, **Design Boundaries**, **Day-2 Operational Feasibility**, and **Zero-Trust Governance**.

---

## Core Architecture: The 5 Pillars

1. **Pillar 1: Distributed Foundations, Resilience & Integration**
   - **Edge & API Gateway:** Hybrid Rendering (Static Shell on CDN `<50ms`, Dynamic Inventory/Pricing bypassing CDN to prevent Overselling), Lean HA API Gateway vs. Fat Gateway Anti-Pattern.
   - **Cache-Aside & Stampede Prevention:** Redis In-Memory Cache-Aside with Distributed Mutex Single-Flight Locking and TTL Jitter to prevent Dog-Piling.
   - **Async, Idempotency & Event Patterns:** Golden Rule (*"Front-End MUST Generate `Idempotency-Key` UUID, Back-End MUST Enforce via Redis Redlock / Unique Constraint"*), Kafka Backpressure Buffering (100x Flash Sale), Event Notification vs. Event-Carried State Transfer.
   - **Saga & Transactional Outbox:** Choreography (`<=3` steps) vs. Orchestration State Machine (`>4` steps to avoid *Event Spaghetti*), LIFO Compensating Transactions, and Atomic Outbox + CDC (Debezium).
   - **Resilience & Modernization:** Strangler Fig (`90/10 -> 100%` Façade Proxy vs. `>80%` failure Big Bang Rewrite), 3-State Circuit Breaker (`CLOSED -> OPEN 1ms Fail-Fast -> HALF-OPEN 5%`), and Bulkhead Thread/Pod Isolation (`80%` Sales Checkout / `20%` 5-Year Financial PDF Export).

2. **Pillar 2: Enterprise Data Architecture**
   - **CQRS Pattern:**Triggered when Read/Write ratio exceeds `50:1` (3NF ACID SQL Write DB + Async CDC to Denormalized Elasticsearch Read DB for `<0.5s` 5-year history search).
   - **SAP ERP Real-Time CDC:** Sanctioned SAP ODP / SLT extraction into a Canonical Data Model vs. raw `BSEG`/`BKPF` JDBC triggers (avoiding SAP indirect-access license violations and HANA lock contention).
   - **Data Mesh vs. Lakehouse & MDM:** Unified Delta/Iceberg Lakehouse storage with Federated Computational Governance, Master Data Management (MDM Golden Record survivorship), and End-to-End Column-Level Lineage.

3. **Pillar 3: AI Architecture & Enterprise Integration**
   - **AI Gateway & Semantic Model Router:** Routing `70–80%` simple traffic to Small Language Models (Phi-4 / Llama-3-8B at `1/50th` token cost) and `20–30%` complex reasoning to Frontier LLMs (GPT-4o / Claude) with Confidence-Score Escalation.
   - **Hybrid RAG & Reranking:** Overcoming pure Vector DB *Technical Code Blindness* on exact SKUs and error codes (`EADDRNOTAVAIL`) using **BM25 Keyword Search + HNSW Dense Vector Search + Cross-Encoder Reranker (Top-5)** with 100% source citations.
   - **AI Trade-Off Matrix:** Applying Chip Huyen's Golden Rule (*"Finetuning is for Form, RAG is for Facts"*) across RAG vs. PEFT/LoRA Finetuning vs. 1M+ Long Context Windows.
   - **Agentic AI, MCP & Evaluation:** Bounded workflow state machines, Model Context Protocol (MCP) tool servers with Human-in-the-Loop write gates, Input/Output Guardrails, and automated RAGAS evaluation.

4. **Pillar 4: Security, Compliance & Zero Trust**
   - **Inherited Permissions (M365/SharePoint RBAC/ABAC):** Microsoft Entra ID On-Behalf-Of (OBO) identity propagation and Hybrid Security Trimming (Webhook-synced Index-Time ACL pre-filtering + Query-Time Top-K Graph verification).
   - **Data Sovereignty & Immutable AI Audit Trail:** In-country PII Tokenization Vault, Customer-Managed Keys (BYOK), and Write-Once-Read-Many (WORM) forensic AI audit logs.

5. **Pillar 5: Architect Leadership & Delivery**
   - **7-Layer SA Decision Gatekeeper Checklist**
   - **Docs-as-Code ADR Studio** with automated 4-dimensional scoring
   - **36-Month TCO / FinOps Sensitivity Calculator** (`1x`, `2x`, `3x` traffic & token stress testing)
   - **Live LLM CxO Stakeholder Boardroom Defense** (supports OpenAI, Google Gemini, Anthropic Claude, and Custom OpenAI-compatible API keys)

---

## Running Locally

```bash
npm install
npm run dev
```
