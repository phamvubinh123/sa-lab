import type { Lang } from './i18n';

export type CpmaiPhaseId = 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5' | 'phase-6';

export interface CpmaiPattern {
  id: string;
  nameEn: string;
  nameVi: string;
  useCaseEn: string;
  useCaseVi: string;
  saPillarMapping: string;
}

export interface CpmaiProjectPreset {
  id: string;
  nameEn: string;
  nameVi: string;
  domainEn: string;
  domainVi: string;
  problemStatementEn: string;
  problemStatementVi: string;
  targetBusinessKpiEn: string;
  targetBusinessKpiVi: string;
  recommendedPatternId: string;
  recommendedPath: 'genai-adapt' | 'ml-build';
}

export interface CpmaiPhaseMeta {
  id: CpmaiPhaseId;
  number: number;
  roman: string;
  titleEn: string;
  titleVi: string;
  taglineEn: string;
  taglineVi: string;
  saBridge: string;
  cpmaiRuleEn: string;
  cpmaiRuleVi: string;
}

export const SEVEN_AI_PATTERNS: CpmaiPattern[] = [
  {
    id: 'conversational',
    nameEn: 'Conversational & Human Interaction (GenAI / Copilot)',
    nameVi: 'Hội thoại & Tương tác Con người (GenAI / Copilot)',
    useCaseEn: 'Enterprise Q&A assistants, document synthesis, multilingual customer/employee copilots.',
    useCaseVi: 'Trợ lý hỏi đáp doanh nghiệp, tổng hợp tài liệu SharePoint/SAP, chatbot đa ngôn ngữ.',
    saPillarMapping: 'P3.1 Hybrid RAG + P3.3 Semantic Cache + P4.1 Entra ID OBO'
  },
  {
    id: 'predictive',
    nameEn: 'Predictive Analytics & Decision Support',
    nameVi: 'Phân tích Dự báo & Hỗ trợ Quyết định',
    useCaseEn: 'Demand forecasting, credit risk scoring, equipment failure prediction.',
    useCaseVi: 'Dự báo nhu cầu tồn kho, chấm điểm tín dụng, dự đoán hỏng hóc máy móc.',
    saPillarMapping: 'P2.1 CQRS/SAP CDC + P2.2 Lakehouse/MDM + P5.2 FinOps'
  },
  {
    id: 'anomaly',
    nameEn: 'Patterns & Anomalies (Fraud / Outlier Detection)',
    nameVi: 'Phát hiện Bất thường (Gian lận / Lỗi hệ thống)',
    useCaseEn: 'Real-time payment fraud, cybersecurity intrusion, manufacturing defect spikes.',
    useCaseVi: 'Phát hiện gian lận thanh toán thời gian thực, xâm nhập bảo mật, lỗi dây chuyền.',
    saPillarMapping: 'P1.3 EDA/Kafka + P1.4 Circuit Breaker + P2.1 Real-time CDC'
  },
  {
    id: 'hyper-personalization',
    nameEn: 'Hyper-Personalization',
    nameVi: 'Siêu Cá nhân hóa (Hyper-Personalization)',
    useCaseEn: 'Individualized product recommendations, tailored pricing, dynamic customer journeys.',
    useCaseVi: 'Gợi ý sản phẩm 1-1 theo hành vi, ưu đãi cá nhân hóa thời gian thực.',
    saPillarMapping: 'P1.2 Redis Cache-Aside + P2.2 MDM Golden Record'
  },
  {
    id: 'recognition',
    nameEn: 'Recognition (Vision / Audio / OCR)',
    nameVi: 'Nhận diện (Hình ảnh / Âm thanh / OCR)',
    useCaseEn: 'Invoice OCR extraction, quality inspection cameras, voice-to-text call analytics.',
    useCaseVi: 'Trích xuất hóa đơn OCR tự động, camera kiểm lỗi sản phẩm, phân tích tổng đài.',
    saPillarMapping: 'P1.4 Async Bulkhead + P3.1 SLM Vision + P5.2 Object Storage Tiering'
  },
  {
    id: 'goal-driven',
    nameEn: 'Goal-Driven Systems (Agentic AI / Optimization)',
    nameVi: 'Hệ thống Hướng Mục tiêu (Agentic AI / Tối ưu hóa)',
    useCaseEn: 'Multi-step AI agents executing SAP/CRM workflows, dynamic route & supply optimization.',
    useCaseVi: 'AI Agent tự lập kế hoạch nhiều bước gọi API SAP/CRM, tối ưu tuyến giao hàng.',
    saPillarMapping: 'P3.2 MCP + Guardrails + Human-in-the-Loop + P1.3 Saga'
  },
  {
    id: 'autonomous',
    nameEn: 'Autonomous Systems',
    nameVi: 'Hệ thống Tự hành (Autonomous Systems)',
    useCaseEn: 'Self-driving warehouse robots, autonomous drones, lights-out factory control.',
    useCaseVi: 'Robot kho tự hành, drone kiểm tra hạ tầng, dây chuyền tự vận hành.',
    saPillarMapping: 'P1.1 Edge Compute + P1.4 Fail-Safe Resilience + P4.2 WORM Audit'
  }
];

export const CPMAI_PROJECT_PRESETS: CpmaiProjectPreset[] = [
  {
    id: 'horizon-copilot',
    nameEn: 'Project Horizon: Enterprise Supply Chain & SAP GenAI Copilot',
    nameVi: 'Project Horizon: Trợ lý AI Chuỗi cung ứng & SAP Doanh nghiệp',
    domainEn: 'Enterprise Operations & Knowledge (GenAI)',
    domainVi: 'Vận hành Doanh nghiệp & Tri thức (GenAI)',
    problemStatementEn:
      '15,000 employees waste 45 min/day searching 1.5M SharePoint SOPs and SAP error codes/SKUs. Need accurate, permission-aware answers with citations.',
    problemStatementVi:
      '15.000 nhân viên mất 45 phút/ngày tìm 1,5 triệu tài liệu SharePoint & mã lỗi/SKU trên SAP. Cần trợ lý AI trả lời chính xác có trích dẫn và đúng phân quyền.',
    targetBusinessKpiEn: 'Cut lookup time by 60%, <$12k/mo AI OpEx, 0 RBAC data leaks',
    targetBusinessKpiVi: 'Giảm 60% thời gian tra cứu, chi phí AI <$12k/tháng, 0 rò rỉ quyền RBAC',
    recommendedPatternId: 'conversational',
    recommendedPath: 'genai-adapt'
  },
  {
    id: 'fraud-shield',
    nameEn: 'FraudShield: Real-Time Payment Anomaly & Risk Engine',
    nameVi: 'FraudShield: Hệ thống Phát hiện Gian lận Thanh toán Thời gian thực',
    domainEn: 'FinTech / Banking (Predictive ML)',
    domainVi: 'Tài chính / Ngân hàng (Machine Learning Dự báo)',
    problemStatementEn:
      'Card-not-present fraud losses hit $2.4M/year. Static rules block too many legitimate VIP customers (18% false positives).',
    problemStatementVi:
      'Thiệt hại gian lận thẻ đạt 2,4 triệu USD/năm. Luật cứng (if/else) chặn nhầm tới 18% giao dịch hợp lệ của khách hàng VIP.',
    targetBusinessKpiEn: 'Catch >=88% fraud value while keeping False Positive Rate <2% in <80ms',
    targetBusinessKpiVi: 'Bắt >=88% giá trị gian lận, giữ tỷ lệ chặn nhầm <2% với độ trễ <80ms',
    recommendedPatternId: 'anomaly',
    recommendedPath: 'ml-build'
  },
  {
    id: 'agent-ops',
    nameEn: 'AutoProcure: Agentic PO & Vendor Resolution Assistant',
    nameVi: 'AutoProcure: AI Agent Tự động Xử lý Đơn mua hàng (PO) & Nhà cung cấp',
    domainEn: 'Procurement Automation (Agentic AI)',
    domainVi: 'Tự động hóa Mua sắm (Agentic AI)',
    problemStatementEn:
      'Procurement clerks manually reconcile vendor emails, check SAP stock, and draft POs—causing 4-day delays on urgent factory parts.',
    problemStatementVi:
      'Nhân viên mua hàng phải đọc email nhà cung cấp, kiểm tra tồn kho SAP và tạo nháp PO thủ công, gây chậm 4 ngày cho linh kiện gấp.',
    targetBusinessKpiEn: 'Automate 70% routine PO drafts with 100% human approval above $5,000',
    targetBusinessKpiVi: 'Tự động hóa 70% bản nháp PO thường lệ, bắt buộc người duyệt với đơn >$5,000',
    recommendedPatternId: 'goal-driven',
    recommendedPath: 'genai-adapt'
  }
];

export const CPMAI_PHASES: CpmaiPhaseMeta[] = [
  {
    id: 'phase-1',
    number: 1,
    roman: 'I',
    titleEn: 'Business Understanding',
    titleVi: 'Hiểu Nghiệp vụ (Business)',
    taglineEn: 'Work backward from ROI, pass the "Golden Question", and map to the 7 Patterns of AI.',
    taglineVi: 'Đi ngược từ ROI kinh doanh, vượt qua "Câu hỏi Vàng" và chọn đúng 1 trong 7 Patterns of AI.',
    saBridge: 'Pillar 5: TCO/ROI & ADR',
    cpmaiRuleEn: 'Golden Question: "Can we solve 90% of this with deterministic rules (if/else)?" If YES, do NOT use AI.',
    cpmaiRuleVi: 'Câu hỏi Vàng: "Có thể giải 90% bài toán bằng luật cứng (if/else) không?" Nếu CÓ → KHÔNG dùng AI!'
  },
  {
    id: 'phase-2',
    number: 2,
    roman: 'II',
    titleEn: 'Data Understanding',
    titleVi: 'Hiểu Dữ liệu (Data Audit)',
    taglineEn: 'Beat GIGO (Garbage In, Garbage Out): verify relevance, bias, leakage, and legal/RBAC access.',
    taglineVi: 'Chặn đứng GIGO (Rác vào → Rác ra): kiểm tra độ liên quan, thiên lệch (Bias), rò rỉ và quyền truy cập.',
    saBridge: 'Pillar 2 (SAP CDC, MDM) & Pillar 4 (Zero Trust)',
    cpmaiRuleEn: 'Data relevance & legal right to use ALWAYS beat sheer data volume.',
    cpmaiRuleVi: 'Độ liên quan và quyền sử dụng hợp pháp LUÔN quan trọng hơn dung lượng dữ liệu khổng lồ.'
  },
  {
    id: 'phase-3',
    number: 3,
    roman: 'III',
    titleEn: 'Data Preparation',
    titleVi: 'Chuẩn bị Dữ liệu (80/20)',
    taglineEn: 'The 80% heavy lift: Ground Truth Consensus QA, versioned pipelines, and Training-Serving Skew prevention.',
    taglineVi: 'Khâu nặng nhất (chiếm 80% công sức): chuẩn hóa Ground Truth, chống Training-Serving Skew & pipeline tự động.',
    saBridge: 'Pillar 2 (Lakehouse/CQRS) & Pillar 3 (Hybrid Index)',
    cpmaiRuleEn: 'Never clean data manually in notebooks for production—build automated, versioned pipelines.',
    cpmaiRuleVi: 'Tuyệt đối không làm sạch dữ liệu thủ công cho Production — bắt buộc dùng pipeline tự động có quản lý phiên bản.'
  },
  {
    id: 'phase-4',
    number: 4,
    roman: 'IV',
    titleEn: 'Model Development',
    titleVi: 'Phát triển Model',
    taglineEn: 'Choose Path A (Build ML from scratch) vs. Path B (Adopt/Adapt GenAI via Hybrid RAG + Model Router).',
    taglineVi: 'Chọn Nhánh A (Train ML truyền thống) hay Nhánh B (GenAI Adopt/Adapt: Hybrid RAG + Model Router + Cache).',
    saBridge: 'Pillar 3 (Model Router, Hybrid RAG, Semantic Cache, MCP)',
    cpmaiRuleEn: 'Adopt or Adapt before Building from Scratch: "Finetuning is for Form, RAG is for Facts."',
    cpmaiRuleVi: 'Ưu tiên Tận dụng/Tinh chỉnh (Adopt/Adapt) trước khi tự train từ đầu: "Finetuning cho Form, RAG cho Facts".'
  },
  {
    id: 'phase-5',
    number: 5,
    roman: 'V',
    titleEn: 'Model Evaluation',
    titleVi: 'Đánh giá & Kiểm định',
    taglineEn: 'Escape the "Accuracy Trap", audit 5 Layers of Trustworthy AI, and use the Diagnostic Iteration Ladder.',
    taglineVi: 'Thoát "Bẫy Accuracy", kiểm định 5 lớp Trustworthy AI và chẩn đoán vòng lặp quay lại (Iteration Loop).',
    saBridge: 'Pillar 3 (RAGAS Eval) & Pillar 4 (RBAC & Compliance)',
    cpmaiRuleEn: 'A 96% accurate model that misses the Business KPI is a failure—loop back to the root phase.',
    cpmaiRuleVi: 'Model đạt 96% Accuracy kỹ thuật nhưng không đạt Business KPI vẫn là thất bại — phải Loop Back đúng Phase gốc.'
  },
  {
    id: 'phase-6',
    number: 6,
    roman: 'VI',
    titleEn: 'Model Operationalization',
    titleVi: 'Vận hành & MLOps',
    taglineEn: 'Turn a science experiment into a 24/7 enterprise asset: Drift monitoring, Scaffolding, Fallbacks & Sunsetting.',
    taglineVi: 'Biến thí nghiệm thành tài sản chạy 24/7: giám sát Drift, Scaffolding, Fallback đa hãng & Kế hoạch nghỉ hưu Model.',
    saBridge: 'Pillar 1 (Bulkhead/CB), Pillar 3 (Fallback), Pillar 4 (WORM), Pillar 5 (FinOps)',
    cpmaiRuleEn: 'Deployment is Day 1, not the finish line—monitor Data Drift, Model Decay & silent Vendor API changes.',
    cpmaiRuleVi: 'Go-live mới là Ngày 1, không phải đích đến — phải giám sát Data Drift, Model Decay & rủi ro hãng đổi API ngầm.'
  }
];

export const TRUSTWORTHY_AI_LAYERS = [
  {
    id: 'fairness',
    en: 'Fairness & Bias Mitigation (No demographic/historical discrimination)',
    vi: 'Công bằng & Giảm thiên lệch (Không phân biệt đối xử do dữ liệu lịch sử)'
  },
  {
    id: 'transparency',
    en: 'Explainability & Citations (Users see WHY AI gave this answer)',
    vi: 'Minh bạch & Trích dẫn nguồn (Người dùng thấy rõ TẠI SAO AI trả lời vậy)'
  },
  {
    id: 'privacy',
    en: 'Privacy, RBAC & Data Sovereignty (Entra ID OBO + PII redaction)',
    vi: 'Quyền riêng tư, RBAC & Chủ quyền dữ liệu (Entra ID OBO + ẩn PII)'
  },
  {
    id: 'safety',
    en: 'Safety, Guardrails & Human-in-the-Loop (No unchecked high-risk actions)',
    vi: 'An toàn, Guardrails & Người duyệt (Không để AI tự chạy lệnh rủi ro cao)'
  },
  {
    id: 'accountability',
    en: 'Accountability & Immutable Audit Trail (Named owner + WORM logging)',
    vi: 'Trách nhiệm giải trình & Nhật ký WORM (Có chủ sở hữu rõ ràng + log bất biến)'
  }
];

export function getLocalizedPatternName(p: CpmaiPattern, lang: Lang): string {
  return lang === 'vi' ? p.nameVi : p.nameEn;
}
