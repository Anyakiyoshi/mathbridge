import { useState, useRef, useEffect } from 'react';
import { gradeAnswer, askFollowUp, type GradeResult } from '../utils/deepseek';
import Formula from './Formula';

interface PracticeProblemProps {
  question: string;      // The problem statement (support Markdown/LaTeX)
  context: string;       // Chapter context for AI
  hint?: string;         // Optional hint
}

export default function PracticeProblem({ question, context, hint }: PracticeProblemProps) {
  const [answer, setAnswer] = useState('');
  const [isJudging, setIsJudging] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Follow-up chat
  const [followUp, setFollowUp] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isChatting, setIsChatting] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setIsJudging(true);
    setError('');
    setResult(null);
    try {
      const res = await gradeAnswer(question, answer, context);
      setResult(res);
    } catch (err: any) {
      setError(err.message || '评判失败');
    }
    setIsJudging(false);
  };

  const handleFollowUp = async () => {
    if (!followUp.trim()) return;
    setIsChatting(true);
    const newHistory = [...chatHistory, { role: 'user' as const, content: followUp }];
    setChatHistory(newHistory);
    setFollowUp('');
    try {
      const reply = await askFollowUp(question, answer, context, followUp, chatHistory);
      setChatHistory([...newHistory, { role: 'assistant' as const, content: reply }]);
    } catch (err: any) {
      setChatHistory([...newHistory, { role: 'assistant' as const, content: `错误: ${err.message}` }]);
    }
    setIsChatting(false);
  };

  const correctLabel = result?.correct === true ? '✅ 正确!'
    : result?.correct === 'partial' ? '⚠️ 部分正确'
    : result?.correct === false ? '❌ 需要改进'
    : '';

  return (
    <div className="practice-box">
      <h4>📝 练习</h4>
      <div className="practice-question">
        <p>{question}</p>
      </div>

      {hint && (
        <div className="practice-hint-area">
          <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>
            {showHint ? '🔽 隐藏提示' : '💡 显示提示'}
          </button>
          {showHint && <p className="hint-text">{hint}</p>}
        </div>
      )}

      <div className="practice-input-area">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="在这里输入你的答案..."
          rows={4}
          disabled={isJudging}
        />
        <button
          className="practice-submit"
          onClick={handleSubmit}
          disabled={isJudging || !answer.trim()}
        >
          {isJudging ? '⏳ AI 评判中...' : '📤 提交评判'}
        </button>
      </div>

      {error && <div className="practice-error">{error}</div>}

      {result && (
        <div className={`practice-result ${result.correct === true ? 'correct' : result.correct === 'partial' ? 'partial' : 'wrong'}`}>
          <div className="result-header">
            <span className="result-score">{correctLabel} &nbsp; {result.score}</span>
          </div>
          <div className="result-explanation" dangerouslySetInnerHTML={{ __html: renderMarkdown(result.explanation) }} />
          {result.correctAnswer && result.correct !== true && (
            <div className="result-correct-answer">
              <strong>正确答案：</strong>
              <span dangerouslySetInnerHTML={{ __html: renderMarkdown(result.correctAnswer) }} />
            </div>
          )}
        </div>
      )}

      {/* Follow-up chat */}
      {result && (
        <div className="practice-chat">
          <h5>💬 追问 AI 助教</h5>
          <div className="chat-messages">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <strong>{msg.role === 'user' ? '你' : '🤖 AI 助教'}:</strong>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-row">
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="追问，例如：这个解法的原理是什么？"
              onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
              disabled={isChatting}
            />
            <button onClick={handleFollowUp} disabled={isChatting || !followUp.trim()}>
              {isChatting ? '...' : '发送'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Markdown→HTML renderer (bold, code, LaTeX delimiters preserved)
function renderMarkdown(text: string): string {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^## (.+)$/gm, '<h4>$1</h4>')
    .replace(/^# (.+)$/gm, '<h3>$1</h3>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  return `<p>${html}</p>`;
}
