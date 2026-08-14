import React from 'react';
import { ExternalLink, Clock, Video } from 'lucide-react';
import { getTaskDeadlineTimestamp, GRACE_PERIOD_MS } from '../../context/PlannerContext';

export const getPlatformIcon = (platform) => {
  switch (platform?.toLowerCase()) {
    case 'youtube':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a66c2">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'Medium':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.33 6.33 0 0 0-1-.08A6.26 6.26 0 0 0 3 15.5a6.26 6.26 0 0 0 10.7 4.34 6.18 6.18 0 0 0 1.8-4.34V8.5a8.28 8.28 0 0 0 4.09 1.64V6.69z" />
        </svg>
      );
    case 'Reddit':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.33 6.33 0 0 0-1-.08A6.26 6.26 0 0 0 3 15.5a6.26 6.26 0 0 0 10.7 4.34 6.18 6.18 0 0 0 1.8-4.34V8.5a8.28 8.28 0 0 0 4.09 1.64V6.69z" />
        </svg>
      );
    case 'Thread':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.33 6.33 0 0 0-1-.08A6.26 6.26 0 0 0 3 15.5a6.26 6.26 0 0 0 10.7 4.34 6.18 6.18 0 0 0 1.8-4.34V8.5a8.28 8.28 0 0 0 4.09 1.64V6.69z" />
        </svg>
      );
    case 'Pintrest':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.33 6.33 0 0 0-1-.08A6.26 6.26 0 0 0 3 15.5a6.26 6.26 0 0 0 10.7 4.34 6.18 6.18 0 0 0 1.8-4.34V8.5a8.28 8.28 0 0 0 4.09 1.64V6.69z" />
        </svg>
      );
    default:
      return <Video size={14} color="#a855f7" />;
  }
};

export const ContentTile = ({ task, onClick }) => {
  const nowMs = Date.now();
  const deadlineMs = getTaskDeadlineTimestamp(task.scheduledDate, task.scheduledTime);
  const expirationMs = deadlineMs + GRACE_PERIOD_MS;

  // Calculate if currently in 30-min Grace Period
  const inGracePeriod = task.status === 'scheduled' && nowMs >= deadlineMs && nowMs < expirationMs;
  const remainingGraceMins = Math.ceil((expirationMs - nowMs) / (60 * 1000));

  const isScheduled = task.status === 'scheduled';
  const isMissed = task.status === 'missed';
  const isPublished = task.status === 'published';

  const statusClass = isScheduled ? 'scheduled' : isMissed ? 'missed' : 'published';

  return (
    <div
      onClick={() => onClick(task)}
      className={`content-tile status-${statusClass}`}
      style={{
        padding: '8px 10px',
        borderRadius: '10px',
        marginBottom: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        background: inGracePeriod
          ? '#fff7ed'
          : isScheduled
            ? 'rgba(245, 158, 11, 0.12)'
            : isMissed
              ? 'rgba(239, 68, 68, 0.12)'
              : 'rgba(16, 185, 129, 0.12)',
        border: `1px solid ${inGracePeriod ? '#fdba74' : isScheduled ? 'rgba(245, 158, 11, 0.35)' : isMissed ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ background: '#ffffff', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {getPlatformIcon(task.platform)}
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {task.platform}
          </span>
        </div>

        {inGracePeriod ? (
          <span className="status-pill scheduled" style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#ffedd5', color: '#c2410c', borderColor: '#fdba74' }}>
            ⏳ Grace: {remainingGraceMins}m left
          </span>
        ) : (
          <span className={`status-pill ${statusClass}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
            {task.status}
          </span>
        )}
      </div>

      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
        {task.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Clock size={11} /> {task.scheduledTime || '12:00'}
        </span>

        {isPublished && task.contentLink && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--status-published-text)', fontWeight: 600 }}>
            <ExternalLink size={10} /> Link
          </span>
        )}
      </div>
    </div>
  );
};
