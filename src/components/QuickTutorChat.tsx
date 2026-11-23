import React, { useState, useRef, useEffect } from 'react';
import { getLocalizedTopics, type Lang } from '../data/i18n';
import { SA_GLOSSARY } from '../data/glossary';
import { getTopicPracticeGuide } from '../data/learningGuides';
import {
  askSaTutor,
  getSavedLLMConfig,
  saveLLMConfig,
  type LLMConfig,
  type LLMProvider,
  type TutorChatMessage
} from '../services/llmEvaluator';
import {
  Bot,
  KeyRound,
  MessageCircleQuestion,
  Send,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  activeTab: string;
  activeTopicId: string;
}

function buildLocalTutorAnswer(
  question: string,
  topicId: string,
  lang: Lang
): string {
  const q = question.toLowerCase();
  const isVi = lang === 'vi';
  const topics = getLocalizedTopics(lang);
  const topic = topics.find((t) => t.id === topicId) || topics[0];
  const guide = getTopicPracticeGuide(topic.id, lang);

  // 1. Check if the user is asking about specific glossary acronyms/terms
  const matchedTerms = SA_GLOSSARY.filter((entry) => {
    const termLower = entry.term.toLowerCase();
    // Match whole word or exact phrase
    const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return regex.test(q);
  });

  if (matchedTerms.length > 0) {
    const lines = matchedTerms.slice(0, 4).map(
      (t) => `• ${t.term} (${t.fullName}): ${t.explanation}`
    );
    return isVi
      ? `Giải thích nhanh thuật ngữ bạn vừa hỏi:\n\n${lines.join('\n\n')}`
      : `Quick breakdown of the term(s) you asked about:\n\n${lines.join('\n\n')}`;
  }

  // 2. Analogy / simple explanation
  if (
    q.includes('dễ hiểu') ||
    q.includes('ví dụ') ||
    q.includes('tóm tắt') ||
    q.includes('là gì') ||
    q.includes('simple') ||
    q.includes('analogy') ||
    q.includes('explain') ||
    q.includes('summary')
  ) {
    return isVi
      ? `💡 ${guide.analogyTitle}\n\n${guide.analogyStory}\n\nTóm gọn 3 bước:\n${guide.plainSteps.map((s) => `• ${s}`).join('\n')}`
      : `💡 ${guide.analogyTitle}\n\n${guide.analogyStory}\n\nIn 3 simple steps:\n${guide.plainSteps.map((s) => `• ${s}`).join('\n')}`;
  }

  // 3. Anti-patterns / pitfalls / what to avoid
  if (
    q.includes('lỗi') ||
    q.includes('sai') ||
    q.includes('tránh') ||
    q.includes('tử huyệt') ||
    q.includes('không nên') ||
    q.includes('pitfall') ||
    q.includes('mistake') ||
    q.includes('avoid') ||
    q.includes('trap')
  ) {
    const aps = topic.antiPatterns
      .slice(0, 2)
      .map((ap) => `• ${ap.name}: ${ap.businessImpact} → Cách sửa: ${ap.remediation}`)
      .join('\n\n');
    return isVi
      ? `⚠️ Các lỗi ("tử huyệt") cần tránh ở bài ${topic.title}:\n\n${aps}\n\nBẫy tư duy hay gặp: ${guide.debateChallenge.commonTrap}`
      : `⚠️ Key pitfalls to avoid in ${topic.title}:\n\n${aps}\n\nCommon trap: ${guide.debateChallenge.commonTrap}`;
  }

  // 4. Trade-offs / comparison / when to use
  if (
    q.includes('so sánh') ||
    q.includes('khi nào') ||
    q.includes('chọn') ||
    q.includes('đánh đổi') ||
    q.includes('trade') ||
    q.includes('compare') ||
    q.includes('when')
  ) {
    const best = topic.optionsComparison.options[0];
    const alt = topic.optionsComparison.options[1];
    return isVi
      ? `⚖️ Gợi ý chọn phương án cho bài ${topic.title}:\n\n• Khuyên dùng: ${best.name} — ${best.whenToUse}\n• Phương án thay thế: ${alt?.name || ''} — ${alt?.whenToUse || ''}\n\nNguyên tắc vàng: ${topic.goldenRule}`
      : `⚖️ Trade-off summary for ${topic.title}:\n\n• Recommended: ${best.name} — ${best.whenToUse}\n• Alternative: ${alt?.name || ''} — ${alt?.whenToUse || ''}\n\nGolden Rule: ${topic.goldenRule}`;
  }

  // 5. Debate / defend / CxO
  if (
    q.includes('phản biện') ||
    q.includes('bảo vệ') ||
    q.includes('thuyết phục') ||
    q.includes('cfo') ||
    q.includes('debate') ||
    q.includes('defend') ||
    q.includes('rebuttal')
  ) {
    return isVi
      ? `🎯 Cách phản biện chuẩn SA cho bài ${topic.title}:\n\nNếu ${guide.debateChallenge.challengerRole} hỏi: ${guide.debateChallenge.statement}\n\n👉 Trả lời: ${guide.debateChallenge.modelRebuttal}`
      : `🎯 Senior SA rebuttal for ${topic.title}:\n\nWhen ${guide.debateChallenge.challengerRole} says: ${guide.debateChallenge.statement}\n\n👉 Answer: ${guide.debateChallenge.modelRebuttal}`;
  }

  // 6. Default helpful context answer + prompt to plug API key for open-ended questions
  return isVi
    ? `Ở bài "${topic.title}", nguyên tắc cốt lõi là:\n"${topic.goldenRule}"\n\n• Thuật ngữ chính: ${guide.keyTerms.join(', ')} (bạn có thể gõ thẳng tên thuật ngữ để mình giải thích).\n• Mẹo: Nếu bạn muốn hỏi tự do mọi câu hỏi sâu hơn ngoài giáo trình, bấm biểu tượng 🔑 ở góc trên ô chat để cắm Gemini / OpenAI API Key nhé!`
    : `For "${topic.title}", the Golden Rule is:\n"${topic.goldenRule}"\n\n• Key terms: ${guide.keyTerms.join(', ')} (type any acronym and I will explain it).\n• Tip: Click the 🔑 icon above to plug in a Gemini / OpenAI API Key for open-ended AI mentoring!`;
}

export const QuickTutorChat: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  activeTab,
  activeTopicId
}) => {
  const isVi = lang === 'vi';
  const topics = getLocalizedTopics(lang);
  const currentTopic = topics.find((t) => t.id === activeTopicId) || topics[0];
  const currentGuide = getTopicPracticeGuide(currentTopic.id, lang);

  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => getSavedLLMConfig());
  const [showKeyForm, setShowKeyForm] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isVi
        ? 'Chào bạn! Mình là SA Tutor. Chỗ nào có thuật ngữ khó (NLB, HA, CQRS, OBO...) hay chưa hiểu luồng chạy, cứ hỏi thẳng ở đây nhé — mình sẽ giải thích kiểu dễ hiểu nhất!'
        : 'Hi! I am your SA Tutor. Ask me about any acronym (NLB, HA, CQRS, OBO...) or concept you find unclear—I will explain it simply with real-world examples!',
      mode: 'built-in'
    }
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // Sync saved LLM config whenever drawer opens (in case user updated it in ADR Studio)
  useEffect(() => {
    if (isOpen) {
      setLlmConfig(getSavedLLMConfig());
    }
  }, [isOpen]);

  const quickPrompts = isVi
    ? [
        'Giải thích bài này kiểu dễ hiểu nhất?',
        `${currentGuide.keyTerms.slice(0, 2).join(' và ')} là gì?`,
        'Những lỗi tử huyệt nào cần tránh?',
        'Cách phản biện khi team không đồng ý?'
      ]
    : [
        'Explain this module in simple terms',
        `What do ${currentGuide.keyTerms.slice(0, 2).join(' & ')} mean?`,
        'What pitfalls should I avoid here?',
        'How do I defend this to stakeholders?'
      ];

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: TutorChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text
    };
    const streamMsgId = `a-${Date.now()}`;
    const hasLiveKey = llmConfig.apiKey.trim().length > 0;

    setMessages((prev) => [
      ...prev,
      userMsg,
      ...(hasLiveKey
        ? [{ id: streamMsgId, role: 'assistant' as const, content: '...', mode: 'live-llm' as const }]
        : [])
    ]);
    if (!overrideText) setInput('');
    setIsLoading(true);

    // Send ONLY the active currentTopic object (compact) for <1s TTFT
    const currentTopicContext = JSON.stringify({
      tab: activeTab,
      code: currentTopic.code,
      title: currentTopic.title,
      goldenRule: currentTopic.goldenRule,
      context: currentTopic.businessContext,
      recommendedOption: currentTopic.optionsComparison.options[0]?.name,
      keyAntiPatterns: currentTopic.antiPatterns.map((a) => a.name)
    });

    try {
      const liveResult = await askSaTutor({
        question: text,
        currentTopicContext,
        lang,
        config: llmConfig,
        onChunk: (accumulated) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === streamMsgId ? { ...m, content: accumulated } : m))
          );
        }
      });

      if (liveResult.usedLiveLLM && liveResult.reply) {
        setMessages((prev) =>
          prev.map((m) => (m.id === streamMsgId ? { ...m, content: liveResult.reply } : m))
        );
      } else {
        const localReply = buildLocalTutorAnswer(text, currentTopic.id, lang);
        const finalContent = liveResult.errorNote
          ? `${localReply}\n\n(${isVi ? 'Lưu ý API' : 'API Note'}: ${liveResult.errorNote})`
          : localReply;

        setMessages((prev) => {
          const exists = prev.some((m) => m.id === streamMsgId);
          if (exists) {
            return prev.map((m) =>
              m.id === streamMsgId ? { ...m, content: finalContent, mode: 'built-in' } : m
            );
          }
          return [
            ...prev,
            {
              id: streamMsgId,
              role: 'assistant',
              content: finalContent,
              mode: 'built-in'
            }
          ];
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveLLMConfig(llmConfig);
    setShowKeyForm(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: isVi
          ? `Đã làm mới cuộc trò chuyện. Bạn đang xem bài "${currentTopic.title}" — cứ hỏi bất kỳ chỗ nào chưa rõ nhé!`
          : `Chat cleared. You are viewing "${currentTopic.title}"—ask anything you'd like clarified!`,
        mode: 'built-in'
      }
    ]);
  };

  if (!isOpen) return null;

  const hasLiveKey = llmConfig.apiKey.trim().length > 0;

  return (
    <aside className="tutor-side-drawer" aria-label="SA Quick Tutor Chat">
      <div className="tutor-header">
        <div className="tutor-title-group">
          <div className="tutor-avatar">
            <Bot size={18} />
          </div>
          <div>
            <strong>{isVi ? 'Hỏi nhanh SA Tutor' : 'SA Quick Tutor'}</strong>
            <span className={`tutor-mode-badge ${hasLiveKey ? 'live' : ''}`}>
              <Sparkles size={11} />
              {hasLiveKey
                ? `Live AI (${llmConfig.provider.toUpperCase()})`
                : isVi
                ? 'Built-in Tutor (Offline)'
                : 'Built-in Tutor'}
            </span>
          </div>
        </div>
        <div className="tutor-header-actions">
          <button
            type="button"
            className={`tutor-icon-btn ${showKeyForm ? 'active' : ''}`}
            onClick={() => setShowKeyForm((prev) => !prev)}
            title={isVi ? 'Cài đặt LLM API Key' : 'Configure LLM API Key'}
          >
            <KeyRound size={15} />
          </button>
          <button
            type="button"
            className="tutor-icon-btn"
            onClick={handleClearChat}
            title={isVi ? 'Xóa lịch sử chat' : 'Clear chat'}
          >
            <Trash2 size={15} />
          </button>
          <button
            type="button"
            className="tutor-icon-btn"
            onClick={onClose}
            title={isVi ? 'Đóng ô chat' : 'Close chat'}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Current Context Banner */}
      <div className="tutor-context-bar">
        <MessageCircleQuestion size={14} />
        <span>
          {isVi ? 'Đang học:' : 'Context:'} <strong>{currentTopic.code} {currentTopic.title}</strong>
        </span>
      </div>

      {/* Inline API Key Settings */}
      {showKeyForm && (
        <form className="tutor-key-panel" onSubmit={handleSaveKey}>
          <div className="tutor-key-row">
            <select
              value={llmConfig.provider}
              onChange={(e) => {
                const provider = e.target.value as LLMProvider;
                const defaultModel =
                  provider === 'gemini'
                    ? 'gemini-3.8-flash'
                    : provider === 'anthropic'
                    ? 'claude-3-5-sonnet-latest'
                    : 'gpt-4o-mini';
                setLlmConfig({ ...llmConfig, provider, model: defaultModel });
              }}
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="custom">Custom OpenAI</option>
            </select>
            <input
              type="text"
              list="tutor-model-suggestions"
              value={llmConfig.model}
              onChange={(e) => setLlmConfig({ ...llmConfig, model: e.target.value })}
              placeholder="Model name"
            />
            <datalist id="tutor-model-suggestions">
              <option value="gemini-3.8-flash" />
              <option value="gemini-3.5-flash-lite" />
              <option value="gemini-2.5-flash" />
              <option value="gpt-4o-mini" />
              <option value="gpt-4o" />
              <option value="claude-3-5-sonnet-latest" />
            </datalist>
          </div>
          <input
            type="password"
            value={llmConfig.apiKey}
            onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
            placeholder={
              isVi
                ? 'Dán API Key (lưu trong trình duyệt của bạn)...'
                : 'Paste API Key (stored locally in browser)...'
            }
          />
          <div className="tutor-key-actions">
            <button type="submit" className="btn-primary" style={{ padding: '0.38rem 0.75rem', fontSize: '0.76rem' }}>
              {isVi ? 'Lưu Key' : 'Save Key'}
            </button>
            <button
              type="button"
              className="btn-ghost-sm"
              onClick={() => setShowKeyForm(false)}
            >
              {isVi ? 'Đóng' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* Messages Feed */}
      <div className="tutor-messages-list" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`tutor-msg ${msg.role}`}>
            <div className={`tutor-msg-bubble ${msg.content === '...' ? 'typing' : ''}`}>
              {msg.content === '...' ? (
                <span>{isVi ? 'Đang kết nối & trả lời...' : 'Streaming response...'}</span>
              ) : (
                msg.content.split('\n').map((line, i) => <p key={i}>{line || '\u00A0'}</p>)
              )}
            </div>
          </div>
        ))}
        {isLoading && !hasLiveKey && (
          <div className="tutor-msg assistant">
            <div className="tutor-msg-bubble typing">
              {isVi ? 'Đang suy nghĩ...' : 'Thinking...'}
            </div>
          </div>
        )}
      </div>

      {/* Quick Context Prompts */}
      <div className="tutor-quick-prompts">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            className="tutor-chip-btn"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        className="tutor-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isVi
              ? 'Hỏi bất kỳ thuật ngữ hay chỗ nào chưa hiểu...'
              : 'Ask about any term or concept...'
          }
          disabled={isLoading}
        />
        <button
          type="submit"
          className="tutor-send-btn"
          disabled={isLoading || !input.trim()}
          aria-label="Send question"
        >
          <Send size={16} />
        </button>
      </form>
    </aside>
  );
};
