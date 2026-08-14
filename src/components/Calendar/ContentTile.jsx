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
    case 'medium':
      return (
        <svg width="14" height="14" viewBox="0 0 1043.63 592.71" fill="#000000">
          <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"/>
        </svg>
      );
    case 'reddit':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#ff4500">
          <path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z"/>
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165"/>
        </svg>
      );
    case 'thread':
    case 'threads':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#000000">
          <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
        </svg>
      );
    case 'pintrest':
    case 'pinterest':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#bd081c">
          <path d="M11.99 2C6.472 2 2 6.473 2 11.99c0 4.232 2.633 7.85 6.35 9.306-.088-.79-.166-2.006.034-2.868.182-.78 1.172-4.966 1.172-4.966s-.299-.599-.299-1.484c0-1.388.805-2.425 1.808-2.425.853 0 1.264.64 1.264 1.407 0 .858-.546 2.139-.827 3.327-.235.994.499 1.805 1.05 1.805 1.189 0 2.106-1.272 2.106-3.096 0-1.618-1.162-2.748-2.818-2.748-1.92 0-3.056 1.437-3.056 2.924 0 .579.222 1.203.499 1.543.054.067.062.126.046.195-.052.215-.17.684-.188.777-.03.149-.098.182-.225.133-1.056-.491-1.37-1.848-1.37-2.992 0-2.327 1.688-4.464 4.87-4.464 2.556 0 4.544 1.826 4.544 4.266 0 2.544-1.604 4.592-3.824 4.592-.746 0-1.446-.388-1.687-.847l-.46 1.758c-.167.64-.618 1.444-.916 1.933C15.655 21.042 18.735 20.07 20.486 17.662 22.238 15.253 22.238 11.728 20.486 9.319 18.735 6.91 15.655 5.938 11.99 2z"/>
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
