import { STATUS_META, ROLES } from './workflow-data.js';

export const JIRA = {
  bg: '#F4F5F7',
  panel: '#FFFFFF',
  border: '#DFE1E6',
  borderStrong: '#C1C7D0',
  text: '#172B4D',
  textSub: '#5E6C84',
  textMute: '#7A869A',
  link: '#0052CC',
  linkHover: '#0065FF',
  accent: '#0052CC',
  hover: '#EBECF0',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

export function StatusLozenge({ status, size = 'md' }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  const padding = size === 'sm' ? '1px 5px' : size === 'lg' ? '4px 9px' : '2px 7px';
  const fontSize = size === 'sm' ? 10 : size === 'lg' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding,
      borderRadius: 3,
      background: meta.bg,
      color: meta.fg,
      fontSize,
      fontWeight: 700,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      fontFamily: JIRA.font,
    }}>{status}</span>
  );
}

export function Avatar({ role, size = 24 }) {
  const r = ROLES[role];
  if (!r) return null;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size, height: size,
      borderRadius: '50%',
      background: r.color,
      color: '#fff',
      fontSize: size * 0.45,
      fontWeight: 700,
      fontFamily: JIRA.font,
      flexShrink: 0,
    }}>{r.emoji}</span>
  );
}

export function RoleChip({ role, active = true, onClick, compact = false }) {
  const r = ROLES[role];
  if (!r) return null;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: compact ? '3px 8px' : '5px 10px',
        borderRadius: 3,
        border: `1px solid ${active ? r.color : JIRA.border}`,
        background: active ? r.color : '#fff',
        color: active ? '#fff' : JIRA.text,
        fontSize: compact ? 11 : 12,
        fontWeight: 500,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: JIRA.font,
        transition: 'all 0.12s',
      }}
    >
      <span style={{
        width: compact ? 14 : 16,
        height: compact ? 14 : 16,
        borderRadius: '50%',
        background: active ? 'rgba(255,255,255,0.25)' : r.color,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: compact ? 8 : 9,
        fontWeight: 700,
      }}>{r.emoji}</span>
      {r.short}
    </button>
  );
}

export function JiraButton({ children, primary, onClick, disabled, size = 'md' }) {
  const padding = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? 12 : 13;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding,
        fontSize,
        fontWeight: 500,
        border: primary ? 'none' : `1px solid ${JIRA.border}`,
        background: disabled ? JIRA.hover : primary ? JIRA.link : '#fff',
        color: primary ? '#fff' : disabled ? JIRA.textMute : JIRA.text,
        borderRadius: 3,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: JIRA.font,
        transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = primary ? JIRA.linkHover : JIRA.hover;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = primary ? JIRA.link : '#fff';
      }}
    >{children}</button>
  );
}

export function Arrow({ direction = 'right', color = JIRA.borderStrong, size = 12 }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[direction] || 0;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M2 6h7M6 3l3 3-3 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
