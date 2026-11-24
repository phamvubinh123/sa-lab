import {
  PILLARS,
  TOPICS,
  SA_DECISION_CHECKLIST,
  CAPSTONE_STAGES,
  type ArchitecturePillar,
  type ArchitectureTopic,
  type GatekeeperItem,
  type CapstoneStage
} from './architectureData';

export type Lang = 'en' | 'vi';

export const UI_COPY: Record<
  Lang,
  {
    headerTitle: string;
    headerTag: string;
    headerTagline: string;
    masteryLabel: string;
    modulesWord: string;
    nav: {
      t1Title: string;
      t1Sub: string;
      t2Title: string;
      t2Sub: string;
      t3Title: string;
      t3Sub: string;
      t4Title: string;
      t4Sub: string;
      t5Title: string;
      t5Sub: string;
    };
    explorer: {
      pillarWord: string;
      masteredWord: string;
      modulesWord: string;
      coreMandates: string;
      moduleWord: string;
      markMastered: string;
      markedMastered: string;
      goldenRuleLabel: string;
      contextLabel: string;
      flowHeading: string;
      dim1Heading: string;
      recommendedBadge: string;
      alternativeBadge: string;
      strengths: string;
      tradeOffsRisks: string;
      whenToUse: string;
      quantHeading: string;
      dim2Heading: string;
      coreResp: string;
      neverCross: string;
      antiPatternsHeading: string;
      symptom: string;
      impact: string;
      remediation: string;
      dim3Heading: string;
      failureScenario: string;
      blastRadius: string;
      day2Mitigation: string;
      keySli: string;
      dim4Heading: string;
    };
    sim: {
      eyebrow: string;
      title: string;
      subtitle: string;
      lab1Btn: string;
      lab2Btn: string;
      chaosParams: string;
      workloadGen: string;
      trafficMult: string;
      pdfExports: string;
      partnerLatency: string;
      mobileRetry: string;
      workflowSteps: string;
      safeguards: string;
      enableAll: string;
      disableAll: string;
      telemetryTitle: string;
      healthyPill: string;
      incidentsSuffix: string;
      availLabel: string;
      latencyLabel: string;
      oversoldLabel: string;
      dupChargeLabel: string;
      dbCpuLabel: string;
      topologyTitle: string;
      diagnosticsTitle: string;
      zeroFailures: string;
      lab2Title: string;
      monthlyQueries: string;
      slmOffload: string;
      slmNote: string;
      ragStrategy: string;
      rwRatio: string;
      cqrsLabel: string;
      sapLabel: string;
      aclLabel: string;
      finopsTitle: string;
      optimalPosture: string;
      risksSuffix: string;
      monthlyAiCost: string;
      skuRecall: string;
      historyLatency: string;
      rbacRisk: string;
      activeBlueprint: string;
      findingsTitle: string;
      allAligned: string;
    };
    capstone: {
      eyebrow: string;
      title: string;
      subtitle: string;
      resetBtn: string;
      stagesDone: string;
      masteryScore: string;
      monthlyOpex: string;
      criticalFlaws: string;
      stageWord: string;
      pending: string;
      optimal: string;
      riskFlagged: string;
      nextStage: string;
      constraintsTitle: string;
      saEval: string;
      boardReaction: string;
      proceedStage: string;
      gateEyebrow: string;
      gateTitle: string;
      gateSubtitle: string;
      gatesVerified: string;
      ifViolated: string;
      saStandard: string;
    };
    studio: {
      engineLabel: string;
      liveConnected: string;
      builtInEngine: string;
      bannerDesc: string;
      updateKey: string;
      connectKey: string;
      savedPill: string;
      adrTitleHeading: string;
      loadTemplate1: string;
      loadTemplate2: string;
      adrTitleLbl: string;
      adrContextLbl: string;
      adrOptionsLbl: string;
      adrDecisionLbl: string;
      adrTradeOffsLbl: string;
      adrDay2Lbl: string;
      evalBtn: string;
      evalBtnLoading: string;
      arbHeading: string;
      emptyEval: string;
      dimTradeOff: string;
      dimBoundary: string;
      dimDay2: string;
      dimGov: string;
      strengths: string;
      blindSpots: string;
      defenseHeading: string;
      boardConfidence: string;
      defensePlaceholder: string;
      defendBtn: string;
      consultingBtn: string;
      tcoEyebrow: string;
      tcoTitle: string;
      stressTestLbl: string;
      capexLbl: string;
      cloudOpexLbl: string;
      aiOpexLbl: string;
      sapOpexLbl: string;
      benefitLbl: string;
      total3yTco: string;
      net3yRoi: string;
    };
  }
> = {
  en: {
    headerTitle: 'Solution Architect Lab',
    headerTag: 'Enterprise Workbench',
    headerTagline: 'Trade-off Analysis · Design Boundaries · Day-2 Operational Feasibility · Zero-Trust Governance',
    masteryLabel: '5-PILLAR MASTERY',
    modulesWord: 'Modules',
    nav: {
      t1Title: '1. 5-Pillar Mastery Library',
      t1Sub: 'Trade-offs, Boundaries, Anti-Patterns & Day-2 Ops',
      t2Title: '2. Chaos & FinOps Flight Simulators',
      t2Sub: '100x Flash Sale, Bulkhead, CQRS, SLM Router & M365 ACL Lab',
      t3Title: '3. End-to-End Capstone & 7-Gate Checklist',
      t3Sub: 'Project Horizon 5-Stage Scenario + SA Gatekeeper',
      t4Title: '4. ADR Studio, 3Y TCO & Live LLM Boardroom',
      t4Sub: 'Plug in API Key for Live ARB Grading & CxO Defense',
      t5Title: '5. AI Lifecycle Lab (PMI-CPMAI)',
      t5Sub: '6-Phase Hands-On Simulators, Go/No-Go Gates & Project Charter'
    },
    explorer: {
      pillarWord: 'PILLAR',
      masteredWord: 'Mastered',
      modulesWord: 'MODULES',
      coreMandates: 'Core Pillar Mandates',
      moduleWord: 'MODULE',
      markMastered: 'Mark Module Mastered',
      markedMastered: 'Mastered (Completed)',
      goldenRuleLabel: 'SA Golden Rule & Decision Threshold:',
      contextLabel: 'Enterprise Context:',
      flowHeading: 'Reference Architecture Flow & Control Points',
      dim1Heading: 'Dimension 1: Architectural Trade-Off Matrix & Option Evaluation',
      recommendedBadge: 'SA RECOMMENDED PATTERN',
      alternativeBadge: 'ALTERNATIVE',
      strengths: 'Strengths:',
      tradeOffsRisks: 'Trade-offs / Risks:',
      whenToUse: 'When to Use:',
      quantHeading: 'Quantitative Multi-Axis Trade-Off Comparison (0–100 Score)',
      dim2Heading: 'Dimension 2: Design Boundaries & Red Lines',
      coreResp: 'Core Responsibility:',
      neverCross: 'Boundary Violation (Never Cross):',
      antiPatternsHeading: 'Fatal Anti-Patterns ("Tử Huyệt Kiến Trúc")',
      symptom: 'Symptom:',
      impact: 'Business Impact:',
      remediation: 'SA Remediation:',
      dim3Heading: 'Dimension 3: Day-2 Operational Feasibility',
      failureScenario: 'Failure Scenario:',
      blastRadius: 'Blast Radius:',
      day2Mitigation: 'Day-2 Mitigation:',
      keySli: 'Key Production SLI/SLO:',
      dim4Heading: 'Dimension 4: Architecture Governance Mandates'
    },
    sim: {
      eyebrow: 'INTERACTIVE FLIGHT SIMULATORS',
      title: 'Day-2 Operations, Chaos Stress-Testing & AI FinOps Workbench',
      subtitle:
        'Manipulate real-world enterprise stress variables (100x Flash Sales, 5-year PDF thread starvation, SAP read skews, Token FinOps & M365 ACL attacks) to observe quantitative architectural trade-offs in real time.',
      lab1Btn: 'Lab 1: Flash Sale & Resilience Chaos (Pillar 1)',
      lab2Btn: 'Lab 2: CQRS, Model Router FinOps & Zero-Trust RAG (Pillars 2–4)',
      chaosParams: '1. Chaos Stress Parameters',
      workloadGen: 'Workload Generator',
      trafficMult: 'Flash Sale Traffic Multiplier',
      pdfExports: 'Concurrent 5-Year Financial PDF Exports',
      partnerLatency: 'Downstream Partner API Latency (Payment/Insurance)',
      mobileRetry: 'Mobile 3G/4G Network Client Retry Rate',
      workflowSteps: 'Distributed Microservice Workflow Steps',
      safeguards: '2. Architectural Safeguards',
      enableAll: 'Enable All SA Patterns',
      disableAll: 'Strip Defenses',
      telemetryTitle: 'Live Production Telemetry & Blast Radius',
      healthyPill: 'ALL SLA GATES HEALTHY',
      incidentsSuffix: 'ACTIVE INCIDENTS',
      availLabel: 'Sales Checkout Availability',
      latencyLabel: 'Checkout P99 Latency',
      oversoldLabel: 'Oversold Inventory Units',
      dupChargeLabel: 'Double-Charged Orders',
      dbCpuLabel: 'Primary SQL Database CPU Utilization',
      topologyTitle: 'Live Request & Fault Isolation Topology',
      diagnosticsTitle: 'Real-Time Architectural Diagnostics',
      zeroFailures: 'Zero Cascading Failures Detected:',
      lab2Title: 'Enterprise Data, AI FinOps & Zero-Trust Controls',
      monthlyQueries: 'Monthly Enterprise AI Queries',
      slmOffload: 'AI Gateway Model Router: SLM Offload % (Phi-4 / Llama-3-8B)',
      slmNote: 'Handbook Golden Target: Route 70–80% simple queries to SLMs (1/50th token cost) with Confidence Escalation.',
      ragStrategy: 'Knowledge Grounding Strategy (Chip Huyen Matrix)',
      rwRatio: 'Enterprise Data Read/Write Ratio (5-Year History vs. Writes)',
      cqrsLabel: 'CQRS Separation (SQL + Elasticsearch)',
      sapLabel: 'SAP ERP Extraction Boundary',
      aclLabel: 'M365 / SharePoint RBAC Security Trimming (Pillar 4 Zero Trust)',
      finopsTitle: 'FinOps, Retrieval Accuracy & Zero-Trust Posture',
      optimalPosture: 'OPTIMAL ENTERPRISE ARCHITECTURE',
      risksSuffix: 'ARCHITECTURAL RISKS',
      monthlyAiCost: 'Monthly AI Inference Cost',
      skuRecall: 'Exact SKU / Error Code Recall',
      historyLatency: '5-Year History Query Latency',
      rbacRisk: 'M365 RBAC Leakage Risk',
      activeBlueprint: 'Active Data & AI Pipeline Blueprint',
      findingsTitle: 'Architectural Trade-off & Governance Findings',
      allAligned: 'All Pillars Aligned:'
    },
    capstone: {
      eyebrow: 'END-TO-END ENTERPRISE CAPSTONE & GATEKEEPER',
      title: 'Project Horizon: Global SAP + M365 + Agentic AI Supply Chain Transformation',
      subtitle:
        'Navigate a 5-stage enterprise transformation spanning all 5 pillars. Every architectural decision impacts your 36-month TCO, P95 latency, Day-2 resilience, and Executive Board approval.',
      resetBtn: 'Reset Scenario',
      stagesDone: 'Stages Completed',
      masteryScore: 'Architecture Mastery Score',
      monthlyOpex: 'Cumulative Monthly OpEx',
      criticalFlaws: 'Critical Governance / SLA Flaws',
      stageWord: 'Stage',
      pending: 'Pending Decision',
      optimal: 'Optimal Architecture',
      riskFlagged: 'Risk Flagged',
      nextStage: 'Next Stage',
      constraintsTitle: 'Hard Enterprise Constraints:',
      saEval: 'Principal Architect Evaluation:',
      boardReaction: 'Executive Board Reaction:',
      proceedStage: 'Proceed to Stage',
      gateEyebrow: 'HANDBOOK SECTION 7 + ENTERPRISE EXTENSIONS',
      gateTitle: '7-Layer Solution Architect Decision Gatekeeper Checklist',
      gateSubtitle: 'Before approving any enterprise or AI architecture at the Architecture Review Board (ARB), verify all 7 red-line gates below.',
      gatesVerified: 'GATES VERIFIED',
      ifViolated: 'If Violated:',
      saStandard: 'SA Standard:'
    },
    studio: {
      engineLabel: 'AI Evaluation & CxO Roleplay Engine:',
      liveConnected: 'LIVE LLM CONNECTED',
      builtInEngine: 'BUILT-IN EXPERT ENGINE (Plug in your LLM API Key for Live Generative Critique)',
      bannerDesc: 'Connect your OpenAI, Google Gemini, Anthropic Claude, or OpenAI-compatible API key to unlock live generative ADR grading and multi-turn CxO cross-examination.',
      updateKey: 'Update LLM API Key',
      connectKey: 'Connect LLM API Key',
      savedPill: 'API Key Saved in Browser!',
      adrTitleHeading: '1. Architecture Decision Record (ADR) Studio',
      loadTemplate1: 'Load AI/Zero-Trust ADR',
      loadTemplate2: 'Load Saga/CQRS/SAP ADR',
      adrTitleLbl: 'ADR Title & Identifier',
      adrContextLbl: 'Context, Business Constraints & SLA Requirements',
      adrOptionsLbl: 'Considered Options (Include Rejected Alternatives)',
      adrDecisionLbl: 'Decision & Explicit System Boundaries (Edge, Data, AI, Security)',
      adrTradeOffsLbl: 'Quantitative Trade-offs & Accepted Negative Consequences',
      adrDay2Lbl: 'Day-2 Operations, Resilience & Zero-Trust Governance',
      evalBtn: 'Evaluate ADR with Built-In ARB Expert Engine',
      evalBtnLoading: 'Architecture Review Board Evaluating ADR...',
      arbHeading: '2. Architecture Review Board (ARB) Evaluation',
      emptyEval: 'Click "Evaluate ADR" on the left to score your Architecture Decision Record across Trade-off Thinking, Boundary Clarity, Day-2 Operational Feasibility, and Zero-Trust Governance.',
      dimTradeOff: 'Trade-off Thinking',
      dimBoundary: 'Boundary Clarity',
      dimDay2: 'Day-2 Feasibility',
      dimGov: 'Zero-Trust & Gov',
      strengths: 'Key Architectural Strengths',
      blindSpots: 'Identified Blind Spots',
      defenseHeading: '3. Live CxO Stakeholder Defense Arena',
      boardConfidence: 'Board Confidence:',
      defensePlaceholder: 'Defend your architecture (e.g., explain 75/25 SLM Model Router, Entra ID OBO hybrid trimming, FE/BE Redlock idempotency, 80/20 Bulkhead)...',
      defendBtn: 'Defend',
      consultingBtn: 'Consulting...',
      tcoEyebrow: 'PILLAR 5 FINANCIAL GOVERNANCE',
      tcoTitle: '36-Month Enterprise TCO, FinOps & Traffic Sensitivity Calculator',
      stressTestLbl: 'Sensitivity Stress Test:',
      capexLbl: 'Initial Build & Migration CapEx (Strangler Fig Phase 1)',
      cloudOpexLbl: 'Base Monthly Cloud, Kubernetes, Redis & Elasticsearch OpEx',
      aiOpexLbl: 'Base Monthly AI Inference & Reranker OpEx (With 75% SLM Router)',
      sapOpexLbl: 'Monthly SAP ODP/CDC Connector, MDM & WORM Audit Storage',
      benefitLbl: 'Estimated Monthly Business Value (Productivity + Prevented Overselling/Outages)',
      total3yTco: '36-Month Total Cost of Ownership (TCO)',
      net3yRoi: '36-Month Net Business Value (ROI)'
    }
  },
  vi: {
    headerTitle: 'Solution Architect Lab',
    headerTag: 'Enterprise Workbench',
    headerTagline: 'Tư duy Đánh đổi (Trade-offs) · Ranh giới Thiết kế · Khả thi Vận hành Day-2 · Quản trị Zero Trust',
    masteryLabel: 'TIẾN ĐỘ LÀM CHỦ 5 KHỐI',
    modulesWord: 'Chủ đề',
    nav: {
      t1Title: '1. Thư viện 5 Khối Trụ cột',
      t1Sub: 'Đánh đổi, Ranh giới, Tử huyệt & Vận hành Day-2',
      t2Title: '2. Bộ Mô phỏng Chaos & FinOps',
      t2Sub: 'Flash Sale 100x, Bulkhead, CQRS, SLM Router & M365 ACL',
      t3Title: '3. Capstone Xuyên suốt & 7 Cổng Kiểm trực',
      t3Sub: 'Kịch bản Project Horizon 5 chặng + SA Gatekeeper',
      t4Title: '4. ADR Studio, TCO 3 Năm & Hội đồng CxO',
      t4Sub: 'Cắm LLM API Key để chấm ADR & phản biện trực tiếp',
      t5Title: '5. Vòng đời Dự án AI (PMI-CPMAI)',
      t5Sub: '6 Giả lập Thực hành, Cổng Go/No-Go & Xuất AI Charter'
    },
    explorer: {
      pillarWord: 'KHỐI',
      masteredWord: 'Đã làm chủ',
      modulesWord: 'CHỦ ĐỀ',
      coreMandates: 'Nguyên tắc Cốt lõi của Khối',
      moduleWord: 'CHỦ ĐỀ',
      markMastered: 'Đánh dấu Đã làm chủ',
      markedMastered: 'Đã làm chủ (Hoàn thành)',
      goldenRuleLabel: 'Nguyên tắc Vàng & Ngưỡng Quyết định SA:',
      contextLabel: 'Bối cảnh Doanh nghiệp:',
      flowHeading: 'Sơ đồ Luồng Kiến trúc & Điểm Kiểm soát',
      dim1Heading: 'Chiều 1: Ma trận Đánh đổi (Trade-offs) & So sánh Phương án',
      recommendedBadge: 'MẪU HÌNH SA KHUYẾN NGHỊ',
      alternativeBadge: 'PHƯƠNG ÁN THAY THẾ',
      strengths: 'Điểm mạnh:',
      tradeOffsRisks: 'Đánh đổi / Rủi ro chấp nhận:',
      whenToUse: 'Khi nào áp dụng:',
      quantHeading: 'So sánh Định lượng Đa trục (Thang 0–100)',
      dim2Heading: 'Chiều 2: Ranh giới Thiết kế & Lằn ranh Đỏ',
      coreResp: 'Trách nhiệm Cốt lõi:',
      neverCross: 'Vi phạm Ranh giới (Tuyệt đối cấm):',
      antiPatternsHeading: 'Tử huyệt Kiến trúc (Fatal Anti-Patterns)',
      symptom: 'Biểu hiện:',
      impact: 'Tác động Kinh doanh:',
      remediation: 'Giải pháp SA:',
      dim3Heading: 'Chiều 3: Tính khả thi Vận hành (Day-2 Ops)',
      failureScenario: 'Kịch bản Sự cố:',
      blastRadius: 'Phạm vi Ảnh hưởng (Blast Radius):',
      day2Mitigation: 'Cơ chế Khắc phục Day-2:',
      keySli: 'Chỉ số SLI/SLO Trọng yếu:',
      dim4Heading: 'Chiều 4: Quy chuẩn Quản trị Kiến trúc (Governance)'
    },
    sim: {
      eyebrow: 'BỘ MÔ PHỎNG TƯƠNG TÁC THỜI GIAN THỰC',
      title: 'Kiểm thử Hỗn loạn Day-2 Ops, Stress-Test & AI FinOps Workbench',
      subtitle:
        'Điều chỉnh các biến số áp lực thực tế (Flash Sale 100x, 100 kế toán xuất PDF 5 năm cùng lúc, lệch tải đọc/ghi SAP, chi phí Token & lỗ hổng phân quyền M365) để quan sát đánh đổi kiến trúc tức thì.',
      lab1Btn: 'Lab 1: Flash Sale & Hỗn loạn Resilience (Khối 1)',
      lab2Btn: 'Lab 2: CQRS, Model Router FinOps & Zero-Trust RAG (Khối 2–4)',
      chaosParams: '1. Thông số Áp lực & Sự cố',
      workloadGen: 'Trình tạo Tải giả lập',
      trafficMult: 'Hệ số Lưu lượng Flash Sale',
      pdfExports: 'Số Kế toán xuất Báo cáo PDF 5 năm cùng lúc',
      partnerLatency: 'Độ trễ / Treo API Đối tác (Thanh toán/Bảo hiểm)',
      mobileRetry: 'Tỷ lệ Mobile 3G/4G Retry do rớt mạng',
      workflowSteps: 'Số bước Microservice trong Giao dịch phân tán',
      safeguards: '2. Lá chắn Kiến trúc (Safeguards)',
      enableAll: 'Bật toàn bộ Mẫu hình SA',
      disableAll: 'Tắt hết Lá chắn',
      telemetryTitle: 'Giám sát Production & Phạm vi Ảnh hưởng',
      healthyPill: 'MỌI SLA ĐỀU AN TOÀN',
      incidentsSuffix: 'SỰ CỐ ĐANG XẢY RA',
      availLabel: 'Tỷ lệ Sẵn sàng Thanh toán',
      latencyLabel: 'Độ trễ Checkout P99',
      oversoldLabel: 'Đơn hàng Bán vượt Tồn kho (Overselling)',
      dupChargeLabel: 'Giao dịch Trừ tiền 2 lần',
      dbCpuLabel: 'Tải CPU Cơ sở dữ liệu Chính (Primary SQL)',
      topologyTitle: 'Sơ đồ Luồng Xử lý & Cô lập Lỗi Trực tiếp',
      diagnosticsTitle: 'Chẩn đoán Kiến trúc Thời gian thực',
      zeroFailures: 'Không có Sập dây chuyền:',
      lab2Title: 'Điều khiển Dữ liệu Doanh nghiệp, AI FinOps & Zero Trust',
      monthlyQueries: 'Số lượng Truy vấn AI Doanh nghiệp / Tháng',
      slmOffload: 'AI Gateway Model Router: Tỷ lệ đẩy sang SLM (Phi-4 / Llama-3-8B)',
      slmNote: 'Ngưỡng vàng Sổ tay: Đẩy 70–80% câu hỏi đơn giản sang SLM (giá 1/50) kèm Confidence Escalation.',
      ragStrategy: 'Chiến lược Nạp Tri thức AI (Ma trận Chip Huyen)',
      rwRatio: 'Tỷ lệ Đọc/Ghi Dữ liệu (Tra cứu 5 năm vs. Ghi giao dịch)',
      cqrsLabel: 'Tách biệt CQRS (SQL + Elasticsearch)',
      sapLabel: 'Ranh giới Trích xuất SAP ERP',
      aclLabel: 'Cắt tỉa Quyền M365 / SharePoint RBAC (Khối 4 Zero Trust)',
      finopsTitle: 'Chi phí FinOps, Độ chính xác Truy xuất & Bảo mật Zero Trust',
      optimalPosture: 'KIẾN TRÚC DOANH NGHIỆP TỐI ƯU',
      risksSuffix: 'RỦI RO KIẾN TRÚC',
      monthlyAiCost: 'Chi phí Inference AI / Tháng',
      skuRecall: 'Độ chính xác Mã SKU / Mã lỗi Kỹ thuật',
      historyLatency: 'Độ trễ Tra cứu Lịch sử 5 năm',
      rbacRisk: 'Rủi ro Rò rỉ Quyền M365',
      activeBlueprint: 'Bản vẽ Luồng Dữ liệu & AI Hiện hành',
      findingsTitle: 'Đánh giá Đánh đổi & Quản trị',
      allAligned: 'Tất cả Khối đều Khớp chuẩn:'
    },
    capstone: {
      eyebrow: 'BÀI TẬP LỚN XUYÊN SUỐT 5 KHỐI & CỔNG KIỂM DUYỆT',
      title: 'Project Horizon: Chuyển đổi Chuỗi cung ứng Toàn cầu (SAP + M365 + Agentic AI)',
      subtitle:
        'Điều hướng dự án chuyển đổi doanh nghiệp 5 chặng xuyên suốt cả 5 khối kiến trúc. Mọi quyết định đều tác động trực tiếp đến TCO 36 tháng, độ trễ P95, khả năng vận hành Day-2 và phê duyệt của Hội đồng CxO.',
      resetBtn: 'Làm lại Kịch bản',
      stagesDone: 'Chặng đã hoàn thành',
      masteryScore: 'Điểm Làm chủ Kiến trúc',
      monthlyOpex: 'Chi phí Vận hành (OpEx) / Tháng',
      criticalFlaws: 'Lỗi Nghiêm trọng (SLA / Bảo mật)',
      stageWord: 'Chặng',
      pending: 'Chưa quyết định',
      optimal: 'Kiến trúc Tối ưu',
      riskFlagged: 'Cảnh báo Rủi ro',
      nextStage: 'Chặng tiếp theo',
      constraintsTitle: 'Ràng buộc Bắt buộc của Doanh nghiệp:',
      saEval: 'Đánh giá của Principal Architect:',
      boardReaction: 'Phản hồi từ Hội đồng CxO:',
      proceedStage: 'Tiếp tục sang Chặng',
      gateEyebrow: 'MỤC 7 SỔ TAY KIẾN TRÚC + MỞ RỘNG DOANH NGHIỆP',
      gateTitle: 'Bộ 7 Câu hỏi Kiểm trực Kiến trúc (SA Decision Gatekeeper Checklist)',
      gateSubtitle: 'Trước khi phê duyệt bất kỳ bản thiết kế nào tại Architecture Review Board (ARB), kiến trúc sư bắt buộc phải kiểm qua 7 lằn ranh đỏ dưới đây.',
      gatesVerified: 'CỔNG ĐÃ DUYỆT',
      ifViolated: 'Hậu quả nếu Vi phạm:',
      saStandard: 'Chuẩn Kiến trúc SA:'
    },
    studio: {
      engineLabel: 'Bộ Chấm điểm ADR & Hội đồng Phản biện AI:',
      liveConnected: 'ĐÃ KẾT NỐI LLM LIVE',
      builtInEngine: 'CHẾ ĐỘ CHUYÊN GIA NỘI BỘ (Cắm LLM API Key để AI phản biện tự do)',
      bannerDesc: 'Kết nối API Key của OpenAI, Google Gemini, Anthropic Claude hoặc endpoint tương thích OpenAI để mở khóa chấm điểm ADR bằng LLM và đối đáp trực tiếp với Hội đồng CxO.',
      updateKey: 'Cập nhật API Key',
      connectKey: 'Cắm LLM API Key',
      savedPill: 'Đã lưu API Key trong Trình duyệt!',
      adrTitleHeading: '1. Phòng Soạn thảo ADR (Architecture Decision Record)',
      loadTemplate1: 'Nạp mẫu ADR AI & Zero-Trust',
      loadTemplate2: 'Nạp mẫu ADR Saga, CQRS & SAP',
      adrTitleLbl: 'Tiêu đề & Mã định danh ADR',
      adrContextLbl: 'Bối cảnh, Ràng buộc Kinh doanh & Yêu cầu SLA',
      adrOptionsLbl: 'Các Phương án đã Cân nhắc (Gồm cả Phương án bị Loại)',
      adrDecisionLbl: 'Quyết định & Ranh giới Hệ thống (Edge, Data, AI, Security)',
      adrTradeOffsLbl: 'Phân tích Đánh đổi & Hệ quả Tiêu cực Chấp nhận',
      adrDay2Lbl: 'Vận hành Day-2, Khả năng Tự phục hồi & Quản trị Zero Trust',
      evalBtn: 'Chấm điểm ADR bằng Hội đồng ARB Nội bộ',
      evalBtnLoading: 'Hội đồng ARB đang thẩm định ADR...',
      arbHeading: '2. Kết quả Thẩm định từ Hội đồng Kiến trúc (ARB)',
      emptyEval: 'Nhấn "Chấm điểm ADR" bên trái để đánh giá tài liệu ADR của bạn trên 4 trục: Tư duy Đánh đổi, Ranh giới Thiết kế, Khả thi Day-2 và Quản trị Zero Trust.',
      dimTradeOff: 'Tư duy Đánh đổi',
      dimBoundary: 'Rõ ràng Ranh giới',
      dimDay2: 'Khả thi Day-2',
      dimGov: 'Zero Trust & Quản trị',
      strengths: 'Điểm mạnh Kiến trúc',
      blindSpots: 'Điểm mù Cần bổ sung',
      defenseHeading: '3. Đấu trường Phản biện Trực tiếp trước Hội đồng CxO',
      boardConfidence: 'Độ tin cậy của Hội đồng:',
      defensePlaceholder: 'Nhập lập luận bảo vệ giải pháp (VD: giải thích Model Router 75/25, Entra ID OBO trimming, Redlock idempotency, Bulkhead 80/20)...',
      defendBtn: 'Phản biện',
      consultingBtn: 'Đang hỏi...',
      tcoEyebrow: 'KHỐI 5 QUẢN TRỊ TÀI CHÍNH CÔNG NGHỆ',
      tcoTitle: 'Máy tính TCO 36 Tháng, FinOps & Độ nhạy Lưu lượng',
      stressTestLbl: 'Kiểm thử Độ nhạy (Sensitivity):',
      capexLbl: 'Chi phí Đầu tư & Chuyển đổi Ban đầu (CapEx - Strangler Fig Pha 1)',
      cloudOpexLbl: 'Chi phí Cloud, Kubernetes, Redis & Elasticsearch / Tháng',
      aiOpexLbl: 'Chi phí AI Inference & Reranker / Tháng (Đã có Router 75% SLM)',
      sapOpexLbl: 'Chi phí SAP ODP/CDC, MDM & Lưu trữ Audit WORM / Tháng',
      benefitLbl: 'Giá trị Kinh doanh Mang lại / Tháng (Năng suất + Chống thất thoát sự cố)',
      total3yTco: 'Tổng Chi phí Sở hữu 36 Tháng (3Y TCO)',
      net3yRoi: 'Giá trị Ròng 36 Tháng (Net ROI)'
    }
  }
};

const PILLARS_VI: Record<string, Partial<ArchitecturePillar>> = {
  'pillar-1': {
    title: 'Nền tảng Phân tán, Tự phục hồi & Tích hợp',
    shortTitle: 'Khối 1: Phân tán & Resilience',
    subtitle: 'Edge Caching, API Gateway, Cache-Aside, EDA, Idempotency, Saga, Outbox, Circuit Breaker, Bulkhead & Strangler Fig',
    coreFocus: [
      'Hybrid Rendering & Bypass CDN cho tồn kho thời gian thực (chống Overselling)',
      'Chống Cache Stampede bằng Distributed Mutex Lock (Redis)',
      'Idempotency: "Front-End MUST Generate UUID, Back-End MUST Enforce Redlock"',
      'Choreography (<=3 bước) vs. Orchestration Saga (>4 bước) & Transactional Outbox',
      'Circuit Breaker (Fail-Fast 1ms), Bulkhead (Pool 80/20) & Strangler Fig (90/10)'
    ]
  },
  'pillar-2': {
    title: 'Kiến trúc Dữ liệu Doanh nghiệp',
    shortTitle: 'Khối 2: Dữ liệu Doanh nghiệp',
    subtitle: 'CQRS (Đọc/Ghi >50:1), CDC từ SAP ERP, Data Mesh vs. Lakehouse, MDM Golden Record & Data Lineage đầu-cuối',
    coreFocus: [
      'CQRS tách Write DB (SQL 3NF ACID) và Read DB (Elasticsearch Denormalized)',
      'Trích xuất CDC từ SAP qua ODP/SLT chuẩn hãng (tránh vi phạm bản quyền & khóa HANA)',
      'Cân bằng tự chủ Domain (Data Mesh) với nền tảng Lakehouse & Data Contract tự động',
      'MDM Golden Record & truy vết dòng chảy dữ liệu (Column-Level Lineage)'
    ]
  },
  'pillar-3': {
    title: 'Kiến trúc AI & Tích hợp Doanh nghiệp',
    shortTitle: 'Khối 3: AI & FinOps',
    subtitle: 'Model Router (SLM vs. LLM), Semantic Caching, Multi-LLM Fallback, Hybrid RAG (BM25 + Vector + Reranker), MCP & Guardrails',
    coreFocus: [
      'AI Gateway điều hướng 70–80% tác vụ nhẹ sang SLM (giá 1/50) & 20–30% sang Frontier LLM',
      'Semantic Caching theo nhóm quyền RBAC (cosine > 0.92, <50ms) & Multi-LLM Fallback (429/5xx)',
      'Hybrid Search (BM25 + Vector + Reranker) trị bệnh "Mù từ khóa kỹ thuật"',
      'Nguyên tắc vàng Chip Huyen: "Finetuning cho Form, RAG cho Facts"',
      'Chuẩn hóa công cụ qua MCP, Input/Output Guardrails & đánh giá RAGAS'
    ]
  },
  'pillar-4': {
    title: 'Bảo mật, Tuân thủ & Zero Trust',
    shortTitle: 'Khối 4: Bảo mật & Zero Trust',
    subtitle: 'Kế thừa quyền M365/Azure RBAC/ABAC trong RAG, Entra ID OBO Flow, Data Sovereignty & Audit Trail bất biến cho AI',
    coreFocus: [
      'Index-time ACL Sync vs. Query-time Security Trimming cho SharePoint/M365',
      'Truyền định danh Entra ID On-Behalf-Of (OBO) chống leo thang đặc quyền',
      'Data Sovereignty: Tokenize PII nội địa + mã hóa BYOK trên Cloud vùng',
      'Immutable WORM Audit Trail truy vết chính xác nguồn Chunk & quyền RBAC'
    ]
  },
  'pillar-5': {
    title: 'Kỹ năng Kiến trúc sư & Chuyển giao',
    shortTitle: 'Khối 5: Delivery & Quản trị',
    subtitle: '7 Câu hỏi Kiểm trực SA, Modular Monolith vs. Microservices FinOps, Kiểm soát Egress, ADR & Bảo vệ trước CxO',
    coreFocus: [
      '7-Layer SA Decision Checklist kiểm duyệt Edge, Data, Async, Resilience, SAP, AI & Zero Trust',
      'Chọn đúng quy mô: Modular Monolith (<30 dev) vs. Microservices & kiểm soát Cross-AZ/Cloud Egress',
      'Soạn thảo ADR theo chuẩn Docs-as-Code nêu rõ Đánh đổi & Hệ quả tiêu cực',
      'Phân tích TCO 36 tháng, vòng đời lưu trữ (Hot/Warm/Cold) & độ nhạy khi tải tăng 3x',
      'Nghệ thuật thuyết phục CFO, CISO, Head of SRE và Business VP'
    ]
  }
};

const TOPICS_VI: Record<string, Partial<ArchitectureTopic>> = {
  'p1-edge-gateway': {
    title: 'CDN Edge Caching vs. Dynamic API & Gateway Routing',
    subtitle: 'Phân tách Static Shell với dữ liệu động thời gian thực và tránh tử huyệt Fat Gateway',
    goldenRule: 'Cache Static Shell ở CDN Edge (<50ms); LUÔN Bypass CDN cho Tồn kho, Giá Flash Sale & Giỏ hàng. Không nhồi Business Logic vào API Gateway.',
    businessContext: 'Trong hệ thống Thương mại điện tử Headless và cổng Doanh nghiệp, phục vụ file tĩnh từ server gốc gây tốn băng thông và chậm chuyển đổi. Ngược lại, cache số lượng tồn kho trên CDN sẽ gây thảm họa Overselling (bán vượt tồn kho) trong đợt Flash Sale.'
  },
  'p1-cache-stampede': {
    title: 'Cache-Aside Pattern & Chống Thảm họa Cache Stampede',
    subtitle: 'Tăng tốc đọc bằng Redis In-Memory và bảo vệ DB chính khỏi hiệu ứng Thundering Herd',
    goldenRule: 'Không bao giờ để hàng nghìn Cache Miss lao thẳng xuống Disk DB cùng lúc. Bắt buộc dùng Distributed Mutex Lock hoặc Probabilistic Early Expiration.',
    businessContext: 'CSDL đĩa cứng dễ nghẽn I/O khi đọc đồng thời cao. Khi một khóa Redis cực HOT hết hạn đúng lúc có 100.000 người truy cập, toàn bộ request đều bị Cache Miss và đánh sập CSDL chính (Dog-piling).'
  },
  'p1-eda-idempotency-saga': {
    title: 'Event-Driven, Idempotency, Saga Pattern & Outbox',
    subtitle: 'Chắn sóng tải (Backpressure), chống trừ tiền 2 lần và giao dịch phân tán không cần 2PC',
    goldenRule: 'Idempotency: "Front-End MUST Generate (UUID), Back-End MUST Enforce (Redlock/Unique Constraint)". Saga: Choreography cho <=3 bước, Orchestration cho >4 bước.',
    businessContext: 'Khi Flash Sale tăng tải 100x hoặc mạng 3G/4G chập chờn khiến app gửi lại request (Retry), hệ thống REST đồng bộ sẽ sập và khách hàng bị trừ tiền 2 lần. Chuỗi nghiệp vụ qua 4–5 microservice cần đảm bảo nguyên vẹn mà không khóa chéo 2PC.'
  },
  'p1-resilience-modernization': {
    title: 'Tự phục hồi & Chuyển đổi: Strangler Fig, Circuit Breaker & Bulkhead',
    subtitle: 'Ngăn sập dây chuyền, cô lập cạn kiệt tài nguyên và chuyển đổi hệ thống cũ an toàn',
    goldenRule: 'Tránh Big Bang Rewrite (tỷ lệ thất bại >80%) — dùng Strangler Fig (90/10 -> 100%). Cô lập tác vụ nặng bằng Bulkhead (80/20) và ngắt mạch Fail-Fast 1ms bằng Circuit Breaker.',
    businessContext: 'Hệ thống doanh nghiệp kết hợp Monolith cũ, API đối tác chập chờn và tác vụ xuất báo cáo nặng. Nếu không có vách ngăn Bulkhead, 100 kế toán bấm xuất PDF 5 năm sẽ ngốn hết Thread Pool và làm nhân viên Sales không thể tạo đơn hàng mới.'
  },
  'p2-cqrs-sap-cdc': {
    title: 'CQRS (Đọc/Ghi >50:1) & CDC Thời gian thực từ SAP ERP',
    subtitle: 'Tách giao dịch ghi ACID khỏi truy vấn phân tích tốc độ cao và trích xuất SAP an toàn',
    goldenRule: 'Khi tỷ lệ Đọc/Ghi vượt 50:1, tách 3NF SQL Command DB khỏi Elasticsearch Query DB qua Async CDC. Tuyệt đối không chọc thẳng JDBC vào bảng BSEG/BKPF của SAP.',
    businessContext: 'Trong Ví điện tử và tích hợp ERP, lệnh Ghi chuyển tiền đòi hỏi chuẩn ACID 3NF tuyệt đối, trong khi người dùng lại yêu cầu tìm kiếm lịch sử 5 năm dưới 0.5 giây và đồng bộ tồn kho SAP theo thời gian thực.'
  },
  'p2-mesh-lakehouse-mdm': {
    title: 'Data Mesh vs. Lakehouse, MDM & Data Lineage Đầu-Cuối',
    subtitle: 'Cân bằng tự chủ theo Domain với tính nhất quán toàn doanh nghiệp và truy vết tác động',
    goldenRule: 'Không áp dụng Data Mesh thuần túy nếu các Domain chưa đủ năng lực kỹ thuật và thiếu Federated Governance tự động. Luôn chuẩn hóa MDM Golden Record & Lineage trước khi nạp cho AI.',
    businessContext: 'Doanh nghiệp thường mắc kẹt giữa đội Data Lakehouse trung tâm bị quá tải (tắc nghẽn hàng tháng) và một Data Mesh tự phát khiến mỗi phòng ban định nghĩa sai lệch về Khách hàng và Doanh thu thuần.'
  },
  'p3-model-router-rag': {
    title: 'Model Router (75/25), Hybrid RAG & Ma trận RAG vs. Finetuning vs. Long Context',
    subtitle: 'Đẩy 70–80% lưu lượng sang SLM, trị Mù từ khóa kỹ thuật bằng BM25+Vector+Reranker và quy tắc Chip Huyen',
    goldenRule: '1) Đẩy 70–80% câu hỏi đơn giản sang SLM (giá 1/50) & 20–30% sang Frontier LLM. 2) Trị Mù từ khóa kỹ thuật bằng Hybrid Search (BM25 + Vector + Reranker). 3) "Finetuning cho Form, RAG cho Facts".',
    businessContext: 'Gọi Frontier LLM (GPT-4o / Claude) cho mọi câu hỏi hoặc nhồi 1M token vào prompt sẽ phá sản ngân sách FinOps. Đồng thời, Vector Search thuần túy thường tìm sai mã lỗi (EADDRNOTAVAIL), mã SKU hoặc số CCCD.'
  },
  'p3-agentic-mcp-guardrails': {
    title: 'Agentic AI, Model Context Protocol (MCP), Guardrails & RAGAS Eval',
    subtitle: 'Chuẩn hóa giao tiếp công cụ doanh nghiệp, giới hạn vòng lặp Agent và định lượng chất lượng LLM',
    goldenRule: 'Ưu tiên Workflow xác định (Deterministic) khi các bước đã rõ ràng; chỉ dùng Autonomous Agent cho lập luận động. Chuẩn hóa tool qua MCP và bắt buộc Human-in-the-Loop cho lệnh Ghi/Xóa.',
    businessContext: 'Khi nâng cấp từ Chatbot chỉ-đọc sang AI Agent có thể tạo đơn hàng SAP hoặc sửa CRM, nếu thiếu ranh giới MCP, Guardrails và bộ kiểm thử RAGAS, Agent có thể lặp vô tận đốt tiền Token hoặc sửa sai dữ liệu.'
  },
  'p3-ai-gateway-cache-fallback': {
    title: 'AI Gateway: Semantic Caching, Multi-LLM Fallback & Token FinOps',
    subtitle: 'Cắt giảm 30–40% chi phí AI (<50ms) bằng Semantic Cache theo RBAC và chống sập 429/5xx qua Multi-LLM Fallback',
    goldenRule: 'Không bao giờ gọi LLM hai lần cho cùng một ý định ngữ nghĩa — dùng Semantic Caching (cosine > 0.92) phân mảnh theo phạm vi quyền RBAC của người dùng, và luôn cấu hình Multi-Provider Fallback để loại bỏ rủi ro phụ thuộc 1 nhà cung cấp.',
    businessContext: 'Ở quy mô 1,5 triệu câu hỏi/tháng, 35% câu hỏi nhân viên lặp lại cùng ý định (chỉ khác cách diễn đạt). Gọi Frontier LLM lặp lại đốt hàng chục nghìn USD/tháng, còn phụ thuộc 1 vùng Azure OpenAI dễ dính bão lỗi 429 Rate Limit hoặc sập vùng.'
  },
  'p4-m365-rbac-zero-trust': {
    title: 'Kế thừa Quyền M365/Azure (RBAC/ABAC) & Zero-Trust RAG',
    subtitle: 'Chống lộ dữ liệu nội bộ trong RAG bằng Entra ID On-Behalf-Of (OBO) và Security Trimming',
    goldenRule: 'Tuyệt đối không dùng Service Principal quyền tối cao để truy vấn Vector DB chung cho mọi user. Bắt buộc truyền Entra ID OBO + Hybrid Security Trimming.',
    businessContext: 'Doanh nghiệp nạp 2 triệu tài liệu SharePoint/M365 vào Vector DB. Nếu AI Backend dùng chung một Admin Key để tìm kiếm mà không lọc theo quyền SharePoint kế thừa, nhân viên thực tập có thể hỏi AI về bảng lương Giám đốc hoặc tài liệu M&A mật.'
  },
  'p4-sovereignty-audit-trail': {
    title: 'Chủ quyền Dữ liệu (Data Sovereignty) & Nhật ký Kiểm toán AI Bất biến',
    subtitle: 'Tuân thủ luật lưu trữ nội địa, khóa mã hóa BYOK và tái hiện pháp chứng quyết định AI',
    goldenRule: 'Giữ PII và dữ liệu tài chính nhạy cảm trong vùng Chủ quyền/Nội địa với khóa BYOK. Ghi lại mọi quyết định AI vào Immutable WORM Audit Trail đã ẩn danh PII.',
    businessContext: 'Ngân hàng, Y tế và Tập đoàn đa quốc gia phải tuân thủ GDPR / Nghị định 13 về bảo vệ dữ liệu cá nhân, đồng thời sẵn sàng trả lời thanh tra trong 15 phút: "Tại sao AI đưa ra khuyến nghị X dựa trên tài liệu nào?"'
  },
  'p5-gatekeeper-adr-tco': {
    title: '7 Câu hỏi Kiểm trực SA, Nghệ thuật viết ADR & Bảo vệ TCO 3 Năm',
    subtitle: 'Thẩm định thiết kế có hệ thống, lưu trữ quyết định kiến trúc và bảo vệ ROI trước Hội đồng CxO',
    goldenRule: 'Kiến trúc chỉ có giá trị khi làm rõ Đánh đổi, Khả thi Day-2 và TCO 3 năm. Không bao giờ bước vào họp ARB khi chưa vượt qua 7 Câu hỏi Kiểm trực SA.',
    businessContext: 'Nhiều bản thiết kế kỹ thuật xuất sắc vẫn bị bác bỏ vì Kiến trúc sư không chứng minh được TCO 36 tháng với CFO, không thuyết phục được CISO về phân quyền Zero Trust hoặc không giải tỏa được nỗi lo trực sự cố của Head of SRE.'
  },
  'p5-finops-monolith-egress': {
    title: 'FinOps & Kinh tế Cloud: Modular Monolith vs. Microservices & Kiểm soát Data Egress',
    subtitle: 'Chọn đúng quy mô kiến trúc cho tải 1x vs. 10x, tránh Distributed Monolith và triệt tiêu chi phí Cross-AZ/Egress ngầm',
    goldenRule: 'Hãy bắt đầu bằng Modular Monolith cho đến khi quy mô đội ngũ (>30 kỹ sư) hoặc nút thắt scale độc lập thực sự đòi hỏi Microservices. Luôn giám sát Cloud Data Egress và lưu lượng Cross-AZ — chúng âm thầm đốt 40% ngân sách Cloud.',
    businessContext: 'Một team 18 kỹ sư tách cổng ERP nội bộ thành 22 Microservices chạy Kubernetes đa vùng. Sau 6 tháng, chi phí Cloud tăng gấp 3 ($42k -> $135k/tháng) do phí Cross-AZ NAT Gateway & Data Egress chiếm 40% hóa đơn, trong khi tốc độ ra tính năng giảm 60%.'
  }
};

const GATEKEEPER_VI: Record<string, Partial<GatekeeperItem>> = {
  'gate-1': {
    layer: '1. Tầng Edge & Gateway',
    pillarBadge: 'Khối 1',
    question: 'Endpoint này có trả dữ liệu động thời gian thực (Tồn kho, Giá Flash Sale, Giỏ hàng) không? Nếu có, đã bật Bypass CDN Caching và giữ API Gateway sạch bóng Business Logic chưa?',
    redLineFailure: 'Cache CDN dữ liệu tồn kho gây bán vượt số lượng (Overselling); Fat Gateway làm nghẽn CPU toàn hệ thống.',
    architectRemediation: 'Dùng Hybrid Rendering (Static Shell trên CDN <50ms, Dynamic API dùng Cache-Control: no-store) + HA Stateless Gateway + Mutex Lock cho Redis.'
  },
  'gate-2': {
    layer: '2. Tầng Dữ liệu & CQRS',
    pillarBadge: 'Khối 2',
    question: 'Bài toán có tỷ lệ Đọc/Ghi lệch trên 50:1 không? Nếu có, đã tách 3NF ACID Command DB khỏi Elasticsearch Query DB (CQRS) và xử lý Eventual Consistency chưa?',
    redLineFailure: 'Truy vấn tìm kiếm 5 năm khóa chéo bảng ghi giao dịch, làm chậm hoặc treo luồng thanh toán.',
    architectRemediation: 'Ghi vào SQL 3NF (PostgreSQL/HANA) và đồng bộ bất đồng bộ qua CDC sang Elasticsearch cho tốc độ đọc <0.5s kèm UI Read-Your-Own-Writes.'
  },
  'gate-3': {
    layer: '3. Tầng Async, Idempotency & Saga',
    pillarBadge: 'Khối 1',
    question: 'Front-End đã tự sinh UUID Idempotency-Key để Back-End kiểm tra bằng Redis Redlock/Unique Constraint chưa, và quy trình >4 bước đã dùng Orchestration Saga + Outbox chưa?',
    redLineFailure: 'Mạng 3G/4G retry làm trừ tiền khách hàng 2 lần; Dual-write gây mất bản tin; Choreography >4 bước tạo "Event Spaghetti".',
    architectRemediation: 'Áp dụng "FE Generates, BE Enforces", dùng Transactional Outbox + Debezium CDC và Orchestrator quản lý bù trừ ngược LIFO.'
  },
  'gate-4': {
    layer: '4. Tầng Resilience & Modernization',
    pillarBadge: 'Khối 1',
    question: 'API đối tác đã bọc Circuit Breaker 3 trạng thái (Fail-Fast 1ms + Fallback) chưa, tác vụ nặng đã tách Bulkhead (80/20) và chuyển đổi hệ thống cũ theo Strangler Fig chưa?',
    redLineFailure: '100 kế toán xuất PDF 5 năm làm treo toàn bộ luồng bán hàng; Big Bang Rewrite thất bại >80%.',
    architectRemediation: 'Cấu hình Circuit Breaker, chia Pool Bulkhead 80% Sales / 20% Báo cáo và chuyển dịch traffic dần qua Strangler Fig Façade (10% -> 100%).'
  },
  'gate-5': {
    layer: '5. Tầng Dữ liệu Doanh nghiệp & SAP CDC',
    pillarBadge: 'Khối 2',
    question: 'Dữ liệu SAP ERP có trích xuất qua cổng chuẩn ODP/SLT CDC (tuyệt đối không chọc raw bảng BSEG/BKPF), đã chuẩn hóa MDM Golden Record và có Column Lineage chưa?',
    redLineFailure: 'Vi phạm bản quyền SAP khi kiểm toán, gãy pipeline khi nâng cấp SAP và lệch số liệu Khách hàng/Doanh thu giữa các phòng ban.',
    architectRemediation: 'Dùng SAP ODP/SLT CDC vào Canonical Model, hợp nhất thực thể qua MDM và áp dụng Data Contract + Lineage đầu-cuối.'
  },
  'gate-6': {
    layer: '6. Tầng AI Engineering, Model Router, Semantic Cache & Hybrid RAG',
    pillarBadge: 'Khối 3',
    question: 'Hệ thống đã dùng Model Router 70–80% SLM, Semantic Cache phân mảnh theo User Security Group Hash (cosine > 0.92), Multi-LLM Fallback (429/5xx) và Hybrid Search (BM25 + Vector + Reranker) chưa?',
    redLineFailure: 'Chi phí Token đội 50x; Cross-User Semantic Cache Leak lộ dữ liệu sếp; sập dịch vụ khi 1 hãng AI dính 429; Vector thuần túy mù mã SKU.',
    architectRemediation: 'Đặt AI Gateway đẩy 75% tải sang SLM, gắn User Security Group Hash vào mọi Semantic Cache key, bật Multi-Provider Fallback, dùng BM25 + Vector + Reranker và MCP + RAGAS.'
  },
  'gate-7': {
    layer: '7. Tầng Zero Trust, Cloud FinOps, Egress & Right-Sizing',
    pillarBadge: 'Khối 4 & 5',
    question: 'AI đã truyền Entra ID OBO + BYOK/WORM Audit chưa, và ADR đã chứng minh TCO chọn Modular Monolith (<30 dev) vs. Microservices (1x vs 10x) kèm kiểm soát Cross-AZ Egress & lưu trữ Hot/Warm/Cold chưa?',
    redLineFailure: 'Lộ tài liệu M365 mật qua RAG; tách Microservices quá sớm thành Distributed Monolith; Cross-AZ Egress & giữ file trên SSD đắt đỏ đốt 40% ngân sách Cloud.',
    architectRemediation: 'Bắt buộc Entra ID OBO + Hybrid Security Trimming + WORM Audit; ưu tiên Modular Monolith nếu <30 dev; dùng Same-AZ VPC Endpoints và tự động chuyển tầng Hot->Warm->Cold.'
  }
};

const CAPSTONE_VI: Record<string, Partial<CapstoneStage>> = {
  'cap-stage-1': {
    pillarBadge: 'Khối 1: Phân tán & Resilience',
    title: 'Đón tải Flash Sale 100x & Cô lập Xuất Báo cáo Tài chính',
    scenarioPrompt: 'Tập đoàn GlobalManufacturing mở đợt Flash Sale (tải tăng 100 lần) đúng lúc 200 kế toán vùng bấm xuất báo cáo PDF tài chính 5 năm cuối tháng. Quy trình đặt hàng đi qua 5 dịch vụ (Order, CreditCheck, SAP Reservation, Payment, Logistics). Bạn thiết kế tầng Edge, Async và Resilience như thế nào?',
    constraints: [
      'Đỉnh tải: 85,000 RPS dịp Flash Sale; SLA Checkout < 200ms',
      'Đại lý di động dùng mạng 4G chập chờn thường xuyên tự động gửi lại request (Retry)',
      'Tác vụ xuất PDF 5 năm cuối tháng tuyệt đối không được làm chậm luồng bán hàng'
    ]
  },
  'cap-stage-2': {
    pillarBadge: 'Khối 2: Kiến trúc Dữ liệu Doanh nghiệp',
    title: 'Trích xuất SAP Real-time, Lệch tải Đọc/Ghi 90:1 & MDM Golden Record',
    scenarioPrompt: 'Đại lý và AI Agent tra cứu lịch sử đơn hàng/hóa đơn 5 năm với tỷ lệ Đọc/Ghi lên tới 90:1 trong khi chứng từ gốc nằm tại SAP S/4HANA (BSEG/BKPF) và dữ liệu khách hàng phân mảnh ở SAP, Salesforce CRM. Bạn thiết kế tầng Dữ liệu Doanh nghiệp ra sao?',
    constraints: [
      'Tỷ lệ Đọc/Ghi là 90:1 (vượt ngưỡng 50:1 của CQRS); SLA tìm kiếm lịch sử < 400ms',
      'Tuân thủ nghiêm ngặt bản quyền SAP Enterprise & không gây khóa bảng HANA',
      'AI và báo cáo CFO yêu cầu một Golden Record duy nhất cho Khách hàng & Nhà cung cấp'
    ]
  },
  'cap-stage-3': {
    pillarBadge: 'Khối 3: AI Architecture & FinOps',
    title: 'Trợ lý AI Doanh nghiệp: Model Router, Tìm kiếm Mã lỗi & Agentic MCP',
    scenarioPrompt: 'Xây dựng Trợ lý AI Chuỗi cung ứng cho 15.000 nhân viên (1,2 triệu câu hỏi/tháng). 75% câu hỏi là tra cứu trạng thái đơn giản, 25% cần phân tích đa bước mã vật tư SAP (MATNR-8841-X), mã lỗi (ERR_SAP_LOCK_09) và tạo nháp Đơn mua hàng (PO).',
    constraints: [
      'Trần ngân sách FinOps: Chi phí AI Inference hàng tháng phải dưới $12,000',
      'Phải tìm chính xác mã lỗi kỹ thuật & mã SKU kèm 100% trích dẫn nguồn (Citations)',
      'Hành động Agent ghi/sửa PO trên SAP bắt buộc có ranh giới an toàn nghiêm ngặt'
    ]
  },
  'cap-stage-4': {
    pillarBadge: 'Khối 4: Bảo mật, Tuân thủ & Zero Trust',
    title: 'Phân quyền Kế thừa M365, Chủ quyền Dữ liệu & Kiểm toán AI',
    scenarioPrompt: 'Hệ thống AI đánh chỉ mục 1,5 triệu file SharePoint/M365 (gồm cả tài liệu M&A của Hội đồng Quản trị và bảng lương HR có kế thừa quyền phức tạp) phục vụ các công ty con chịu luật Chủ quyền Dữ liệu nội địa. CISO yêu cầu bằng chứng không rò rỉ đặc quyền.',
    constraints: [
      'Thư mục SharePoint thường xuyên ngắt kế thừa (Broken Inheritance) và đổi nhóm Entra ID',
      'Dữ liệu PII nhạy cảm không được rời biên giới quốc gia ở dạng chưa ẩn danh',
      'Phải tái hiện lại bất kỳ câu trả lời AI nào trong quá khứ dưới 15 phút khi thanh tra'
    ]
  },
  'cap-stage-5': {
    pillarBadge: 'Khối 5: Kỹ năng Kiến trúc sư & Chuyển giao',
    title: 'Phê duyệt ARB, Lộ trình Strangler Fig & Bảo vệ TCO trước CxO',
    scenarioPrompt: 'Bạn trình bày kiến trúc tổng thể trước Hội đồng Điều hành (CFO, CISO, Head of SRE, VP Supply Chain). Hệ thống ERP cũ đang gánh 100% lưu lượng thực tế, và CFO chất vấn về TCO 3 năm cũng như rủi ro chuyển đổi hệ thống.',
    constraints: [
      'Phải tránh tỷ lệ thất bại >80% của phương án đập đi xây lại (Big Bang)',
      'Chứng minh ROI ròng dương trong 36 tháng kể cả khi lưu lượng tăng gấp 3 lần',
      'Thiết lập cơ chế quản trị để đội Dev không làm lệch kiến trúc sau khi Go-Live'
    ]
  }
};

export function getLocalizedPillars(lang: Lang): ArchitecturePillar[] {
  if (lang === 'en') return PILLARS;
  return PILLARS.map((p) => ({ ...p, ...(PILLARS_VI[p.id] || {}) }));
}

export function getLocalizedTopics(lang: Lang): ArchitectureTopic[] {
  if (lang === 'en') return TOPICS;
  return TOPICS.map((t) => ({ ...t, ...(TOPICS_VI[t.id] || {}) }));
}

export function getLocalizedGatekeeper(lang: Lang): GatekeeperItem[] {
  if (lang === 'en') return SA_DECISION_CHECKLIST;
  return SA_DECISION_CHECKLIST.map((g) => ({ ...g, ...(GATEKEEPER_VI[g.id] || {}) }));
}

export function getLocalizedCapstone(lang: Lang): CapstoneStage[] {
  if (lang === 'en') return CAPSTONE_STAGES;
  return CAPSTONE_STAGES.map((s) => ({ ...s, ...(CAPSTONE_VI[s.id] || {}) }));
}
