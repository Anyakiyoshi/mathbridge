import Layout from './components/Layout';
import { useAppStore } from './store/useStore';
import { CHAPTERS } from './chapters';
import './App.css';

function App() {
  const activeChapterId = useAppStore((s) => s.activeChapterId);
  const activeSectionId = useAppStore((s) => s.activeSectionId);
  const language = useAppStore((s) => s.language);

  // Find the active section
  let activeSection = null;
  for (const ch of CHAPTERS) {
    if (ch.id === activeChapterId && activeSectionId) {
      activeSection = ch.sections.find((s) => s.id === activeSectionId);
      break;
    }
  }

  // Welcome screen when nothing is selected
  if (!activeSection) {
    return (
      <Layout>
        <div className="welcome-screen">
          <h2>{language === 'zh' ? '👋 欢迎来到 MathBridge' : '👋 Welcome to MathBridge'}</h2>
          <p>{language === 'zh'
            ? '左侧选择章节开始学习。本平台按照同济大学《高等数学》教材结构编排，每节配有交互可视化 + 线性代数关联讲解。'
            : 'Select a chapter from the left to begin. Structured after Tongji "Advanced Mathematics", with interactive visualizations and linear algebra connections.'}
          </p>
          <div className="welcome-toc">
            <h3>{language === 'zh' ? '📚 目录' : '📚 Table of Contents'}</h3>
            <div className="toc-list">
              {CHAPTERS.map((ch) => (
                <div key={ch.id} className="toc-chapter">
                  <strong>第{ch.number}章</strong> {language === 'zh' ? ch.titleZh : ch.title}
                  <span className="toc-volume">({language === 'zh' ? (ch.volume === 1 ? '上册' : '下册') : `Vol.${ch.volume}`})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const SectionContent = activeSection.content;
  const SectionVisual = activeSection.visual;

  return (
    <Layout>
      <div className="reader-container">
        {/* Visual (if any) */}
        {SectionVisual && (
          <div className="reader-visual">
            <SectionVisual />
          </div>
        )}

        {/* Text Content */}
        <div className="reader-content">
          <SectionContent />
        </div>

        {/* Linear Algebra Bridge */}
        {(activeSection.laBridge || activeSection.laBridgeZh) && (
          <div className="reader-la-bridge">
            <h4>🔗 线性代数桥梁</h4>
            <p>{language === 'zh' ? activeSection.laBridgeZh : activeSection.laBridge}</p>
          </div>
        )}

        {/* Section Navigation */}
        <div className="reader-nav">
          <button
            className="reader-nav-btn"
            onClick={() => {
              // Navigate to next section
              for (const ch of CHAPTERS) {
                if (ch.id === activeChapterId) {
                  const idx = ch.sections.findIndex((s) => s.id === activeSectionId);
                  if (idx < ch.sections.length - 1) {
                    useAppStore.getState().setActiveSection(ch.id, ch.sections[idx + 1].id);
                  } else {
                    // Next chapter first section
                    const chIdx = CHAPTERS.findIndex((c) => c.id === ch.id);
                    if (chIdx < CHAPTERS.length - 1) {
                      const nextCh = CHAPTERS[chIdx + 1];
                      useAppStore.getState().setActiveSection(nextCh.id, nextCh.sections[0].id);
                    }
                  }
                  break;
                }
              }
            }}
          >
            {language === 'zh' ? '下一节 →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default App;
