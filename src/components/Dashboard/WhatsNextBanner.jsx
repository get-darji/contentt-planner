import React from 'react';
import { getPlatformIcon } from '../Calendar/ContentTile';
import { AlertCircle, Clock, Star, Flame } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';

export const WhatsNextBanner = ({ onViewAll }) => {
  const { tasks, setActiveTab } = usePlanner();

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Helper to convert date + time string to timestamp for exact sorting
  const getTaskTimestamp = (task) => {
    if (!task.scheduledDate) return Infinity;
    const timeStr = task.scheduledTime || '12:00';
    return new Date(`${task.scheduledDate}T${timeStr}:00`).getTime();
  };

  // Filter scheduled tasks for today and future, sorted strictly by closest time first!
  const priorityScheduled = tasks
    .filter(t => t.status === 'scheduled' && t.scheduledDate >= todayStr)
    .sort((a, b) => getTaskTimestamp(a) - getTaskTimestamp(b))
    .slice(0, 3);

  return (
    <div className="ui-card" style={{ 
      padding: '16px 24px', 
      marginBottom: '24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      flexWrap: 'wrap', 
      gap: '16px', 
      background: priorityScheduled.length > 0 && priorityScheduled[0].scheduledDate === todayStr 
        ? 'linear-gradient(90deg, #fffcf5 0%, #fff7ed 100%)' 
        : '#ffffff',
      borderLeft: priorityScheduled.length > 0 && priorityScheduled[0].scheduledDate === todayStr
        ? '4px solid var(--orange-primary)'
        : '1px solid var(--border-color)'
    }}>
      
      {/* Left Spotlight Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--orange-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--orange-primary)',
          boxShadow: '0 2px 8px rgba(255, 122, 0, 0.15)'
        }}>
          {priorityScheduled.length > 0 && priorityScheduled[0].scheduledDate === todayStr ? (
            <Flame size={22} color="var(--orange-primary)" />
          ) : (
            <Star size={22} fill="var(--orange-primary)" />
          )}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Priority Schedule Alerts</h3>
            {priorityScheduled.length > 0 && priorityScheduled[0].scheduledDate === todayStr && (
              <span className="status-pill scheduled" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                🔥 Due Today
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {priorityScheduled.length > 0 
              ? `Sorted by highest priority & closest scheduled time` 
              : `No upcoming scheduled content`}
          </p>
        </div>
      </div>

      {/* Priority Sorted Cards List */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {priorityScheduled.length > 0 ? (
          priorityScheduled.map((item, index) => {
            const isClosest = index === 0;
            return (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#ffffff',
                  border: isClosest ? '2px solid var(--orange-primary)' : '1px solid var(--border-color)',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  boxShadow: isClosest ? '0 4px 12px rgba(255, 122, 0, 0.15)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ background: '#f7f7f2', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                  {getPlatformIcon(item.platform)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{item.platform}</span>
                    {isClosest && (
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--orange-primary)', background: '#fff0db', padding: '1px 5px', borderRadius: '4px' }}>
                        NEXT UP
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{item.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span className="status-pill scheduled">
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--status-scheduled-dot)' }} />
                      Scheduled
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Clock size={10} /> {item.scheduledDate === todayStr ? 'Today' : item.scheduledDate} {item.scheduledTime || '12:00'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Click + New Content to schedule a post
          </div>
        )}
      </div>

      {/* View All CTA */}
      <button 
        className="btn btn-orange-outline" 
        onClick={() => setActiveTab('calendar')}
        style={{ fontSize: '0.85rem', padding: '8px 16px' }}
      >
        View All
      </button>

    </div>
  );
};
