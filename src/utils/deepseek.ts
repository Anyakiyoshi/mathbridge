// DeepSeek API client — OpenAI-compatible endpoint
// API Key is stored in localStorage

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export function getApiKey(): string | null {
  return localStorage.getItem('deepseek_api_key');
}

export function setApiKey(key: string): void {
  localStorage.setItem('deepseek_api_key', key);
}

export function clearApiKey(): void {
  localStorage.removeItem('deepseek_api_key');
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithDeepSeek(
  messages: ChatMessage[],
  stream: boolean = false
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API Key 未设置。请在侧边栏设置 DeepSeek API Key。');
  }

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
      stream,
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
  score: string;       // e.g. "7/10"
  explanation: string; // detailed feedback
  correctAnswer: string;
}

export async function gradeAnswer(
  question: string,
  studentAnswer: string,
  context: string // chapter context
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

  const userPrompt = `问题：${question}

学生的回答：${studentAnswer}

请评判并给出详细解释。`;

  try {
    const raw = await chatWithDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    // Try to parse JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GradeResult;
    }
    // Fallback: treat entire response as explanation
    return {
      correct: 'partial',
      score: '?/10',
      explanation: raw,
      correctAnswer: '见上方解释',
    };
  } catch (err: any) {
    throw new Error(`评判失败: ${err.message}`);
  }
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
