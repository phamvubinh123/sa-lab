import React, { useState, useEffect } from 'react';
import type { Lang } from '../data/i18n';
import type { TopicPracticeGuide } from '../data/learningGuides';
import { GlossaryText } from './GlossaryText';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  MessageSquareQuote,
  RotateCcw,
  Sparkles,
  Target,
  XCircle
} from 'lucide-react';

interface Props {
  guide: TopicPracticeGuide;
  lang: Lang;
}

export const TopicPracticeLab: React.FC<Props> = ({ guide, lang }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [rebuttalText, setRebuttalText] = useState<string>('');
  const [submittedRebuttal, setSubmittedRebuttal] = useState<boolean>(false);

  // Reset exercise UI when switching topics
  useEffect(() => {
    setSelectedOptionId(null);
    setShowHints(false);
    setRebuttalText('');
    setSubmittedRebuttal(false);
  }, [guide.topicId]);

  const selectedOption = guide.scenarioQuestion.options.find(
    (opt) => opt.id === selectedOptionId
  );

  // Evaluate user's written rebuttal against key architectural points
  const lowerInput = rebuttalText.toLowerCase();
  const matchedKeywords = guide.debateChallenge.expectedKeywords.filter((kw) =>
    lowerInput.includes(kw.toLowerCase())
  );
  const coverageRatio = Math.min(
    100,
    Math.round(
      (matchedKeywords.length /
        Math.max(2, Math.min(4, guide.debateChallenge.expectedKeywords.length))) *
        100
    )
  );

  const isVi = lang === 'vi';

  return (
    <div className="practice-lab-stack">
      {/* EXERCISE 1: SCENARIO DECISION DRILL */}
      <div className="detail-section-card practice-card">
        <div className="practice-card-top">
          <div className="card-heading" style={{ marginBottom: 0 }}>
            <Target size={18} />
            <h3>
              {isVi
                ? 'Bài tập 1: Xử lý Tình huống Thực tế (Scenario Drill)'
                : 'Exercise 1: Real-World Scenario Drill'}
            </h3>
          </div>
          {selectedOption && (
            <button
              type="button"
              className="btn-ghost-sm"
              onClick={() => setSelectedOptionId(null)}
            >
              <RotateCcw size={13} /> {isVi ? 'Làm lại' : 'Retry'}
            </button>
          )}
        </div>

        <div className="scenario-brief-box">
          <span className="eyebrow-tag">
            {isVi ? 'Bối cảnh sự cố' : 'Production Context'}
          </span>
          <p>
            <GlossaryText text={guide.scenarioQuestion.context} />
          </p>
          <strong className="scenario-prompt-q">
            <HelpCircle size={15} /> {guide.scenarioQuestion.question}
          </strong>
        </div>

        <div className="quiz-options-list">
          {guide.scenarioQuestion.options.map((opt, idx) => {
            const isPicked = selectedOptionId === opt.id;
            let stateClass = '';
            if (selectedOptionId) {
              if (opt.isCorrect) stateClass = 'correct';
              else if (isPicked && !opt.isCorrect) stateClass = 'wrong';
            }

            return (
              <button
                key={opt.id}
                type="button"
                className={`quiz-option-btn ${isPicked ? 'picked' : ''} ${stateClass}`}
                onClick={() => setSelectedOptionId(opt.id)}
              >
                <span className="quiz-letter">{String.fromCharCode(65 + idx)}</span>
                <div className="quiz-option-content">
                  <span className="quiz-option-text">
                    <GlossaryText text={opt.text} />
                  </span>
                  {selectedOptionId && (isPicked || opt.isCorrect) && (
                    <div className={`quiz-feedback-inline ${opt.isCorrect ? 'ok' : 'err'}`}>
                      {opt.isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      <span>
                        <GlossaryText text={opt.explanation} />
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* EXERCISE 2: DEVIL'S ADVOCATE REBUTTAL CHALLENGE */}
      <div className="detail-section-card practice-card debate-card">
        <div className="practice-card-top">
          <div className="card-heading" style={{ marginBottom: 0 }}>
            <MessageSquareQuote size={18} />
            <h3>
              {isVi
                ? 'Bài tập 2: Thử thách Phản biện (SA Debate & Rebuttal)'
                : 'Exercise 2: SA Debate & Devil’s Advocate Rebuttal'}
            </h3>
          </div>
          <button
            type="button"
            className="btn-ghost-sm"
            onClick={() => setShowHints((prev) => !prev)}
          >
            <Lightbulb size={14} />
            {showHints
              ? isVi
                ? 'Ẩn gợi ý'
                : 'Hide Hints'
              : isVi
              ? 'Xem gợi ý góc nhìn'
              : 'Show SA Hints'}
          </button>
        </div>

        <div className="challenger-quote-box">
          <span className="challenger-role-pill">{guide.debateChallenge.challengerRole}</span>
          <blockquote>
            <GlossaryText text={guide.debateChallenge.statement} />
          </blockquote>
        </div>

        {showHints && (
          <div className="debate-hints-box">
            <strong>
              <Lightbulb size={14} />{' '}
              {isVi ? 'Gợi ý các luận điểm SA nên chạm tới:' : 'Suggested SA angles to cover:'}
            </strong>
            <ul>
              {guide.debateChallenge.hints.map((h, i) => (
                <li key={i}>
                  <GlossaryText text={h} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rebuttal-input-block">
          <label htmlFor={`rebuttal-${guide.topicId}`}>
            {isVi
              ? 'Viết lập luận phản biện của bạn (ngắn gọn 2–4 câu, tập trung vào rủi ro, đánh đổi & chi phí):'
              : 'Draft your architectural rebuttal (2–4 concise sentences covering risk, trade-offs, and cost):'}
          </label>
          <textarea
            id={`rebuttal-${guide.topicId}`}
            rows={4}
            value={rebuttalText}
            onChange={(e) => setRebuttalText(e.target.value)}
            placeholder={
              isVi
                ? 'Ví dụ: Nếu làm theo hướng đó thì rủi ro lớn nhất là... Thay vào đó ta nên dùng...'
                : 'Example: Going that route creates a critical risk of... Instead, we should adopt...'
            }
          />
          <div className="rebuttal-actions-row">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setSubmittedRebuttal(true)}
            >
              <Sparkles size={15} />
              {rebuttalText.trim().length > 0
                ? isVi
                  ? 'Kiểm tra lập luận & Xem đáp án SA mẫu'
                  : 'Evaluate My Rebuttal & Reveal SA Answer'
                : isVi
                ? 'Xem đáp án phản biện SA mẫu'
                : 'Reveal Senior SA Model Rebuttal'}
            </button>
            {submittedRebuttal && (
              <button
                type="button"
                className="btn-ghost-sm"
                onClick={() => {
                  setSubmittedRebuttal(false);
                  setRebuttalText('');
                }}
              >
                <RotateCcw size={13} /> {isVi ? 'Viết lại' : 'Clear'}
              </button>
            )}
          </div>
        </div>

        {submittedRebuttal && (
          <div className="rebuttal-result-panel">
            {rebuttalText.trim().length > 0 && (
              <div className="rebuttal-score-strip">
                <div>
                  <strong>
                    {isVi ? 'Độ phủ luận điểm cốt lõi:' : 'Key Concept Coverage:'}{' '}
                    <span className={coverageRatio >= 50 ? 'text-success' : 'text-amber'}>
                      {coverageRatio}%
                    </span>
                  </strong>
                  <p>
                    {matchedKeywords.length > 0
                      ? isVi
                        ? `Bạn đã chạm đúng các ý quan trọng: ${matchedKeywords.join(', ')}.`
                        : `You hit key architectural points: ${matchedKeywords.join(', ')}.`
                      : isVi
                      ? 'Lập luận của bạn chưa nhắc trực tiếp tới các từ khóa kỹ thuật cốt lõi — hãy so sánh với đáp án SA mẫu bên dưới nhé!'
                      : 'Your draft missed the core architectural keywords—compare your reasoning with the Senior SA model rebuttal below.'}
                  </p>
                </div>
              </div>
            )}

            <div className="model-rebuttal-box">
              <h4>
                <CheckCircle2 size={16} />{' '}
                {isVi ? 'Kịch bản phản biện chuẩn Senior SA' : 'Senior SA Model Rebuttal'}
              </h4>
              <p>
                <GlossaryText text={guide.debateChallenge.modelRebuttal} />
              </p>
            </div>

            <div className="common-trap-box">
              <h4>
                <AlertTriangle size={15} />{' '}
                {isVi ? 'Bẫy tư duy người mới hay mắc phải' : 'Common Beginner Trap'}
              </h4>
              <p>
                <GlossaryText text={guide.debateChallenge.commonTrap} />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
