export interface GlossaryEntry {
  term: string;
  fullName: string;
  explanation: string;
  caseSensitive?: boolean;
}

export const SA_GLOSSARY: GlossaryEntry[] = [
  // Pillar 1: Edge, Gateway, Caching, Resilience, Distributed Transactions
  {
    term: 'CDN',
    fullName: 'Content Delivery Network',
    explanation: 'Mạng phân phối nội dung đặt tại các điểm biên (Edge POPs) gần người dùng để cache tài nguyên tĩnh (HTML/JS/CSS, ảnh) dưới 50ms. Không dùng để cache tồn kho hoặc dữ liệu biến động theo thời gian thực.',
    caseSensitive: true
  },
  {
    term: 'Multi-AZ',
    fullName: 'Multi-Availability Zone',
    explanation: 'Kiến trúc triển khai hệ thống trải đều trên nhiều vùng vật lý độc lập (Availability Zones) trong cùng một Region để đảm bảo không sập khi một trung tâm dữ liệu gặp sự cố.'
  },
  {
    term: 'NLB',
    fullName: 'Network Load Balancer (Layer 4)',
    explanation: 'Bộ cân bằng tải tầng mạng (L4 TCP/UDP), định tuyến hàng triệu kết nối mỗi giây với độ trễ cực thấp trước khi đưa vào API Gateway.',
    caseSensitive: true
  },
  {
    term: 'HA',
    fullName: 'High Availability',
    explanation: 'Tính sẵn sàng cao — khả năng hệ thống tiếp tục hoạt động liên tục (thường đạt 99.95%–99.99%) ngay cả khi một phần hạ tầng hoặc node bị lỗi.',
    caseSensitive: true
  },
  {
    term: 'L4',
    fullName: 'Layer 4 (Transport Layer)',
    explanation: 'Tầng giao vận (TCP/UDP) trong mô hình OSI — cân bằng tải dựa trên IP và Port mà không cần giải mã nội dung HTTP.',
    caseSensitive: true
  },
  {
    term: 'L7',
    fullName: 'Layer 7 (Application Layer)',
    explanation: 'Tầng ứng dụng (HTTP/HTTPS/gRPC) — cho phép API Gateway đọc URL path, header, JWT token để xác thực và định tuyến thông minh.',
    caseSensitive: true
  },
  {
    term: 'Cache-Aside',
    fullName: 'Lazy-Loading Cache Pattern',
    explanation: 'Mẫu thiết kế cache: ứng dụng kiểm tra Redis trước; nếu miss mới đọc DB rồi ghi ngược lại vào Redis.'
  },
  {
    term: 'Cache Stampede',
    fullName: 'Thundering Herd / Dog-piling',
    explanation: 'Hiện tượng hàng chục nghìn request cùng lúc bị cache miss khi một hot key hết hạn, đồng loạt đâm thẳng xuống DB gây sập hệ thống.'
  },
  {
    term: 'Mutex',
    fullName: 'Mutual Exclusion Lock',
    explanation: 'Khóa loại trừ lẫn nhau (Single-Flight): chỉ cho phép 1 request duy nhất xuống DB tái tạo cache khi key hết hạn, các request khác chờ đọc kết quả.'
  },
  {
    term: 'Idempotency',
    fullName: 'Tính lũy đẳng (Idempotent Operation)',
    explanation: 'Đảm bảo một thao tác (như POST thanh toán) dù bị gọi lặp lại nhiều lần do mạng chập chờn vẫn chỉ thực thi đúng 1 lần duy nhất.'
  },
  {
    term: 'UUID',
    fullName: 'Universally Unique Identifier',
    explanation: 'Mã định danh duy nhất toàn cầu (128-bit) do Frontend sinh ra cho mỗi lượt bấm thanh toán làm Idempotency Key.',
    caseSensitive: true
  },
  {
    term: 'Redlock',
    fullName: 'Redis Distributed Lock',
    explanation: 'Thuật toán khóa phân tán trên cụm Redis giúp Backend kiểm tra và chặn các request trùng lặp trong môi trường nhiều server.'
  },
  {
    term: 'Saga',
    fullName: 'Saga Distributed Transaction Pattern',
    explanation: 'Mẫu quản lý giao dịch phân tán qua nhiều microservice bằng chuỗi các bước cục bộ; nếu 1 bước lỗi sẽ chạy các bước bù trừ (Compensating Transaction) để hoàn tác.'
  },
  {
    term: 'LIFO',
    fullName: 'Last-In, First-Out',
    explanation: 'Vào sau ra trước — thứ tự hoàn tác (rollback) chuẩn trong Orchestration Saga khi bước sau thất bại.',
    caseSensitive: true
  },
  {
    term: 'Transactional Outbox',
    fullName: 'Transactional Outbox Pattern',
    explanation: 'Ghi dữ liệu nghiệp vụ và sự kiện vào bảng Outbox trong cùng 1 ACID transaction của DB, sau đó dùng CDC đẩy ra Kafka/RabbitMQ để tránh lỗi Dual-Write mất event.'
  },
  {
    term: 'Outbox',
    fullName: 'Transactional Outbox Table',
    explanation: 'Bảng trung gian trong cùng DB nghiệp vụ dùng để lưu tạm event trước khi CDC/Relay đẩy sang Message Broker, đảm bảo không mất dữ liệu.'
  },
  {
    term: 'DLQ',
    fullName: 'Dead Letter Queue',
    explanation: 'Hàng đợi chứa các message xử lý thất bại nhiều lần để kỹ sư kiểm tra và xử lý lại mà không làm nghẽn luồng chính.',
    caseSensitive: true
  },
  {
    term: 'Circuit Breaker',
    fullName: 'Mẫu Cầu dao Ngắt mạch',
    explanation: 'Tự động ngắt kết nối (trạng thái OPEN) khi dịch vụ đối tác bị treo hoặc lỗi quá ngưỡng, giúp Fail-Fast trong ~1ms thay vì treo toàn bộ thread pool.'
  },
  {
    term: 'Bulkhead',
    fullName: 'Bulkhead Isolation Pattern',
    explanation: 'Mẫu vách ngăn tàu thủy: chia tách thread pool / connection pool theo từng nhóm nghiệp vụ (vd: 80% Checkout / 20% PDF) để một luồng nặng không kéo sập toàn hệ thống.'
  },
  {
    term: 'Strangler Fig',
    fullName: 'Strangler Fig Migration Pattern',
    explanation: 'Chiến lược hiện đại hóa hệ thống cũ (Monolith) bằng cách bọc lớp định tuyến bên ngoài và chuyển dần từng tính năng sang Microservice mới (10% → 90% → 100%).'
  },

  // Pillar 2: Enterprise Data
  {
    term: 'CQRS',
    fullName: 'Command Query Responsibility Segregation',
    explanation: 'Tách riêng mô hình/CSDL Ghi (Command - SQL 3NF) và Đọc (Query - Elasticsearch/Read Replica) khi tỷ lệ Đọc/Ghi lệch > 50:1.',
    caseSensitive: true
  },
  {
    term: '3NF',
    fullName: 'Third Normal Form',
    explanation: 'Dạng chuẩn 3 trong thiết kế cơ sở dữ liệu quan hệ, giúp tối ưu cho việc ghi (INSERT/UPDATE) và tránh dư thừa, sai lệch dữ liệu.',
    caseSensitive: true
  },
  {
    term: 'ACID',
    fullName: 'Atomicity, Consistency, Isolation, Durability',
    explanation: '4 tính chất đảm bảo giao dịch cơ sở dữ liệu an toàn tuyệt đối (hoặc thành công trọn vẹn, hoặc rollback hoàn toàn).',
    caseSensitive: true
  },
  {
    term: 'CDC',
    fullName: 'Change Data Capture',
    explanation: 'Kỹ thuật bắt mọi thay đổi (Insert/Update/Delete) từ transaction log của DB theo thời gian gần thực để đồng bộ sang Read DB hoặc Data Lake mà không làm chậm DB chính.',
    caseSensitive: true
  },
  {
    term: 'ODP',
    fullName: 'Operational Data Provisioning (SAP)',
    explanation: 'Giao thức trích xuất dữ liệu chuẩn được SAP chứng nhận và hỗ trợ bản quyền, dùng để lấy dữ liệu an toàn từ SAP S/4HANA.',
    caseSensitive: true
  },
  {
    term: 'SLT',
    fullName: 'SAP Landscape Transformation Replication Server',
    explanation: 'Công cụ CDC thời gian thực chính thức của SAP giúp đồng bộ dữ liệu sang hệ thống ngoài mà không vi phạm license hay làm hỏng khi nâng cấp.',
    caseSensitive: true
  },
  {
    term: 'BSEG',
    fullName: 'SAP Accounting Document Segment Table',
    explanation: 'Bảng lõi khổng lồ lưu chi tiết bút toán kế toán trong SAP; gắn raw trigger trực tiếp lên bảng này gây khóa bảng và vi phạm bản quyền SAP.',
    caseSensitive: true
  },
  {
    term: 'BKPF',
    fullName: 'SAP Accounting Document Header Table',
    explanation: 'Bảng header chứng từ kế toán lõi trong SAP; không được truy vấn/gắn trigger thô trực tiếp từ bên ngoài.',
    caseSensitive: true
  },
  {
    term: 'Data Mesh',
    fullName: 'Kiến trúc Lưới dữ liệu phi tập trung',
    explanation: 'Trao quyền sở hữu dữ liệu (Data-as-a-Product) cho từng domain nghiệp vụ (Sales, Finance, HR) thay vì dồn hết vào 1 team Data tập trung gây nghẽn cổ chai.'
  },
  {
    term: 'Lakehouse',
    fullName: 'Data Lake + Data Warehouse',
    explanation: 'Kiến trúc kết hợp khả năng lưu trữ giá rẻ mọi định dạng của Data Lake với khả năng truy vấn ACID, quản trị schema của Data Warehouse.'
  },
  {
    term: 'MDM',
    fullName: 'Master Data Management',
    explanation: 'Hệ thống quản lý dữ liệu chủ (Khách hàng, Sản phẩm, Nhà cung cấp) nhằm hợp nhất dữ liệu từ nhiều nguồn thành một bản ghi chuẩn duy nhất.',
    caseSensitive: true
  },
  {
    term: 'Golden Record',
    fullName: 'Single Source of Truth Record',
    explanation: 'Bản ghi dữ liệu chuẩn xác và đáng tin cậy nhất của một thực thể (vd: 1 khách hàng) sau khi đã làm sạch và đối soát từ SAP, CRM, ERP.'
  },

  // Pillar 3: AI Architecture
  {
    term: 'SLM',
    fullName: 'Small Language Model (vd: Phi-4, Llama-3-8B)',
    explanation: 'Mô hình ngôn ngữ cỡ nhỏ, chạy nhanh và rẻ hơn ~50 lần so với Frontier LLM; phù hợp xử lý 70–80% tác vụ đơn giản như phân loại, tóm tắt, trích xuất.',
    caseSensitive: true
  },
  {
    term: 'LLM',
    fullName: 'Large Language Model (Frontier Models)',
    explanation: 'Mô hình ngôn ngữ lớn (vd: GPT-4o, Claude 3.5/3.7, Gemini Pro) có năng lực suy luận sâu nhưng chi phí token cao, nên chỉ route 20–30% câu hỏi phức tạp.',
    caseSensitive: true
  },
  {
    term: 'RAG',
    fullName: 'Retrieval-Augmented Generation',
    explanation: 'Kỹ thuật truy xuất tài liệu thực tế của doanh nghiệp rồi đưa vào prompt cho LLM trả lời, giúp giảm ảo giác (hallucination) và có trích dẫn nguồn.',
    caseSensitive: true
  },
  {
    term: 'BM25',
    fullName: 'Best Matching 25 (Lexical / Keyword Search)',
    explanation: 'Thuật toán tìm kiếm từ khóa kinh điển (như trong Elasticsearch), cực kỳ chính xác khi tìm mã SKU, mã lỗi kỹ thuật (vd: EADDRNOTAVAIL) hoặc số hợp đồng.',
    caseSensitive: true
  },
  {
    term: 'HNSW',
    fullName: 'Hierarchical Navigable Small World',
    explanation: 'Thuật toán lập chỉ mục vector phổ biến cho tìm kiếm ngữ nghĩa (Vector Search), nhanh nhưng dễ bị "mù" với các mã kỹ thuật chính xác.',
    caseSensitive: true
  },
  {
    term: 'Reranker',
    fullName: 'Cross-Encoder Reranking Model',
    explanation: 'Mô hình chấm điểm lại Top-K đoạn văn bản sau khi tìm kiếm Hybrid (BM25 + Vector) để đưa đúng đoạn chính xác nhất lên đầu cho LLM.'
  },
  {
    term: 'LoRA',
    fullName: 'Low-Rank Adaptation',
    explanation: 'Kỹ thuật tinh chỉnh (Fine-tuning) LLM tiết kiệm tài nguyên — chỉ nên dùng để dạy "Form" (văn phong, định dạng JSON), không dùng để nhồi "Facts" (dữ liệu thay đổi hàng ngày).',
    caseSensitive: true
  },
  {
    term: 'MCP',
    fullName: 'Model Context Protocol',
    explanation: 'Giao thức chuẩn hóa cách AI Agent kết nối an toàn tới các công cụ, API và nguồn dữ liệu doanh nghiệp mà không cần viết code tích hợp rời rạc.',
    caseSensitive: true
  },
  {
    term: 'Guardrails',
    fullName: 'AI Safety & Policy Guardrails',
    explanation: 'Lớp kiểm duyệt đầu vào/đầu ra của AI giúp chặn Prompt Injection, che giấu dữ liệu nhạy cảm (PII) và giới hạn chi phí/vòng lặp Agent.'
  },
  {
    term: 'RAGAS',
    fullName: 'Retrieval Augmented Generation Assessment',
    explanation: 'Bộ framework đánh giá chất lượng hệ thống RAG tự động qua các chỉ số: Faithfulness (trung thực), Answer Relevance và Context Precision.',
    caseSensitive: true
  },

  // Pillar 4: Security & Compliance
  {
    term: 'Zero Trust',
    fullName: 'Zero Trust Security Architecture',
    explanation: 'Nguyên tắc bảo mật "Không tin cậy mặc định bất kỳ ai": luôn xác thực danh tính, kiểm tra quyền hạn theo từng request ngay cả trong mạng nội bộ.'
  },
  {
    term: 'Zero-Trust',
    fullName: 'Zero Trust Security Architecture',
    explanation: 'Nguyên tắc bảo mật "Không tin cậy mặc định bất kỳ ai": luôn xác thực danh tính, kiểm tra quyền hạn theo từng request ngay cả trong mạng nội bộ.'
  },
  {
    term: 'RBAC',
    fullName: 'Role-Based Access Control',
    explanation: 'Phân quyền truy cập dựa trên vai trò (vd: Admin, Kế toán, Nhân viên) — đảm bảo AI RAG không trả về tài liệu vượt quá quyền của người hỏi.',
    caseSensitive: true
  },
  {
    term: 'ABAC',
    fullName: 'Attribute-Based Access Control',
    explanation: 'Phân quyền dựa trên thuộc tính chi tiết (phòng ban, cấp bậc, địa điểm, độ mật tài liệu) linh hoạt hơn RBAC.',
    caseSensitive: true
  },
  {
    term: 'OBO',
    fullName: 'On-Behalf-Of Flow (OAuth 2.0 / Entra ID)',
    explanation: 'Luồng ủy quyền cho phép Backend dùng danh tính thực của người dùng đang đăng nhập để truy vấn dữ liệu thay vì dùng 1 tài khoản Admin dùng chung.',
    caseSensitive: true
  },
  {
    term: 'ACL',
    fullName: 'Access Control List',
    explanation: 'Danh sách kiểm soát quyền truy cập gắn trên từng file/folder (SharePoint/M365) quy định ai được phép xem hoặc chỉnh sửa.',
    caseSensitive: true
  },
  {
    term: 'PII',
    fullName: 'Personally Identifiable Information',
    explanation: 'Thông tin định danh cá nhân (CCCD, số điện thoại, lương, email) bắt buộc phải phát hiện và che (redact) trước khi gửi lên LLM.',
    caseSensitive: true
  },
  {
    term: 'BYOK',
    fullName: 'Bring Your Own Key',
    explanation: 'Doanh nghiệp tự nắm giữ và quản lý khóa mã hóa (KMS/HSM) dữ liệu của mình trên Cloud, có quyền thu hồi khóa bất cứ lúc nào.',
    caseSensitive: true
  },
  {
    term: 'WORM',
    fullName: 'Write Once, Read Many',
    explanation: 'Cơ chế lưu trữ bất biến (không thể sửa hay xóa) dùng cho Audit Log của AI nhằm đáp ứng kiểm toán và tuân thủ pháp lý.',
    caseSensitive: true
  },

  // Pillar 5 & Metrics / FinOps
  {
    term: 'ADR',
    fullName: 'Architecture Decision Record',
    explanation: 'Tài liệu ngắn gọn ghi lại bối cảnh, các phương án đã cân nhắc, quyết định được chọn và hệ quả đánh đổi (Docs-as-Code trong Git).',
    caseSensitive: true
  },
  {
    term: 'TCO',
    fullName: 'Total Cost of Ownership',
    explanation: 'Tổng chi phí sở hữu hệ thống trong 36 tháng (bao gồm hạ tầng, token AI, license, nhân sự vận hành Day-2 và chi phí bảo trì).',
    caseSensitive: true
  },
  {
    term: 'ROI',
    fullName: 'Return on Investment',
    explanation: 'Tỷ suất hoàn vốn đầu tư — thước đo hiệu quả kinh doanh giúp SA bảo vệ đề xuất kiến trúc trước CFO/CEO.',
    caseSensitive: true
  },
  {
    term: 'FinOps',
    fullName: 'Cloud & AI Financial Operations',
    explanation: 'Kỷ luật quản trị tài chính trên Cloud/AI giúp tối ưu chi phí hạ tầng và token LLM gắn liền với giá trị kinh doanh.'
  },
  {
    term: 'SLA',
    fullName: 'Service Level Agreement',
    explanation: 'Cam kết chất lượng dịch vụ chính thức với khách hàng/nội bộ (vd: Uptime 99.95%), nếu vi phạm sẽ bị phạt hoặc mất uy tín.',
    caseSensitive: true
  },
  {
    term: 'SLO',
    fullName: 'Service Level Objective',
    explanation: 'Mục tiêu độ tin cậy nội bộ mà team kỹ thuật đặt ra (thường chặt hơn SLA) để có vùng đệm xử lý trước khi vi phạm SLA.',
    caseSensitive: true
  },
  {
    term: 'SLI',
    fullName: 'Service Level Indicator',
    explanation: 'Chỉ số đo lường thực tế (vd: tỷ lệ lỗi 5xx, độ trễ P99) dùng để kiểm chứng hệ thống có đạt SLO hay không.',
    caseSensitive: true
  },
  {
    term: 'P95',
    fullName: '95th Percentile Latency',
    explanation: 'Ngưỡng độ trễ mà 95% request hoàn thành nhanh hơn mức đó — phản ánh trải nghiệm thực tế tốt hơn chỉ số trung bình (Average).',
    caseSensitive: true
  },
  {
    term: 'P99',
    fullName: '99th Percentile Latency (Tail Latency)',
    explanation: 'Ngưỡng độ trễ của 1% request chậm nhất — cực kỳ quan trọng trong hệ thống tài chính/checkout vì tail latency cao dễ gây timeout dây chuyền.',
    caseSensitive: true
  },
  {
    term: 'RPS',
    fullName: 'Requests Per Second',
    explanation: 'Số lượng yêu cầu (request) gửi tới hệ thống trong mỗi giây — thước đo tải trọng khi Flash Sale hoặc cao điểm.',
    caseSensitive: true
  },
  {
    term: 'OPEX',
    fullName: 'Operating Expenditure',
    explanation: 'Chi phí vận hành định kỳ hàng tháng (Cloud, API Token, License SaaS, bảo trì).',
    caseSensitive: true
  },
  {
    term: 'RTO',
    fullName: 'Recovery Time Objective',
    explanation: 'Thời gian tối đa cho phép để khôi phục hệ thống hoạt động trở lại sau sự cố.',
    caseSensitive: true
  },
  {
    term: 'RPO',
    fullName: 'Recovery Point Objective',
    explanation: 'Lượng dữ liệu tối đa chấp nhận bị mất (tính theo thời gian, vd: 5 phút) khi xảy ra thảm họa.',
    caseSensitive: true
  },
  {
    term: 'Semantic Cache',
    fullName: 'Vector Similarity Response Cache',
    explanation: 'Bộ nhớ đệm lưu câu trả lời LLM theo độ tương đồng ngữ nghĩa (cosine > 0.92). Bắt buộc gắn User RBAC Group Hash vào cache key để tránh lộ dữ liệu giữa các cấp quyền.'
  },
  {
    term: 'TPM',
    fullName: 'Tokens Per Minute',
    explanation: 'Hạn mức số token tối đa được gọi trong mỗi phút của nhà cung cấp LLM; vượt ngưỡng này sẽ bị trả lỗi HTTP 429 Rate Limit.',
    caseSensitive: true
  },
  {
    term: 'RPM',
    fullName: 'Requests Per Minute',
    explanation: 'Hạn mức số request tối đa mỗi phút tới API LLM.',
    caseSensitive: true
  },
  {
    term: 'Modular Monolith',
    fullName: 'Kiến trúc Nguyên khối Phân module Rõ ràng',
    explanation: 'Triển khai chung 1 tiến trình ($0 phí network nội bộ) nhưng tách ranh giới code chặt chẽ theo domain; lý tưởng cho đội ngũ <30 kỹ sư trước khi cần tách Microservices.'
  },
  {
    term: 'Data Egress',
    fullName: 'Cloud Outbound / Cross-AZ Data Transfer Cost',
    explanation: 'Chi phí truyền dữ liệu ra ngoài Internet, giữa các Region hoặc giữa các Availability Zone (Cross-AZ) — thường âm thầm chiếm 30–40% hóa đơn Cloud.'
  },
  {
    term: 'NAT Gateway',
    fullName: 'Network Address Translation Gateway',
    explanation: 'Cổng cho phép server trong mạng riêng đi ra Internet/API ngoài; đẩy lưu lượng lớn tới S3/Blob qua NAT Gateway rất tốn tiền thay vì dùng VPC Endpoint miễn phí.'
  },
  {
    term: 'VPC Endpoint',
    fullName: 'Private Cloud Storage/Service Endpoint',
    explanation: 'Đường kết nối nội bộ trực tiếp tới Object Storage (S3/Blob) trong cùng Region mà không đi qua NAT Gateway hay Internet, tiết kiệm đáng kể chi phí Data Egress.'
  },
  // PMI-CPMAI Full AI Lifecycle Terms
  {
    term: 'CPMAI',
    fullName: 'Cognitive Project Management for AI (PMI-CPMAI)',
    explanation: 'Phương pháp quản trị dự án AI chuẩn quốc tế của PMI gồm 6 giai đoạn lặp (Business, Data Understanding, Data Prep, Model Dev, Evaluation, Operationalization) và các cổng Go/No-Go.',
    caseSensitive: true
  },
  {
    term: 'GIGO',
    fullName: 'Garbage In, Garbage Out',
    explanation: 'Nguyên lý "Rác vào → Rác ra": nếu dữ liệu đầu vào thiếu liên quan, nhiễu hoặc sai lệch, model AI dù hiện đại đến mấy vẫn sẽ cho kết quả tệ.',
    caseSensitive: true
  },
  {
    term: 'Data Leakage',
    fullName: 'Rò rỉ Dữ liệu Huấn luyện',
    explanation: 'Lỗi nghiêm trọng khi thông tin từ tương lai hoặc đáp án vô tình lọt vào tập huấn luyện, khiến model đạt điểm cực cao trong phòng lab nhưng sập hoàn toàn ngoài thực tế.'
  },
  {
    term: 'Training-Serving Skew',
    fullName: 'Độ lệch giữa Huấn luyện & Vận hành',
    explanation: 'Hiện tượng dữ liệu lúc huấn luyện (làm sạch thủ công trong notebook) khác với dữ liệu thực tế lúc vận hành Production, làm suy giảm mạnh hiệu năng model.'
  },
  {
    term: 'Ground Truth',
    fullName: 'Dữ liệu Chuẩn gốc (Nhãn chuẩn)',
    explanation: 'Bộ đáp án/nhãn đúng đã được nhiều chuyên gia nghiệp vụ thẩm định chéo (Consensus QA) dùng để huấn luyện và chấm điểm chính xác cho AI.'
  },
  {
    term: 'Accuracy Trap',
    fullName: 'Bẫy Độ chính xác Kỹ thuật',
    explanation: 'Tình huống model đạt 95–98% Accuracy kỹ thuật nhưng thất bại về mục tiêu kinh doanh (vd: bỏ sót các ca gian lận hiếm gặp hoặc tìm nhầm mã SKU).'
  },
  {
    term: 'Data Drift',
    fullName: 'Sự trôi lệch Dữ liệu Đầu vào',
    explanation: 'Phân phối dữ liệu thực tế thay đổi theo thời gian (vd: hành vi mua sắm thay đổi sau dịch/mùa vụ), khiến model cũ dần mất độ chính xác và cần huấn luyện lại.'
  },
  {
    term: 'Model Scaffolding',
    fullName: 'Lớp Vỏ Ứng dụng bọc quanh Model',
    explanation: 'Phần giao diện, API wrapper và luồng nghiệp vụ mà người dùng tương tác — cần tách rời khỏi lõi Model Operationalization để nâng cấp model không làm vỡ app.'
  },
  {
    term: 'Trustworthy AI',
    fullName: 'AI Đáng tin cậy (5 Lớp PMI-CPMAI)',
    explanation: 'Khung 5 lớp bắt buộc trong dự án AI: Công bằng (Fairness), Minh bạch/Giải thích được (Transparency), Riêng tư (Privacy), An toàn (Safety) và Trách nhiệm giải trình (Accountability).'
  }
];

export const GLOSSARY_MAP: Record<string, GlossaryEntry> = Object.fromEntries(
  SA_GLOSSARY.map((entry) => [entry.term.toLowerCase(), entry])
);
