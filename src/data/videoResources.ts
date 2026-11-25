export interface VideoResource {
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  highlightEn: string;
  highlightVi: string;
}

export const getYouTubeWatchUrl = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${youtubeId}`;

export const getYouTubeEmbedUrl = (youtubeId: string, autoplay = true) =>
  `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0${autoplay ? '&autoplay=1' : ''}`;

export const getYouTubeThumbnailUrl = (youtubeId: string) =>
  `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

export const getYouTubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} system design architecture explained`)}`;

/**
 * Curated, verified high-signal YouTube videos for each of the 13 SA-Lab topics.
 */
export const TOPIC_VIDEOS: Record<string, VideoResource[]> = {
  'p1-edge-gateway': [
    {
      youtubeId: 'RqfaTIWc3LQ',
      title: 'Reverse Proxy vs API Gateway vs Load Balancer',
      channel: 'ByteByteGo',
      duration: '5:45',
      highlightEn: 'Visualizes L4/L7 Load Balancers, Reverse Proxies, SSL termination, and API Gateways side-by-side.',
      highlightVi: 'Minh họa trực quan sự khác biệt giữa Load Balancer (L4/L7), Reverse Proxy, SSL Termination và API Gateway.'
    },
    {
      youtubeId: 'PMQdGWt3_L4',
      title: 'CDNs Explained in 6 Minutes | System Design Basics',
      channel: 'System Design Basics',
      duration: '6:12',
      highlightEn: 'Explains Edge POPs, cache-control headers, TTL trade-offs, and cache invalidation.',
      highlightVi: 'Giải thích sâu cách CDN hoạt động tại Edge POPs, HTTP Cache-Control headers, TTL và chiến lược xóa cache.'
    }
  ],
  'p1-cache-stampede': [
    {
      youtubeId: 'wh98s0XhMmQ',
      title: 'Caching Pitfalls Every Developer Should Know',
      channel: 'ByteByteGo',
      duration: '5:20',
      highlightEn: 'Covers Cache Stampede vs Cache Avalanche, hotkey mitigation, and request coalescing.',
      highlightVi: 'Phân tích sâu các bẫy Caching: Cache Stampede vs Cache Avalanche, Hot Key và cách chống sập DB.'
    },
    {
      youtubeId: '6NlVRDhfbwY',
      title: 'Caching Strategies: Write-Through, Write-Back & Cache-Aside',
      channel: 'System Design Series',
      duration: '8:15',
      highlightEn: 'Compares Cache-Aside, Write-Through, and Write-Back with real consistency trade-offs.',
      highlightVi: 'So sánh chi tiết Cache-Aside, Write-Through và Write-Back cùng đánh đổi về độ nhất quán dữ liệu.'
    }
  ],
  'p1-eda-idempotency-saga': [
    {
      youtubeId: '3hdQUcz1CA8',
      title: 'How to Never Silently Lose an Event | Transactional Outbox',
      channel: 'System Design Deep Dive',
      duration: '7:40',
      highlightEn: 'Shows why Dual-Write fails and how Transactional Outbox + CDC guarantees at-least-once delivery.',
      highlightVi: 'Giải thích vì sao Dual-Write bị mất event và cách Transactional Outbox + CDC giải quyết triệt để.'
    },
    {
      youtubeId: '3p8X-i1y43U',
      title: 'Developing Event-Driven, Auto-Compensating Saga Transactions',
      channel: 'Oracle Developers / ByteByteGo',
      duration: '12:30',
      highlightEn: 'Walks through Orchestration vs Choreography Saga and compensating rollbacks.',
      highlightVi: 'Chi tiết cách vận hành Saga Pattern (Orchestration vs Choreography) và cơ chế Compensating Transaction.'
    }
  ],
  'p1-resilience-modernization': [
    {
      youtubeId: 'ADHcBxEXvFA',
      title: 'Circuit Breaker Pattern - Fault Tolerant Microservices',
      channel: 'Tech Primers',
      duration: '9:10',
      highlightEn: 'Explains Closed, Open, and Half-Open states, failure thresholds, and fail-fast fallbacks.',
      highlightVi: 'Giải thích 3 trạng thái Closed / Open / Half-Open của Circuit Breaker và cơ chế Fail-Fast.'
    },
    {
      youtubeId: '7qvPRbFXeTw',
      title: 'How to Migrate a Monolith to Microservices (Strangler Fig)',
      channel: 'System Design Interview',
      duration: '8:45',
      highlightEn: 'Covers Strangler Fig routing, canary cutover, database separation, and Saga.',
      highlightVi: 'Hướng dẫn từng bước chuyển đổi Monolith sang Microservices bằng Strangler Fig Pattern và Canary.'
    }
  ],
  'p2-cqrs-sap-cdc': [
    {
      youtubeId: 'Cf7QL1_6wnk',
      title: 'Saga, CQRS & Event Sourcing Explained',
      channel: 'Interview Prep',
      duration: '9:30',
      highlightEn: 'Breaks down separating Read/Write models (CQRS) and rebuilding projections from event logs.',
      highlightVi: 'Phân tích tách biệt Read/Write model trong CQRS và cách Event Sourcing tái tạo dữ liệu.'
    },
    {
      youtubeId: 'NawsloOoFo0',
      title: 'Data Streaming for Microservices using Debezium (CDC)',
      channel: 'Debezium / Gunnar Morling',
      duration: '18:20',
      highlightEn: 'Deep dive into Change Data Capture (CDC) tailing database transaction logs without polling.',
      highlightVi: 'Giải thích sâu Change Data Capture (CDC) đọc trực tiếp WAL/binlog của DB bằng Debezium.'
    }
  ],
  'p2-mesh-lakehouse-mdm': [
    {
      youtubeId: 'VYmjJe2gR1A',
      title: 'Data Mesh, Data Fabric, Data Lakehouse',
      channel: 'SQLBits / Databricks',
      duration: '40:48',
      highlightEn: 'Compares Data Mesh domain ownership vs unified Data Lakehouse governance.',
      highlightVi: 'So sánh toàn diện kiến trúc Data Mesh (phân quyền theo Domain) và Data Lakehouse.'
    },
    {
      youtubeId: 'Enu-EH7RHHM',
      title: 'Data Lakehouses Explained',
      channel: 'IBM Technology',
      duration: '7:20',
      highlightEn: 'Explains how Lakehouse combines Data Lake flexibility with Data Warehouse ACID governance.',
      highlightVi: 'Giải thích cách Data Lakehouse kết hợp sự linh hoạt của Data Lake và chuẩn ACID của Data Warehouse.'
    }
  ],
  'p3-model-router-rag': [
    {
      youtubeId: 'qppV3n3YlF8',
      title: 'RAG Explained (Retrieval-Augmented Generation)',
      channel: 'IBM Technology',
      duration: '6:50',
      highlightEn: 'Clear whiteboard breakdown of embeddings, vector retrieval, grounding, and reducing hallucinations.',
      highlightVi: 'Giải thích trực quan quy trình RAG: Embeddings, Vector Retrieval và cách giảm ảo giác (Hallucination).'
    },
    {
      youtubeId: 'HREbdmOSQ18',
      title: 'Retrieval Augmented Generation (RAG) Explained in 8 Minutes!',
      channel: 'AI Engineering Visuals',
      duration: '8:10',
      highlightEn: 'Visualizes chunking, vector databases, reranking, and prompt augmentation.',
      highlightVi: 'Minh họa chi tiết Chunking, Vector DB, Reranking và cách ghép ngữ cảnh vào Prompt.'
    }
  ],
  'p3-agentic-mcp-guardrails': [
    {
      youtubeId: 'VChRPFUzJGA',
      title: 'Model Context Protocol (MCP): The Key To Agentic AI',
      channel: 'AI Engineer',
      duration: '15:40',
      highlightEn: 'Explains how MCP standardizes tool calling and context exchange between AI agents and enterprise systems.',
      highlightVi: 'Giải thích chuẩn Model Context Protocol (MCP) giúp AI Agent kết nối an toàn với công cụ & dữ liệu doanh nghiệp.'
    },
    {
      youtubeId: 'FtCGEbIr59o',
      title: 'Model Context Protocol (MCP) Explained for Beginners',
      channel: 'KodeKloud',
      duration: '24:10',
      highlightEn: 'Hands-on walkthrough of MCP Clients, MCP Servers, Tools, and Resources.',
      highlightVi: 'Hướng dẫn dễ hiểu kiến trúc MCP Client/Server, Tools và Resources với ví dụ thực tế.'
    }
  ],
  'p3-ai-gateway-cache-fallback': [
    {
      youtubeId: '1JutaOt3qYA',
      title: 'Semantic Caching Explained for LLMs in 4 Minutes',
      channel: 'AI Architecture',
      duration: '4:15',
      highlightEn: 'Shows how vector similarity caching cuts LLM token costs and latency without exact string matching.',
      highlightVi: 'Giải thích cách Semantic Caching dùng vector tương đồng ngữ nghĩa để giảm chi phí token và độ trễ LLM.'
    },
    {
      youtubeId: 'h7GWy_tzErY',
      title: 'What is an AI Gateway? AI Gateways Explained',
      channel: 'Cloud & AI Architecture',
      duration: '6:30',
      highlightEn: 'Covers centralized API key vaulting, token rate limits, failover routing, and budget caps.',
      highlightVi: 'Phân tích vai trò của AI Gateway: quản lý API key tập trung, giới hạn token, failover và kiểm soát ngân sách.'
    }
  ],
  'p4-m365-rbac-zero-trust': [
    {
      youtubeId: 'lT11tGaEC3s',
      title: 'Why Implement Zero Trust',
      channel: 'IBM Technology',
      duration: '7:45',
      highlightEn: 'Explains "Never Trust, Always Verify", microsegmentation, and identity-first security.',
      highlightVi: 'Giải thích triết lý Zero Trust ("Never Trust, Always Verify"), phân mảnh mạng và bảo mật theo danh tính.'
    },
    {
      youtubeId: 'ZuQoN2x8T6k',
      title: 'Introduction to OAuth 2.0 and OpenID Connect',
      channel: 'Philippe De Ryck',
      duration: '14:20',
      highlightEn: 'Deep dive into OAuth 2.0 Authorization Code flow, OIDC ID tokens, and RBAC scopes.',
      highlightVi: 'Chi tiết luồng OAuth 2.0, OpenID Connect (OIDC), JWT token và phân quyền RBAC.'
    }
  ],
  'p4-sovereignty-audit-trail': [
    {
      youtubeId: 'gkra2jltpkA',
      title: 'Data Sovereignty vs Data Residency Explained',
      channel: 'Cloud Compliance',
      duration: '6:40',
      highlightEn: 'Clarifies legal jurisdiction (Sovereignty) vs physical storage location (Residency) and compliance.',
      highlightVi: 'Phân biệt rõ Data Sovereignty (chủ quyền pháp lý) và Data Residency (nơi lưu trữ vật lý).'
    },
    {
      youtubeId: 'bFQqTnhJ7UQ',
      title: 'What Is Data Sovereignty? Why It Matters',
      channel: 'Enterprise Security',
      duration: '8:05',
      highlightEn: 'Covers cross-border data governance, vendor lock-in, and immutable audit requirements.',
      highlightVi: 'Phân tích rủi ro pháp lý xuyên biên giới và yêu cầu nhật ký kiểm toán bất biến (Immutable Audit).'
    }
  ],
  'p5-gatekeeper-adr-tco': [
    {
      youtubeId: '6H6zfCNeqek',
      title: 'Architecture Decision Records (ADR) as a LOG that answers "WHY?"',
      channel: 'Healthy Developer',
      duration: '7:15',
      highlightEn: 'Explains how ADRs capture context, trade-offs, and consequences for future engineering teams.',
      highlightVi: 'Giải thích cách viết ADR để lưu lại bối cảnh, các phương án đánh đổi và lý do chọn kiến trúc.'
    },
    {
      youtubeId: 'nH4qjmP2KEE',
      title: 'Top 7 Most-Used Distributed System Patterns',
      channel: 'ByteByteGo',
      duration: '6:55',
      highlightEn: 'Great synthesis of trade-offs across distributed patterns for executive architecture reviews.',
      highlightVi: 'Tổng hợp 7 pattern phân tán phổ biến nhất và các đánh đổi khi trình bày trước hội đồng kiến trúc.'
    }
  ],
  'p5-finops-monolith-egress': [
    {
      youtubeId: 'W923lzSMKDU',
      title: 'FinOps: A new path to cloud-cost optimization',
      channel: 'IBM Technology',
      duration: '6:20',
      highlightEn: 'Introduces FinOps principles: cloud cost visibility, chargeback/showback, and engineering accountability.',
      highlightVi: 'Giới thiệu khung FinOps: minh bạch chi phí cloud, tối ưu tài nguyên và trách nhiệm tài chính kỹ thuật.'
    },
    {
      youtubeId: '3fwRmW8pgWU',
      title: 'Monoliths vs Microservices | Explained in 5 Minutes',
      channel: 'System Design',
      duration: '5:10',
      highlightEn: 'Explains when a Modular Monolith beats Microservices on TCO, latency, and operational cost.',
      highlightVi: 'So sánh Monolith vs Microservices dưới góc độ chi phí vận hành, độ phức tạp và thời điểm nên chuyển đổi.'
    }
  ]
};

/**
 * Direct mapping from lowercase glossary terms to a verified deep-dive YouTube video.
 */
export const TERM_VIDEO_MAP: Record<string, VideoResource> = {
  cdn: TOPIC_VIDEOS['p1-edge-gateway'][1],
  nlb: TOPIC_VIDEOS['p1-edge-gateway'][0],
  l4: TOPIC_VIDEOS['p1-edge-gateway'][0],
  l7: TOPIC_VIDEOS['p1-edge-gateway'][0],
  'multi-az': TOPIC_VIDEOS['p1-edge-gateway'][0],
  'cache-aside': TOPIC_VIDEOS['p1-cache-stampede'][1],
  'cache stampede': TOPIC_VIDEOS['p1-cache-stampede'][0],
  mutex: TOPIC_VIDEOS['p1-cache-stampede'][0],
  'transactional outbox': TOPIC_VIDEOS['p1-eda-idempotency-saga'][0],
  outbox: TOPIC_VIDEOS['p1-eda-idempotency-saga'][0],
  saga: TOPIC_VIDEOS['p1-eda-idempotency-saga'][1],
  idempotency: TOPIC_VIDEOS['p1-eda-idempotency-saga'][0],
  'circuit breaker': TOPIC_VIDEOS['p1-resilience-modernization'][0],
  bulkhead: TOPIC_VIDEOS['p1-resilience-modernization'][0],
  'strangler fig': TOPIC_VIDEOS['p1-resilience-modernization'][1],
  cqrs: TOPIC_VIDEOS['p2-cqrs-sap-cdc'][0],
  'event sourcing': TOPIC_VIDEOS['p2-cqrs-sap-cdc'][0],
  cdc: TOPIC_VIDEOS['p2-cqrs-sap-cdc'][1],
  'data mesh': TOPIC_VIDEOS['p2-mesh-lakehouse-mdm'][0],
  'data lakehouse': TOPIC_VIDEOS['p2-mesh-lakehouse-mdm'][1],
  rag: TOPIC_VIDEOS['p3-model-router-rag'][0],
  'vector db': TOPIC_VIDEOS['p3-model-router-rag'][1],
  mcp: TOPIC_VIDEOS['p3-agentic-mcp-guardrails'][0],
  'semantic cache': TOPIC_VIDEOS['p3-ai-gateway-cache-fallback'][0],
  'ai gateway': TOPIC_VIDEOS['p3-ai-gateway-cache-fallback'][1],
  'zero trust': TOPIC_VIDEOS['p4-m365-rbac-zero-trust'][0],
  oauth2: TOPIC_VIDEOS['p4-m365-rbac-zero-trust'][1],
  oidc: TOPIC_VIDEOS['p4-m365-rbac-zero-trust'][1],
  rbac: TOPIC_VIDEOS['p4-m365-rbac-zero-trust'][1],
  'data sovereignty': TOPIC_VIDEOS['p4-sovereignty-audit-trail'][0],
  adr: TOPIC_VIDEOS['p5-gatekeeper-adr-tco'][0],
  finops: TOPIC_VIDEOS['p5-finops-monolith-egress'][0],
  monolith: TOPIC_VIDEOS['p5-finops-monolith-egress'][1]
};
