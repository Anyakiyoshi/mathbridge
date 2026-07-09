// DeepSeek API client — OpenAI-compatible endpoint
// API Key is read from Vite environment variable VITE_DEEPSEEK_API_KEY
// Set it in .env.local file (gitignored, never uploaded to GitHub)

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

function getApiKey(): string {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!key || key === 'sk-your-deepseek-api-key-here' || key.trim() === '') {
    throw new Error(
      'API Key 未配置。请在项目根目录的 .env.local 文件中设置:\n' +
      'VITE_DEEPSEEK_API_KEY=sk-你的真实key\n' +
      '然后重新运行 npm run dev 或 npm run build'
    );
  }
  return key;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithDeepSeek(
  messages: ChatMessage[],
): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API 错误 (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// --- Practice-specific: Grade a student's answer ---

export interface GradeResult {
  correct: boolean | 'partial';
  score: string;
  explanation: string;
  correctAnswer: string;
}

export async function gradeAnswer(
  question: string,
  studentAnswer: string,
  context: string
): Promise<GradeResult> {
  const systemPrompt = `你是一位耐心的高等数学老师。学生正在学习同济大学《高等数学》教材。
当前章节背景：${context}

学生回答了下面的问题。请：
1. 判断答案是否正确（完全正确/部分正确/错误）
2. 给出评分（如 8/10）
3. 用中文详细解释：答案哪里对了、哪里错了、正确做法是什么
4. 如果答案错了，指出错在哪里并提供正确解法

请以 JSON 格式回复：
{
  "correct": true/false/"partial",
  "score": "分数/总分",
  "explanation": "详细解释（使用 Markdown，公式用 $...$ 或 $$...$$，可以分点说明）",
  "correctAnswer": "正确答案"
}`;

  const userPrompt = `问题：${question}\n\n学生的回答：${studentAnswer}\n\n请评判并给出详细解释。`;

  const raw = await chatWithDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]) as GradeResult;
  }
  return {
    correct: 'partial',
    score: '?/10',
    explanation: raw,
    correctAnswer: '见上方解释',
  };
}

// --- Follow-up chat ---
export async function askFollowUp(
  question: string,
  studentAnswer: string,
  context: string,
  followUpQuestion: string,
  chatHistory: ChatMessage[]
): Promise<string> {
  const systemPrompt = `你是一位耐心的高等数学老师。当前正在讨论以下问题：
问题：${question}
学生的回答：${studentAnswer}
章节背景：${context}

学生现在提出了追问。请用中文详细回答，鼓励学生深入思考。公式使用 $...$ 或 $$...$$ 格式。`;

  const allMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...chatHistory,
    { role: 'user', content: followUpQuestion },
  ];

  return await chatWithDeepSeek(allMessages);
}

// --- Generate a new practice question ---
export interface GeneratedQuestion {
  question: string;
  hint: string;
  difficulty: string; // e.g. "基础" / "中等" / "挑战"
}

export async function generateQuestion(
  context: string,
  previousQuestions: string[] = [],
  difficulty: string = '中等'
): Promise<GeneratedQuestion> {
  const prevQs = previousQuestions.length > 0
    ? `之前出过的题目（不要重复）：\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  const systemPrompt = `你是一位高等数学老师，需要为学生出练习题。
当前章节背景：${context}
难度要求：${difficulty}

${prevQs}

请出一道新的练习题，要求：
1. 题目清晰完整，适合当前章节的知识范围
2. 给出一个简洁的提示（不直接给答案，但给出解题方向）
3. 标注难度

请以 JSON 格式回复：
{
  "question": "题目描述（可使用 LaTeX 公式，如 $\\\\int x^2 dx$）",
  "hint": "简洁提示（1-2句话）",
  "difficulty": "基础/中等/挑战"
}`;

  const raw = await chatWithDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: '请出一道新题。' },
  ]);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as GeneratedQuestion;
    } catch { /* fall through */ }
  }
  // Fallback
  return {
    question: '请用本章知识计算: ∫ x·sin(x²) dx',
    hint: '使用换元法，令 u = x²',
    difficulty: '中等',
  };
}
