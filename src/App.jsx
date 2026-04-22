import React, { useState } from 'react';
import SwimlaneArtboard from './artboards/SwimlaneArtboard.jsx';
import JiraSimArtboard from './artboards/JiraSimArtboard.jsx';
import ChecklistArtboard from './artboards/ChecklistArtboard.jsx';
import { JIRA } from './workflow-ui.jsx';

const VIEWS = [
  { id: 'swimlane', label: 'Swimlane 다이어그램', sub: 'Option A', Component: SwimlaneArtboard },
  { id: 'jira-sim', label: 'Jira 이슈 시뮬레이터', sub: 'Option B', Component: JiraSimArtboard },
  { id: 'checklist', label: '체크리스트 타임라인', sub: 'Option C', Component: ChecklistArtboard },
];

export default function App() {
  const [active, setActive] = useState('swimlane');
  const view = VIEWS.find((v) => v.id === active);
  const Active = view.Component;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: JIRA.font }}>
      <header style={{
        flexShrink: 0,
        background: '#fff',
        borderBottom: `1px solid ${JIRA.border}`,
        padding: '12px 24px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, color: JIRA.text }}>
            HW Change List — Workflow Guide
          </span>
          <span style={{ fontSize: 12, color: JIRA.textSub }}>
            Jira 기반 HW 변경 관리 프로세스 · 3가지 시각화 옵션
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 2 }}>
          {VIEWS.map((v) => {
            const isActive = v.id === active;
            return (
              <button key={v.id} onClick={() => setActive(v.id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 14px 10px',
                  marginBottom: -1,
                  cursor: 'pointer',
                  fontFamily: JIRA.font,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? JIRA.link : JIRA.textSub,
                  borderBottom: `2px solid ${isActive ? JIRA.link : 'transparent'}`,
                  transition: 'color 0.12s, border-color 0.12s',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 6,
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = JIRA.text; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = JIRA.textSub; }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, opacity: 0.7 }}>{v.sub}</span>
                <span>{v.label}</span>
              </button>
            );
          })}
        </nav>
      </header>
      <main style={{ flex: 1, minHeight: 0, background: JIRA.bg }}>
        <Active />
      </main>
    </div>
  );
}
