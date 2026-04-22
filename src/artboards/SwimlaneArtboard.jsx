import React, { useState } from 'react';
import { ROLES, WORKFLOW_STEPS, STATUS_FLOW } from '../workflow-data.js';
import { JIRA, StatusLozenge, Avatar, RoleChip, Arrow } from '../workflow-ui.jsx';

// 옵션 A: Swimlane 다이어그램
// 4개 레인(Design/DV/Platform/SW) × 8개 상태 흐름
export default function SwimlaneArtboard() {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [selectedStep, setSelectedStep] = useState('step-1');
  const [activeRoles, setActiveRoles] = useState({
    design: true, dv: true, platform: true, sw: true,
  });

  const toggleRole = (role) => setActiveRoles((r) => ({ ...r, [role]: !r[role] }));

  const step = WORKFLOW_STEPS.find((s) => s.id === (hoveredStep || selectedStep));
  const roleOrder = ['design', 'dv', 'platform', 'sw'];

  const stepLane = {
    'step-1': 'design',
    'step-2': 'dv',
    'step-3': 'dv',
    'step-4': 'dv',
    'step-5': 'platform',
    'step-6': 'platform',
    'step-7': 'sw',
    'step-8': 'design',
  };
  const laneColumnForStep = {
    'step-1': 0, 'step-2': 1, 'step-3': 2, 'step-4': 3,
    'step-5': 4, 'step-6': 5, 'step-7': 6, 'step-8': 7,
  };

  const colW = 155;
  const laneH = 88;
  const leftGutter = 140;

  return (
    <div style={{ width: '100%', height: '100%', background: JIRA.bg, fontFamily: JIRA.font, color: JIRA.text, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 28px 14px', borderBottom: `1px solid ${JIRA.border}`, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: JIRA.textSub, fontWeight: 600, letterSpacing: 0.4 }}>SOCSW · HW GUIDE WORKFLOW</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: -0.3 }}>
          HW Change List — Swimlane 다이어그램
        </h1>
        <div style={{ fontSize: 13, color: JIRA.textSub, marginTop: 4 }}>
          Design → DV → Platform/SW → Design 순서로 진행되는 전체 워크플로우
        </div>
      </div>

      <div style={{ padding: '12px 28px', borderBottom: `1px solid ${JIRA.border}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: JIRA.textSub, fontWeight: 600 }}>레인:</span>
        {roleOrder.map((r) => (
          <RoleChip key={r} role={r} active={activeRoles[r]} onClick={() => toggleRole(r)} compact />
        ))}
      </div>

      <div style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        <div style={{ position: 'relative', width: leftGutter + colW * 8 + 20, minHeight: laneH * 4 + 60 }}>
          <div style={{ display: 'flex', marginLeft: leftGutter, marginBottom: 14 }}>
            {STATUS_FLOW.map((status) => (
              <div key={status} style={{ width: colW, display: 'flex', justifyContent: 'center' }}>
                <StatusLozenge status={status} size="sm" />
              </div>
            ))}
          </div>

          {roleOrder.map((role, ri) => {
            const r = ROLES[role];
            const dimmed = !activeRoles[role];
            return (
              <div key={role} style={{
                display: 'flex',
                alignItems: 'stretch',
                minHeight: laneH,
                borderTop: ri === 0 ? `1px solid ${JIRA.border}` : 'none',
                borderBottom: `1px solid ${JIRA.border}`,
                background: ri % 2 === 0 ? '#FAFBFC' : '#fff',
                opacity: dimmed ? 0.35 : 1,
                transition: 'opacity 0.18s',
              }}>
                <div style={{
                  width: leftGutter,
                  padding: '14px 12px',
                  borderRight: `2px solid ${r.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 4,
                  background: '#fff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Avatar role={role} size={22} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{r.short}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: JIRA.textSub, lineHeight: 1.3, marginLeft: 2 }}>
                    {r.responsibility.split(' 후 ').map((t, i, arr) => (
                      <span key={i}>{t}{i < arr.length - 1 ? ' 후' : ''}<br/></span>
                    ))}
                  </div>
                </div>

                <div style={{ position: 'relative', flex: 1 }}>
                  {WORKFLOW_STEPS.filter((s) => stepLane[s.id] === role).map((s) => {
                    const col = laneColumnForStep[s.id];
                    const isActive = hoveredStep === s.id || selectedStep === s.id;
                    return (
                      <button
                        key={s.id}
                        onMouseEnter={() => setHoveredStep(s.id)}
                        onMouseLeave={() => setHoveredStep(null)}
                        onClick={() => setSelectedStep(s.id)}
                        style={{
                          position: 'absolute',
                          left: col * colW + 12,
                          top: 14,
                          width: colW - 24,
                          height: laneH - 28,
                          background: isActive ? r.color : '#fff',
                          border: `1.5px solid ${isActive ? r.color : JIRA.border}`,
                          borderRadius: 4,
                          padding: '8px 10px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          boxShadow: isActive ? `0 2px 8px ${r.color}40` : '0 1px 2px rgba(9,30,66,0.08)',
                          transition: 'all 0.12s',
                          color: isActive ? '#fff' : JIRA.text,
                          fontFamily: JIRA.font,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, opacity: isActive ? 0.85 : 0.65 }}>
                          STEP {s.id.split('-')[1]}
                        </div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {s.title}
                        </div>
                      </button>
                    );
                  })}

                  {role === 'platform' && (
                    <div style={{
                      position: 'absolute',
                      left: laneColumnForStep['step-5'] * colW + colW - 18,
                      top: -30,
                      fontSize: 9.5,
                      color: JIRA.textMute,
                      fontWeight: 500,
                    }}>
                      DV→Design→Platform→SW
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <svg style={{ position: 'absolute', top: 50, left: leftGutter, pointerEvents: 'none' }}
            width={colW * 8} height={laneH * 4 + 10}>
            {[
              { fromCol: 0, fromRow: 0, toCol: 1, toRow: 1 },
              { fromCol: 3, fromRow: 1, toCol: 4, toRow: 2 },
              { fromCol: 6, fromRow: 3, toCol: 7, toRow: 0 },
            ].map((a, i) => {
              const x1 = a.fromCol * colW + colW - 12;
              const y1 = a.fromRow * laneH + (laneH - 14) / 2 + 14;
              const x2 = a.toCol * colW + 12;
              const y2 = a.toRow * laneH + (laneH - 14) / 2 + 14;
              return (
                <g key={i}>
                  <path
                    d={`M ${x1} ${y1} C ${x1 + 30} ${y1}, ${x2 - 30} ${y2}, ${x2} ${y2}`}
                    stroke={JIRA.borderStrong} strokeWidth="1.5" fill="none" strokeDasharray="4 3"
                  />
                  <circle cx={x2} cy={y2} r="3" fill={JIRA.borderStrong} />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div style={{
        borderTop: `1px solid ${JIRA.border}`,
        background: '#fff',
        padding: '16px 28px 20px',
        minHeight: 160,
      }}>
        {step && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <StatusLozenge status={step.from} size="sm" />
              <Arrow direction="right" />
              <StatusLozenge status={step.to} size="sm" />
              <span style={{ color: JIRA.border, margin: '0 6px' }}>·</span>
              <Avatar role={step.actor} size={20} />
              <span style={{ fontSize: 12, fontWeight: 500, color: ROLES[step.actor].color }}>
                {ROLES[step.actor].label}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, letterSpacing: -0.2 }}>
              Step {step.id.split('-')[1]} — {step.title}
            </div>
            <div style={{ fontSize: 12.5, color: JIRA.textSub, lineHeight: 1.55, marginBottom: 10 }}>
              {step.description}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#F4F5F7', borderRadius: 3, borderLeft: `3px solid ${ROLES[step.actor].color}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3 }}>ACTION</span>
              <span style={{ fontSize: 12.5, color: JIRA.text, fontWeight: 500 }}>{step.action}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
