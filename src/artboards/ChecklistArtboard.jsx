import React, { useState } from 'react';
import { ROLES, STATUS_META, WORKFLOW_STEPS } from '../workflow-data.js';
import { JIRA, StatusLozenge, Avatar, RoleChip, Arrow } from '../workflow-ui.jsx';

// 옵션 C: 체크리스트 타임라인
export default function ChecklistArtboard() {
  const [expanded, setExpanded] = useState(new Set(['step-1']));
  const [checked, setChecked] = useState({});
  const [activeRole, setActiveRole] = useState('all');

  const toggle = (id) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleCheck = (stepId, idx) => {
    const key = `${stepId}:${idx}`;
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  };

  const visibleSteps = activeRole === 'all'
    ? WORKFLOW_STEPS
    : WORKFLOW_STEPS.filter((s) => s.actor === activeRole);

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', fontFamily: JIRA.font, color: JIRA.text, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '20px 28px 14px', borderBottom: `1px solid ${JIRA.border}` }}>
        <div style={{ fontSize: 11, color: JIRA.textSub, fontWeight: 600, letterSpacing: 0.4, marginBottom: 4 }}>SOCSW · HW GUIDE WORKFLOW</div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: -0.3 }}>단계별 체크리스트 가이드</h1>
        <div style={{ fontSize: 13, color: JIRA.textSub, marginTop: 4 }}>
          각 단계를 클릭하여 세부 체크리스트와 상태 전이 조건을 확인하세요.
        </div>
      </div>

      <div style={{ padding: '10px 28px', borderBottom: `1px solid ${JIRA.border}`, background: '#FAFBFC', display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => setActiveRole('all')}
          style={{
            padding: '5px 12px',
            fontSize: 12, fontWeight: 500,
            border: `1px solid ${activeRole === 'all' ? JIRA.link : JIRA.border}`,
            background: activeRole === 'all' ? JIRA.link : '#fff',
            color: activeRole === 'all' ? '#fff' : JIRA.text,
            borderRadius: 3, cursor: 'pointer', fontFamily: JIRA.font,
          }}>전체 ({WORKFLOW_STEPS.length})</button>
        {Object.keys(ROLES).map((r) => (
          <RoleChip key={r} role={r} active={activeRole === r}
            onClick={() => setActiveRole(activeRole === r ? 'all' : r)} compact />
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, color: JIRA.textSub }}>
          진행: {Object.values(checked).filter(Boolean).length} / {visibleSteps.reduce((a, s) => a + s.checklist.length, 0)}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
        {visibleSteps.map((step, idx) => {
          const r = ROLES[step.actor];
          const isOpen = expanded.has(step.id);
          const stepNum = step.id.split('-')[1];
          const doneCount = step.checklist.filter((_, i) => checked[`${step.id}:${i}`]).length;
          const allDone = doneCount === step.checklist.length;

          return (
            <div key={step.id} style={{ position: 'relative', paddingLeft: 48, paddingBottom: idx < visibleSteps.length - 1 ? 12 : 0 }}>
              {idx < visibleSteps.length - 1 && (
                <div style={{
                  position: 'absolute', left: 17, top: 34, bottom: 0,
                  width: 2, background: JIRA.border,
                }} />
              )}
              <div style={{
                position: 'absolute', left: 0, top: 2,
                width: 36, height: 36, borderRadius: '50%',
                background: allDone ? '#006644' : r.color,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                boxShadow: `0 0 0 4px #fff, 0 0 0 5px ${allDone ? '#006644' : r.color}40`,
              }}>{allDone ? '✓' : stepNum}</div>

              <div style={{
                border: `1px solid ${isOpen ? r.color : JIRA.border}`,
                borderRadius: 5, background: '#fff',
                boxShadow: isOpen ? `0 2px 8px ${r.color}20` : 'none',
                transition: 'all 0.15s',
              }}>
                <button onClick={() => toggle(step.id)}
                  style={{
                    width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '12px 14px', textAlign: 'left', fontFamily: JIRA.font,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <StatusLozenge status={step.from} size="sm" />
                      <Arrow direction="right" size={10} />
                      <StatusLozenge status={step.to} size="sm" />
                      <span style={{ color: JIRA.border, margin: '0 2px' }}>·</span>
                      <Avatar role={step.actor} size={18} />
                      <span style={{ fontSize: 11, color: r.color, fontWeight: 600 }}>{r.label}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: JIRA.text, letterSpacing: -0.1 }}>
                      {step.title}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '3px 8px', borderRadius: 10,
                    background: allDone ? '#E3FCEF' : doneCount > 0 ? '#FFF7E6' : '#F4F5F7',
                    color: allDone ? '#006644' : doneCount > 0 ? '#974F0C' : JIRA.textSub,
                    whiteSpace: 'nowrap',
                  }}>{doneCount}/{step.checklist.length}</div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={JIRA.textSub} strokeWidth="1.8" strokeLinecap="round"
                    style={{ transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: 'transform 0.15s' }}>
                    <path d="M3 5l4 4 4-4"/>
                  </svg>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 14px 14px 14px', borderTop: `1px solid ${JIRA.border}` }}>
                    <div style={{ fontSize: 12.5, color: JIRA.textSub, lineHeight: 1.6, padding: '12px 0 10px' }}>
                      {step.description}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3, marginBottom: 8 }}>CHECKLIST</div>
                      {step.checklist.map((item, i) => {
                        const key = `${step.id}:${i}`;
                        const isChecked = !!checked[key];
                        return (
                          <label key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            padding: '6px 8px', borderRadius: 3, cursor: 'pointer',
                            background: isChecked ? '#FAFBFC' : 'transparent',
                          }}
                          onMouseEnter={(e) => { if (!isChecked) e.currentTarget.style.background = JIRA.hover; }}
                          onMouseLeave={(e) => { if (!isChecked) e.currentTarget.style.background = 'transparent'; }}>
                            <span onClick={() => toggleCheck(step.id, i)} style={{
                              width: 16, height: 16, borderRadius: 3, marginTop: 1,
                              border: `1.5px solid ${isChecked ? '#006644' : JIRA.borderStrong}`,
                              background: isChecked ? '#006644' : '#fff',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0,
                              transition: 'all 0.12s',
                            }}>{isChecked && '✓'}</span>
                            <span style={{
                              fontSize: 12.5, lineHeight: 1.5,
                              color: isChecked ? JIRA.textMute : JIRA.text,
                              textDecoration: isChecked ? 'line-through' : 'none',
                            }}>{item}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <InfoBlock label="TRIGGER (진입)" color={STATUS_META[step.from].color}>
                        {STATUS_META[step.from].entryCriteria}
                      </InfoBlock>
                      <InfoBlock label="ACTION (이행)" color={r.color}>
                        {step.action}
                      </InfoBlock>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 30, padding: '14px 16px', background: '#FAFBFC', border: `1px solid ${JIRA.border}`, borderRadius: 5 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3, marginBottom: 10 }}>ROLE & RESPONSIBILITY</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Object.entries(ROLES).map(([k, r]) => (
              <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Avatar role={k} size={24} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: r.color }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, color: JIRA.textSub, lineHeight: 1.45, marginTop: 2 }}>{r.responsibility}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, color, children }) {
  return (
    <div style={{
      flex: '1 1 200px', minWidth: 180,
      padding: '8px 10px',
      background: '#FAFBFC',
      borderLeft: `3px solid ${color}`,
      borderRadius: 3,
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 12, color: JIRA.text, lineHeight: 1.45 }}>{children}</div>
    </div>
  );
}
