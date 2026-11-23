export type LLMProvider = 'openai' | 'gemini' | 'anthropic' | 'custom';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  customBaseUrl?: string;
}

export interface ADREvaluationResult {
  overallScore: number;
  dimensions: {
    tradeOffThinking: number;
    boundaryClarity: number;
    day2Feasibility: number;
    governanceCompliance: number;
  };
  executiveVerdict: 'APPROVED' | 'CONDITIONAL APPROVAL' | 'REJECTED - REWORK REQUIRED';
  strengths: string[];
  blindSpots: string[];
  cxoReactions: {
    cfo: string;
    ciso: string;
    sre: string;
    cdaio: string;
  };
  recommendedImprovements: string;
  evaluatedBy: 'live-llm' | 'heuristic-engine';
}

export interface BoardroomMessage {
  id: string;
  speaker: 'ARCHITECT' | 'CFO' | 'CISO' | 'SRE' | 'CDAIO';
  speakerTitle: string;
  content: string;
  timestamp: string;
  scoreImpact?: number;
}

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  openai: 'gpt-4o-mini',
  gemini: 'gemini-3.8-flash',
  anthropic: 'claude-3-5-sonnet-latest',
  custom: 'gpt-4o-mini'
};

export function getSavedLLMConfig(): LLMConfig {
  try {
    const raw = localStorage.getItem('salab_llm_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        provider: parsed.provider || 'openai',
        apiKey: parsed.apiKey || '',
        model: parsed.model || DEFAULT_MODELS[parsed.provider as LLMProvider] || 'gpt-4o-mini',
        customBaseUrl: parsed.customBaseUrl || 'https://api.openai.com/v1'
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini',
    customBaseUrl: 'https://api.openai.com/v1'
  };
}

export function saveLLMConfig(config: LLMConfig): void {
  try {
    localStorage.setItem('salab_llm_config', JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}

async function callLLMJson(config: LLMConfig, systemPrompt: string, userPrompt: string): Promise<string> {
  const key = config.apiKey.trim();
  if (!key) {
    throw new Error('NO_API_KEY');
  }

  if (config.provider === 'gemini') {
    const primaryModel = config.model.trim() || 'gemini-3.8-flash';
    const chain = Array.from(
      new Set([primaryModel, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'])
    );
    let lastErr = 'Gemini API Error';

    for (const modelName of chain) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(key)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json'
          }
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      }
      const errText = await response.text();
      lastErr = `Gemini API Error (${response.status} on ${modelName}): ${errText.slice(0, 180)}`;
      if (![404, 429, 500, 502, 503, 504].includes(response.status)) {
        break;
      }
    }
    throw new Error(lastErr);
  }

  if (config.provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: config.model.trim() || 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API Error (${response.status}): ${errText.slice(0, 200)}`);
    }
    const data = await response.json();
    return data?.content?.[0]?.text || '{}';
  }

  // OpenAI or Custom OpenAI-compatible endpoint
  const baseUrl = (config.provider === 'custom' && config.customBaseUrl ? config.customBaseUrl : 'https://api.openai.com/v1').replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: config.model.trim() || 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM API Error (${response.status}): ${errText.slice(0, 200)}`);
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '{}';
}

export function evaluateADRHeuristic(adr: {
  title: string;
  context: string;
  consideredOptions: string;
  decisionAndBoundaries: string;
  tradeOffsAndConsequences: string;
  day2OpsAndGovernance: string;
}): ADREvaluationResult {
  const fullText = `${adr.title} ${adr.context} ${adr.consideredOptions} ${adr.decisionAndBoundaries} ${adr.tradeOffsAndConsequences} ${adr.day2OpsAndGovernance}`.toLowerCase();

  let tradeOffScore = 52;
  let boundaryScore = 50;
  let day2Score = 48;
  let govScore = 50;

  const strengths: string[] = [];
  const blindSpots: string[] = [];

  // Check trade-offs & options
  if (adr.consideredOptions.length > 80 && (fullText.includes('vs') || fullText.includes('option') || fullText.includes('alternative'))) {
    tradeOffScore += 22;
    strengths.push('Explicitly evaluates multiple competing architectural alternatives rather than presenting a single bias.');
  } else {
    blindSpots.push('Considered Options section lacks quantitative comparison of at least 2-3 rejected alternatives.');
  }

  if (fullText.includes('latency') || fullText.includes('cost') || fullText.includes('tco') || fullText.includes('consistency')) {
    tradeOffScore += 18;
    strengths.push('Quantifies trade-offs across latency, consistency, and Total Cost of Ownership (TCO).');
  } else {
    blindSpots.push('Missing explicit negative consequences (every architectural choice sacrifices something—state what is sacrificed).');
  }

  // Check boundaries
  if (fullText.includes('boundary') || fullText.includes('gateway') || fullText.includes('mcp') || fullText.includes('cqrs') || fullText.includes('outbox') || fullText.includes('odp')) {
    boundaryScore += 25;
    strengths.push('Defines clear system and data ownership boundaries (e.g., Gateway/CQRS/Outbox/MCP/SAP ODP separation).');
  } else {
    blindSpots.push('System boundaries are vague—clarify what stays out of the API Gateway, how Write/Read stores split, or how MCP scopes tools.');
  }

  if (fullText.includes('idempotency') || fullText.includes('redlock') || fullText.includes('mutex') || fullText.includes('saga') || fullText.includes('hybrid')) {
    boundaryScore += 18;
  }

  // Check Day-2 Ops
  if (fullText.includes('circuit breaker') || fullText.includes('bulkhead') || fullText.includes('fallback') || fullText.includes('dlq') || fullText.includes('strangler')) {
    day2Score += 26;
    strengths.push('Incorporates Day-2 resilience mechanisms (Circuit Breaker, Bulkhead isolation, DLQ replay, or Strangler Fig rollout).');
  } else {
    blindSpots.push('Day-2 Ops vulnerability: Does not specify behavior during downstream hangs (Circuit Breaker), resource starvation (Bulkhead), or rollback.');
  }

  if (fullText.includes('sla') || fullText.includes('rto') || fullText.includes('lag') || fullText.includes('metric') || fullText.includes('ragas')) {
    day2Score += 18;
    strengths.push('Anchors operational feasibility with measurable SLAs, replication lag targets, or RAGAS evaluation thresholds.');
  }

  // Check Governance & Zero Trust
  if (fullText.includes('obo') || fullText.includes('rbac') || fullText.includes('abac') || fullText.includes('trimming') || fullText.includes('entra')) {
    govScore += 24;
    strengths.push('Enforces Zero-Trust identity propagation (Entra ID OBO / RBAC Security Trimming) rather than shared admin credentials.');
  } else {
    blindSpots.push('Zero-Trust gap: Specify how user permissions (RBAC/ABAC/OBO) are enforced across data & AI retrieval.');
  }

  if (fullText.includes('audit') || fullText.includes('worm') || fullText.includes('sovereignty') || fullText.includes('byok') || fullText.includes('pii') || fullText.includes('contract')) {
    govScore += 20;
    strengths.push('Addresses regulatory compliance via Data Contracts, PII tokenization/BYOK, or Immutable Audit Trails.');
  } else {
    blindSpots.push('Governance gap: Missing Immutable Audit Trail (WORM), Data Sovereignty residency rules, or Data Contract enforcement.');
  }

  tradeOffScore = Math.min(98, tradeOffScore);
  boundaryScore = Math.min(98, boundaryScore);
  day2Score = Math.min(98, day2Score);
  govScore = Math.min(98, govScore);

  const overallScore = Math.round((tradeOffScore + boundaryScore + day2Score + govScore) / 4);
  const executiveVerdict =
    overallScore >= 82
      ? 'APPROVED'
      : overallScore >= 65
      ? 'CONDITIONAL APPROVAL'
      : 'REJECTED - REWORK REQUIRED';

  return {
    overallScore,
    dimensions: {
      tradeOffThinking: tradeOffScore,
      boundaryClarity: boundaryScore,
      day2Feasibility: day2Score,
      governanceCompliance: govScore
    },
    executiveVerdict,
    strengths: strengths.length > 0 ? strengths : ['Structured ADR format initiated. Expand technical depth across the 5 pillars.'],
    blindSpots: blindSpots.length > 0 ? blindSpots : ['Consider adding a sensitivity stress-test for 3x traffic growth and token cost spikes.'],
    cxoReactions: {
      cfo:
        tradeOffScore >= 75
          ? 'CFO: "The TCO trade-offs and FinOps routing (SLM vs. Frontier LLM / infrastructure sizing) are well-reasoned and protect our 36-month margin."'
          : 'CFO: "I do not see a clear 3-year TCO comparison or protection against runaway cloud/token OpEx if usage triples."',
      ciso:
        govScore >= 75
          ? 'CISO: "Identity propagation (Entra ID OBO), security trimming, and immutable audit logging meet our Zero-Trust bar."'
          : 'CISO: "How do we guarantee a user cannot retrieve unauthorized SharePoint/SAP records, and where is the immutable WORM audit trail?"',
      sre:
        day2Score >= 75
          ? 'Head of SRE: "Circuit breakers, bulkhead thread isolation, and DLQ recovery give my on-call engineers confidence for Day-2 operations."'
          : 'Head of SRE: "If a partner API hangs for 30s or 100 heavy reports run at once, this design risks cascading thread starvation."',
      cdaio:
        boundaryScore >= 75
          ? 'Chief Data & AI Officer: "Clean boundaries between transactional writes, CQRS/Lakehouse reads, MDM Golden Records, and Hybrid RAG."'
          : 'Chief Data & AI Officer: "Watch out for Technical Code Blindness in pure vector search and ensure SAP extraction uses sanctioned ODP/CDC."'
    },
    recommendedImprovements:
      'Ensure all 7 SA Decision Gatekeeper rules are explicitly addressed: (1) CDN Bypass for dynamic state + Mutex Lock, (2) CQRS for >50:1 Read/Write skew, (3) FE UUID + BE Redlock Idempotency & Orchestration Saga (>4 steps), (4) Circuit Breaker + 80/20 Bulkhead + Strangler Fig, (5) Sanctioned SAP ODP CDC + MDM Golden Record, (6) 75/25 SLM/LLM Model Router + BM25/Vector/Reranker Hybrid RAG, and (7) Entra ID OBO Security Trimming + WORM Audit Log.',
    evaluatedBy: 'heuristic-engine'
  };
}

export async function evaluateADRWithLLM(
  config: LLMConfig,
  adr: {
    title: string;
    context: string;
    consideredOptions: string;
    decisionAndBoundaries: string;
    tradeOffsAndConsequences: string;
    day2OpsAndGovernance: string;
  },
  lang: 'en' | 'vi' = 'en'
): Promise<ADREvaluationResult> {
  if (!config.apiKey.trim()) {
    return evaluateADRHeuristic(adr);
  }

  const langInstruction =
    lang === 'vi'
      ? 'Respond in natural Vietnamese with standard English architecture terms (e.g., Circuit Breaker, Bulkhead, CQRS, Model Router, Hybrid RAG, Entra ID OBO).'
      : 'Respond in crisp executive English.';

  const systemPrompt = `You are an elite Enterprise Architecture Review Board (ARB) panel consisting of a Principal Solution Architect, CFO, CISO, Head of SRE, and Chief Data & AI Officer.
${langInstruction}
Evaluate the submitted Architecture Decision Record (ADR) strictly against the 5 Enterprise Architecture Pillars:
1. Distributed Foundations & Resilience (CDN Bypass for dynamic state, Fat Gateway avoidance, Redis Mutex Lock for Cache Stampede, FE-generated UUID + BE Redlock Idempotency, Orchestration Saga >4 steps + Outbox, 3-state Circuit Breaker 1ms Fail-Fast, 80/20 Bulkhead, Strangler Fig).
2. Enterprise Data (CQRS for >50:1 Read/Write ratio, sanctioned SAP ODP/SLT CDC vs raw BSEG/BKPF triggers, Data Mesh vs Lakehouse, MDM Golden Record, Column Lineage).
3. AI Architecture & FinOps (70-80% SLM / 20-30% Frontier LLM Model Router with Confidence Escalation, Hybrid RAG with BM25 + Vector + Reranker curing Technical Code Blindness, Chip Huyen's "Finetuning for Form, RAG for Facts", Bounded MCP + RAGAS Eval).
4. Zero Trust & Security (Entra ID On-Behalf-Of OBO flow, Hybrid ACL Security Trimming on M365/SharePoint, Data Sovereignty + BYOK, Immutable WORM AI Audit Trail).
5. Architect Delivery (Trade-off honesty, 3-Year TCO sensitivity, actionable Day-2 Ops).

Return ONLY a valid JSON object matching this exact schema:
{
  "overallScore": number (0-100),
  "dimensions": {
    "tradeOffThinking": number (0-100),
    "boundaryClarity": number (0-100),
    "day2Feasibility": number (0-100),
    "governanceCompliance": number (0-100)
  },
  "executiveVerdict": "APPROVED" | "CONDITIONAL APPROVAL" | "REJECTED - REWORK REQUIRED",
  "strengths": ["string", "string", "string"],
  "blindSpots": ["string", "string", "string"],
  "cxoReactions": {
    "cfo": "string",
    "ciso": "string",
    "sre": "string",
    "cdaio": "string"
  },
  "recommendedImprovements": "string"
}`;

  const userPrompt = `Evaluate this ADR submission:
Title: ${adr.title}
Context & Problem: ${adr.context}
Considered Options: ${adr.consideredOptions}
Decision & Design Boundaries: ${adr.decisionAndBoundaries}
Trade-offs & Negative Consequences: ${adr.tradeOffsAndConsequences}
Day-2 Operations, Security & Governance: ${adr.day2OpsAndGovernance}`;

  const rawJson = await callLLMJson(config, systemPrompt, userPrompt);
  const parsed = JSON.parse(rawJson);
  return {
    overallScore: Number(parsed.overallScore) || 75,
    dimensions: {
      tradeOffThinking: Number(parsed.dimensions?.tradeOffThinking) || 75,
      boundaryClarity: Number(parsed.dimensions?.boundaryClarity) || 75,
      day2Feasibility: Number(parsed.dimensions?.day2Feasibility) || 75,
      governanceCompliance: Number(parsed.dimensions?.governanceCompliance) || 75
    },
    executiveVerdict: parsed.executiveVerdict || 'CONDITIONAL APPROVAL',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    blindSpots: Array.isArray(parsed.blindSpots) ? parsed.blindSpots : [],
    cxoReactions: {
      cfo: parsed.cxoReactions?.cfo || 'CFO reviewed TCO implications.',
      ciso: parsed.cxoReactions?.ciso || 'CISO reviewed Zero-Trust boundaries.',
      sre: parsed.cxoReactions?.sre || 'SRE reviewed Day-2 resilience.',
      cdaio: parsed.cxoReactions?.cdaio || 'CDAIO reviewed Data & AI architecture.'
    },
    recommendedImprovements: parsed.recommendedImprovements || '',
    evaluatedBy: 'live-llm'
  };
}

export async function runBoardroomChallenge(
  config: LLMConfig,
  scenarioContext: string,
  history: BoardroomMessage[],
  architectReply: string,
  lang: 'en' | 'vi' = 'en'
): Promise<{
  responses: { speaker: 'CFO' | 'CISO' | 'SRE' | 'CDAIO'; speakerTitle: string; content: string; scoreImpact: number }[];
  usedLiveLLM: boolean;
}> {
  if (config.apiKey.trim()) {
    const langRule =
      lang === 'vi'
        ? 'Write all executive responses in natural Vietnamese while keeping standard English architecture terms.'
        : 'Write all executive responses in English.';
    const systemPrompt = `You are simulating a high-stakes Enterprise Architecture Review Boardroom with 4 executives:
${langRule}
- CFO (Chief Financial Officer - obsessed with 3-Year TCO, SLM vs LLM Token FinOps, SAP licensing penalties, and ROI payback).
- CISO (Chief Information Security Officer - obsessed with Entra ID OBO, M365 SharePoint RBAC/ABAC security trimming, Data Sovereignty, BYOK, and WORM AI Audit Logs).
- SRE (VP of Infrastructure & SRE - obsessed with Cache Stampede Mutex Locks, FE/BE Idempotency Redlock, Circuit Breakers, 80/20 Bulkheads, and Saga DLQ recovery).
- CDAIO (Chief Data & AI Officer - obsessed with CQRS >50:1 skew, SAP ODP CDC, MDM Golden Records, Hybrid BM25+Vector+Reranker RAG, and "Finetuning for Form, RAG for Facts").

Given the scenario, conversation history, and the Architect's latest defense, generate 2 sharp executive responses: one praising or critiquing what the Architect just answered (with a scoreImpact from -10 to +15), and another executive asking the next probing follow-up question.
Return ONLY valid JSON:
{
  "responses": [
    {
      "speaker": "CFO" | "CISO" | "SRE" | "CDAIO",
      "speakerTitle": "string",
      "content": "string",
      "scoreImpact": number
    }
  ]
}`;

    const transcript = history.map((m) => `${m.speaker}: ${m.content}`).join('\n');
    const userPrompt = `Scenario: ${scenarioContext}\n\nTranscript so far:\n${transcript}\n\nArchitect's latest response:\n${architectReply}`;

    const rawJson = await callLLMJson(config, systemPrompt, userPrompt);
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed.responses) && parsed.responses.length > 0) {
      return {
        responses: parsed.responses,
        usedLiveLLM: true
      };
    }
  }

  // Intelligent deterministic fallback when no LLM API key is entered
  const lower = architectReply.toLowerCase();
  const hasStrongKeywords =
    lower.includes('router') ||
    lower.includes('slm') ||
    lower.includes('obo') ||
    lower.includes('trimming') ||
    lower.includes('bulkhead') ||
    lower.includes('circuit breaker') ||
    lower.includes('odp') ||
    lower.includes('cqrs') ||
    lower.includes('mutex') ||
    lower.includes('bm25') ||
    lower.includes('outbox');

  const turnCount = history.filter((m) => m.speaker === 'ARCHITECT').length;
  const followUps: { speaker: 'CFO' | 'CISO' | 'SRE' | 'CDAIO'; speakerTitle: string; content: string; scoreImpact: number }[] = [
    {
      speaker: 'CISO',
      speakerTitle: 'Chief Information Security Officer',
      content: hasStrongKeywords
        ? 'Solid point on architectural boundaries. Now tell me specifically: when an employee is removed from a confidential SharePoint M365 group at 10:00 AM, how does your RAG pipeline prevent them from querying those vector chunks at 10:02 AM without collapsing vector recall?'
        : 'Your defense is too high-level. If you use a shared backend Service Principal to query the Vector DB, any employee can extract Board M&A secrets. How do you enforce user-level M365 RBAC/ABAC and Data Sovereignty?',
      scoreImpact: hasStrongKeywords ? 12 : -5
    },
    {
      speaker: 'SRE',
      speakerTitle: 'VP of Infrastructure & Day-2 Ops',
      content: hasStrongKeywords
        ? 'I like the identity and routing discipline. Next stress test: during our month-end Flash Sale (100x load), 150 accountants simultaneously export 5-year PDF reports while an external payment gateway hangs for 30s, and mobile clients retry failed POSTs on 4G. Walk me through your exact Bulkhead, Circuit Breaker, Mutex Lock, and Idempotency mechanics.'
        : 'Wait—what happens on Day-2 when a hot Redis key expires under 80,000 RPS or 150 accountants run 5-year PDF exports? Without Mutex locks and 80/20 Bulkhead pools, our database and checkout threads will die.',
      scoreImpact: hasStrongKeywords ? 12 : -5
    },
    {
      speaker: 'CDAIO',
      speakerTitle: 'Chief Data & AI Officer',
      content: hasStrongKeywords
        ? 'Strong Day-2 resilience! Now on the Data & AI layer: engineers complain that pure Vector Search fails to find exact SAP error codes like EADDRNOTAVAIL or SKU numbers, and someone proposed weekly LoRA Finetuning to memorize SAP inventory. How do you counter that using Chip Huyen’s Golden Rule, Hybrid Search, and sanctioned SAP CDC?'
        : 'We still have a data problem: our Read/Write ratio is 85:1 on 5-year history, and someone wants to put raw JDBC triggers on SAP BSEG/BKPF tables. How do you fix this with CQRS and compliant SAP CDC?',
      scoreImpact: hasStrongKeywords ? 14 : -4
    },
    {
      speaker: 'CFO',
      speakerTitle: 'Chief Financial Officer',
      content: hasStrongKeywords
        ? 'Impressive command of all 5 pillars. Final board question: summarize how your 75/25 SLM Model Router, Strangler Fig rollout (10% -> 100%), and SAP ODP compliance protect our 36-month TCO if user adoption triples next quarter.'
        : 'Before I sign the budget: if we send 100% of queries to a Frontier LLM or attempt a 2-year Big Bang ERP rewrite, our ROI is negative. Show me the Model Router FinOps split and phased Strangler Fig plan.',
      scoreImpact: hasStrongKeywords ? 15 : -5
    }
  ];

  const chosen = followUps[turnCount % followUps.length];
  return {
    responses: [chosen],
    usedLiveLLM: false
  };
}

export interface TutorChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'live-llm' | 'built-in';
}

async function readSseStream(
  response: Response,
  extractDelta: (jsonChunk: unknown) => string,
  onChunk?: (accumulated: string) => void
): Promise<string> {
  if (!response.body) {
    throw new Error('ReadableStream not supported in this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;

      try {
        const parsed = JSON.parse(payload);
        const delta = extractDelta(parsed);
        if (delta) {
          fullText += delta;
          onChunk?.(fullText);
        }
      } catch {
        // Ignore partial JSON lines
      }
    }
  }

  return fullText;
}

async function callLLMStream(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string,
  onChunk?: (accumulated: string) => void
): Promise<string> {
  const key = config.apiKey.trim();
  if (!key) {
    throw new Error('NO_API_KEY');
  }

  if (config.provider === 'gemini') {
    const primaryModel = config.model.trim() || 'gemini-3.8-flash';
    const staticChain = Array.from(
      new Set([primaryModel, 'gemini-3.8-flash', 'gemini-3.5-flash-lite'])
    ).slice(0, 3);

    const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, { ...init, signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
    };

    const tryGeminiModel = async (
      modelName: string
    ): Promise<{ ok: true; text: string } | { ok: false; status: number; msg: string }> => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(key)}`;

      const sendGemini = (includeThinkingBudget: boolean) =>
        fetchWithTimeout(
          url,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 450,
                ...(includeThinkingBudget ? { thinkingConfig: { thinkingBudget: 0 } } : {})
              }
            })
          },
          8000
        );

      let response: Response;
      try {
        response = await sendGemini(true);
      } catch (err) {
        const isAbort = err instanceof Error && err.name === 'AbortError';
        return {
          ok: false,
          status: 408,
          msg: isAbort ? 'Request timed out (>8s)' : 'Network error'
        };
      }

      if (response.status === 400) {
        const errBody = await response.text();
        if (errBody.toLowerCase().includes('thinking')) {
          response = await sendGemini(false);
        } else {
          return { ok: false, status: 400, msg: errBody.slice(0, 140) };
        }
      }

      if (response.ok) {
        const text = await readSseStream(
          response,
          (chunk) => {
            const c = chunk as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
            return (c?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
          },
          onChunk
        );
        if (text.trim()) {
          return { ok: true, text };
        }
        return { ok: false, status: 500, msg: 'Empty stream response' };
      }

      const errText = await response.text();
      let cleanMsg = errText.slice(0, 120);
      try {
        const parsedErr = JSON.parse(errText);
        if (parsedErr?.error?.message) {
          cleanMsg = parsedErr.error.message;
        }
      } catch {
        // keep slice
      }
      return { ok: false, status: response.status, msg: cleanMsg };
    };

    const errors: string[] = [];
    const tried = new Set<string>();

    for (const modelName of staticChain) {
      tried.add(modelName);
      const res = await tryGeminiModel(modelName);
      if (res.ok) return res.text;
      errors.push(`${modelName} (${res.status}): ${res.msg}`);
      if (![404, 408, 429, 500, 502, 503, 504].includes(res.status)) {
        throw new Error(`Gemini (${res.status} on ${modelName}): ${res.msg}`);
      }
    }

    // Fast 4s ListModels check -> sort newest version first and try top active flash model
    try {
      const listRes = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
        { method: 'GET' },
        4000
      );
      if (listRes.ok) {
        const listData = (await listRes.json()) as {
          models?: { name?: string; supportedGenerationMethods?: string[] }[];
        };
        const getVer = (n: string) => {
          const m = n.match(/gemini-(\d+(?:\.\d+)?)/i);
          return m ? parseFloat(m[1]) : 0;
        };
        const available = (listData.models || [])
          .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m) => (m.name || '').replace(/^models\//, ''))
          .filter(
            (name) =>
              name &&
              !tried.has(name) &&
              getVer(name) >= 2.5 &&
              !name.includes('embedding') &&
              !name.includes('tts') &&
              !name.includes('imagen')
          );

        available.sort((a, b) => {
          const verDiff = getVer(b) - getVer(a);
          if (verDiff !== 0) return verDiff;
          return (a.includes('flash') ? 0 : 1) - (b.includes('flash') ? 0 : 1);
        });

        if (available[0]) {
          const res = await tryGeminiModel(available[0]);
          if (res.ok) return res.text;
          errors.push(`${available[0]} (${res.status})`);
        }
      }
    } catch {
      // ignore discovery timeout/error
    }

    throw new Error(errors.slice(0, 2).join(' | '));
  }

  if (config.provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: config.model.trim() || 'claude-3-5-sonnet-latest',
        max_tokens: 450,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API Error (${response.status}): ${errText.slice(0, 180)}`);
    }
    return readSseStream(
      response,
      (chunk) => {
        const c = chunk as { type?: string; delta?: { text?: string } };
        return c?.type === 'content_block_delta' ? c.delta?.text || '' : '';
      },
      onChunk
    );
  }

  const baseUrl =
    config.provider === 'custom' && config.customBaseUrl?.trim()
      ? config.customBaseUrl.trim().replace(/\/$/, '')
      : 'https://api.openai.com/v1';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: config.model.trim() || 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 450,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI-Compatible API Error (${response.status}): ${errText.slice(0, 180)}`);
  }

  return readSseStream(
    response,
    (chunk) => {
      const c = chunk as { choices?: { delta?: { content?: string } }[] };
      return c?.choices?.[0]?.delta?.content || '';
    },
    onChunk
  );
}

export async function askSaTutor(params: {
  question: string;
  currentTopicContext: string;
  lang: 'en' | 'vi';
  config: LLMConfig;
  onChunk?: (accumulated: string) => void;
}): Promise<{ reply: string; usedLiveLLM: boolean; errorNote?: string }> {
  const { question, currentTopicContext, lang, config, onChunk } = params;

  const systemPrompt =
    lang === 'vi'
      ? `Bạn là Senior Solutions Architect Mentor thân thiện.
Quy tắc bắt buộc:
- Trả lời cực kỳ súc tích, chỉ khoảng 150–200 từ (gạch đầu dòng ngắn gọn, dễ đọc).
- Giải thích đơn giản cho người mới kèm 1 ví dụ đời thường ngắn nếu hỏi về thuật ngữ/cơ chế.
- Chỉ dựa vào ngữ cảnh bài học hiện tại dưới đây:
${currentTopicContext}`
      : `You are a friendly Senior Solutions Architect Mentor.
Strict rules:
- Keep your answer concise at 150–200 words max using crisp bullets.
- Explain clearly for a beginner with a quick real-world analogy when asked about terms or patterns.
- Focus strictly on the current topic context below:
${currentTopicContext}`;

  if (config.apiKey.trim()) {
    try {
      const reply = await callLLMStream(config, systemPrompt, question, onChunk);
      if (reply.trim()) {
        return { reply: reply.trim(), usedLiveLLM: true };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'API error';
      return {
        reply: '',
        usedLiveLLM: false,
        errorNote: msg
      };
    }
  }

  return { reply: '', usedLiveLLM: false };
}

