import React, { useState } from 'react';
import { ROLES, STATUS_META, WORKFLOW_STEPS, STATUS_FLOW } from '../workflow-data.js';
import { JIRA, StatusLozenge, Avatar, JiraButton } from '../workflow-ui.jsx';

// 옵션 B: Jira 이슈 시뮬레이터
export default function JiraSimArtboard() {
  const [currentStatus, setCurrentStatus] = useState('To Do');
  const [assignee, setAssignee] = useState('design');
  const [viewAs, setViewAs] = useState('design');
  const [comments, setComments] = useState([
    { id: 1, role: 'design', text: 'HW 변경 사항: Camera Sensor 모듈 IMX989 → IMX990 교체. Power rail 변경 없음.', time: '4월 18일 오전 10:12' },
  ]);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const nextStep = WORKFLOW_STEPS.find((s) => s.from === currentStatus && !completedSteps.has(s.id));

  const runStep = (step) => {
    setCurrentStatus(step.to);
    setAssignee(step.actor);
    setCompletedSteps((prev) => new Set([...prev, step.id]));
    setComments((c) => [
      ...c,
      {
        id: c.length + 1,
        role: step.actor,
        text: `[${step.title}] ${step.action}`,
        time: `방금 전`,
        system: true,
      },
    ]);
  };

  const reset = () => {
    setCurrentStatus('To Do');
    setAssignee('design');
    setCompletedSteps(new Set());
    setComments([
      { id: 1, role: 'design', text: 'HW 변경 사항: Camera Sensor 모듈 IMX989 → IMX990 교체. Power rail 변경 없음.', time: '4월 18일 오전 10:12' },
    ]);
  };

  const meta = STATUS_META[currentStatus];
  const viewRole = ROLES[viewAs];
  const isMyTurn = assignee === viewAs;
  const myStepNow = nextStep && nextStep.actor === viewAs;

  return (
    <div style={{ width: '100%', height: '100%', background: JIRA.bg, fontFamily: JIRA.font, color: JIRA.text, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#0747A6', color: '#fff', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 13 }}>
        <div style={{ fontWeight: 700, letterSpacing: -0.2 }}>⟁ Jira</div>
        <div style={{ opacity: 0.6 }}>/</div>
        <div style={{ opacity: 0.9 }}>SOCSW</div>
        <div style={{ opacity: 0.6 }}>/</div>
        <div>HW Change List</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, opacity: 0.8 }}>관점:</div>
        {Object.keys(ROLES).map((r) => (
          <button key={r} onClick={() => setViewAs(r)}
            style={{
              padding: '3px 8px', borderRadius: 3,
              border: 'none',
              background: viewAs === r ? '#fff' : 'rgba(255,255,255,0.15)',
              color: viewAs === r ? '#0747A6' : '#fff',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              fontFamily: JIRA.font,
            }}>{ROLES[r].short}</button>
        ))}
      </div>

      <div style={{ padding: '12px 24px 8px', background: '#fff' }}>
        <div style={{ fontSize: 11.5, color: JIRA.textSub, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>프로젝트</span><span>›</span>
          <span>SOCSW</span><span>›</span>
          <span style={{ color: JIRA.link, fontWeight: 500 }}>SOCSW-4271</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, margin: '6px 0 0', letterSpacing: -0.2, lineHeight: 1.3 }}>
          [HW Guide] Camera Sensor IMX989 → IMX990 교체
        </h1>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 20, padding: '0 24px 20px', background: '#fff', borderBottom: `1px solid ${JIRA.border}`, overflow: 'hidden', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 10px',
              border: `1px solid ${meta.fg}`,
              borderRadius: 3,
              background: meta.bg,
              color: meta.fg,
              fontSize: 12, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
            }}>
              {currentStatus}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 4l3 3 3-3"/></svg>
            </div>
            {nextStep && (
              <JiraButton primary onClick={() => runStep(nextStep)}>
                → {nextStep.to}
              </JiraButton>
            )}
            {currentStatus === 'Closed' && (
              <JiraButton onClick={reset}>Reopen (Reset)</JiraButton>
            )}
            <div style={{ flex: 1 }} />
            {isMyTurn && (
              <div style={{
                padding: '4px 10px', background: '#FFF7E6',
                border: '1px solid #FFC400', borderRadius: 3,
                fontSize: 11, fontWeight: 600, color: '#974F0C',
              }}>
                ⚡ {viewRole.short} 담당자 차례입니다
              </div>
            )}
          </div>

          <div style={{ border: `1px solid ${JIRA.border}`, borderRadius: 3, padding: '10px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3, marginBottom: 6 }}>DESCRIPTION</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>(1) HW Change</span> — Camera Sensor 모듈 IMX989 → IMX990 교체
              </div>
              <div style={{ marginBottom: 8, color: completedSteps.has('step-4') ? JIRA.text : JIRA.textMute }}>
                <span style={{ fontWeight: 600 }}>(2) DV Verification</span> — {completedSteps.has('step-4') ? '전류 소모 +2%, 이미지 품질 spec 내, thermal 4℃ 상승 (허용 범위)' : '— 미작성 —'}
              </div>
              <div style={{ color: completedSteps.has('step-7') ? JIRA.text : JIRA.textMute }}>
                <span style={{ fontWeight: 600 }}>(3) SW Feature/Validation</span> — {completedSteps.has('step-7') ? 'Camera HAL 업데이트, tuning 재적용 완료. Regression 이상 없음.' : '— 미작성 —'}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Activity</div>
            {comments.map((c) => {
              const r = ROLES[c.role];
              return (
                <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                  <Avatar role={c.role} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{r.short} 담당자</span>
                      <span style={{ fontSize: 11, color: JIRA.textMute }}>{c.time}</span>
                      {c.system && (
                        <span style={{ fontSize: 9.5, padding: '1px 5px', background: '#F4F5F7', color: JIRA.textSub, borderRadius: 2, fontWeight: 600, letterSpacing: 0.3 }}>SYSTEM</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12.5, color: JIRA.text, lineHeight: 1.55, background: c.system ? '#F4F5F7' : 'transparent', padding: c.system ? '6px 10px' : 0, borderRadius: 3 }}>
                      {c.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${JIRA.border}`, paddingLeft: 18, paddingTop: 12, overflow: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3, marginBottom: 10 }}>Details</div>

          <DetailRow label="Assignee">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Avatar role={assignee} size={22} />
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>{ROLES[assignee].label}</span>
            </div>
          </DetailRow>
          <DetailRow label="Reporter">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Avatar role="design" size={22} />
              <span style={{ fontSize: 12.5 }}>설계 담당자</span>
            </div>
          </DetailRow>
          <DetailRow label="Status">
            <StatusLozenge status={currentStatus} />
          </DetailRow>
          <DetailRow label="Priority">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
              <span style={{ color: '#E34935' }}>▲</span> High
            </div>
          </DetailRow>
          <DetailRow label="Labels">
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['hw-change', 'camera', 'pilot'].map((l) => (
                <span key={l} style={{ fontSize: 10.5, padding: '1px 6px', background: '#F4F5F7', color: JIRA.textSub, borderRadius: 3 }}>{l}</span>
              ))}
            </div>
          </DetailRow>

          <div style={{ margin: '18px 0 10px', fontSize: 11, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3 }}>Subtasks</div>
          <SubtaskRow label="Platform Review" done={completedSteps.has('step-5')} />
          <SubtaskRow label="SW Review" done={completedSteps.has('step-5')} />
          <SubtaskRow label="Platform Validation" done={completedSteps.has('step-7')} />
          <SubtaskRow label="SW Validation" done={completedSteps.has('step-7')} />

          {nextStep && myStepNow && (
            <div style={{ marginTop: 18, padding: 10, background: '#DEEBFF', border: '1px solid #4C9AFF', borderRadius: 3 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#0747A6', letterSpacing: 0.3, marginBottom: 4 }}>MY NEXT ACTION</div>
              <div style={{ fontSize: 12, color: JIRA.text, fontWeight: 500, lineHeight: 1.4 }}>{nextStep.title}</div>
              <div style={{ fontSize: 11, color: JIRA.textSub, marginTop: 4, lineHeight: 1.4 }}>{nextStep.action}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#FAFBFC', padding: '10px 24px 14px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: JIRA.textSub, letterSpacing: 0.3, marginBottom: 6 }}>WORKFLOW PROGRESS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {STATUS_FLOW.map((s, i) => {
            const passed = STATUS_FLOW.indexOf(currentStatus) > i;
            const current = s === currentStatus;
            return (
              <React.Fragment key={s}>
                <div style={{
                  flex: 1, minWidth: 0, padding: '4px 6px',
                  borderRadius: 3,
                  background: current ? STATUS_META[s].bg : passed ? '#E3FCEF' : '#fff',
                  border: `1px solid ${current ? STATUS_META[s].fg : passed ? '#ABF5D1' : JIRA.border}`,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.2, textTransform: 'uppercase',
                  color: current ? STATUS_META[s].fg : passed ? '#006644' : JIRA.textMute,
                  textAlign: 'center',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  transition: 'all 0.2s',
                }}>
                  {passed && '✓ '}{s}
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <span style={{ color: JIRA.borderStrong, fontSize: 10 }}>›</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: JIRA.textSub, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

function SubtaskRow({ label, done }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '5px 0', fontSize: 12,
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 2,
        border: `1.5px solid ${done ? '#006644' : JIRA.borderStrong}`,
        background: done ? '#006644' : '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 9, fontWeight: 700,
      }}>{done && '✓'}</span>
      <span style={{ color: done ? JIRA.textMute : JIRA.text, textDecoration: done ? 'line-through' : 'none' }}>{label}</span>
    </div>
  );
}
