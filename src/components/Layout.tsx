import { useAppStore } from '../store/useStore';
import { CHAPTERS } from '../chapters';

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    activeChapterId, activeSectionId,
    expandedChapters, toggleChapter, setActiveSection,
    language, toggleLanguage,
  } = useAppStore();

  return (
    <div className="app-layout">
      {/* Sidebar: Chapter Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">MathBridge</h1>
          <p className="app-subtitle">
            {language === 'zh'
              ? '同济高数 · 微积分 ↔ 线性代数 带学平台'
              : 'Calculus ↔ Linear Algebra Guided Learning'}
          </p>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>

        <nav className="chapter-nav">
          {CHAPTERS.map((ch) => {
            const isExpanded = expandedChapters.has(ch.id);
            const isActive = activeChapterId === ch.id;
            return (
              <div key={ch.id} className="chapter-group">
                <button
                  className={`chapter-toggle ${isActive ? 'active' : ''}`}
                  onClick={() => toggleChapter(ch.id)}
                >
                  <span className="chapter-number">第{ch.number}章</span>
                  <span className="chapter-title">
                    {language === 'zh' ? ch.titleZh : ch.title}
                  </span>
                  <span className="chapter-arrow">{isExpanded ? '▾' : '▸'}</span>
                </button>
                {isExpanded && (
                  <div className="section-list">
                    {ch.sections.map((sec) => {
                      const isSecActive = activeSectionId === sec.id;
                      return (
                        <button
                          key={sec.id}
                          className={`section-link ${isSecActive ? 'active' : ''}`}
                          onClick={() => setActiveSection(ch.id, sec.id)}
                        >
                          <span className="section-num">{ch.number}.{ch.sections.indexOf(sec) + 1}</span>
                          <span className="section-title">
                            {language === 'zh' ? sec.titleZh : sec.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
