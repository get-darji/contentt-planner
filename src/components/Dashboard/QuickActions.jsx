import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getPlatformIcon } from '../Calendar/ContentTile';
import { 
  Plus, 
  Calendar, 
  FileEdit, 
  Lightbulb, 
  LayoutList
} from 'lucide-react';

export const QuickActions = ({ onOpenAddModal }) => {
  const { tasks, setActiveTab, setIsIdeaModalOpen } = usePlanner();

  const todayStr = new Date().toISOString().split('T')[0];

  const quickLinks = [
    { label: 'Schedule Content', icon: Calendar, action: onOpenAddModal },
    { label: 'Create Draft', icon: FileEdit, action: onOpenAddModal },
    { label: 'Add Idea', icon: Lightbulb, action: () => setIsIdeaModalOpen(true) },
    { label: 'View Calendar', icon: LayoutList, action: () => setActiveTab('calendar') }
  ];

  const publishedCount = tasks.filter(t => t.status === 'published').length;
  const scheduledCount = tasks.filter(t => t.status === 'scheduled').length;
  const missedCount = tasks.filter(t => t.status === 'missed').length;
  const draftsCount = tasks.filter(t => t.status === 'draft' || t.status === 'pending').length;
  const totalCount = tasks.length;

  const upcomingDeadlines = tasks
    .filter(t => t.status === 'scheduled' && t.scheduledDate >= todayStr)
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Quick Actions Panel */}
      <div className="ui-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Quick Actions</h3>
          <button 
            className="btn btn-orange-primary" 
            onClick={onOpenAddModal}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '8px' }}
          >
            <Plus size={14} /> New Content
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <button
                key={idx}
                onClick={link.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color="var(--text-muted)" />
                <span style={{ flex: 1 }}>{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dynamic Content Summary Donut Chart */}
      <div className="ui-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Content Summary</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* SVG Donut Ring */}
          <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="110" height="110" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray={`${totalCount > 0 ? (publishedCount / totalCount) * 100 : 0}, 100`}
              />
            </svg>

            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Posts</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Published
              </span>
              <strong style={{ fontWeight: 800 }}>{publishedCount}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Scheduled
              </span>
              <strong style={{ fontWeight: 800 }}>{scheduledCount}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Missed
              </span>
              <strong style={{ fontWeight: 800 }}>{missedCount}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Drafts
              </span>
              <strong style={{ fontWeight: 800 }}>{draftsCount}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Upcoming Deadlines */}
      <div className="ui-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Upcoming Deadlines</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--orange-primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveTab('calendar')}>View All</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#ffffff', padding: '4px', borderRadius: '6px', display: 'flex' }}>
                    {getPlatformIcon(item.platform)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.scheduledDate} ({item.scheduledTime || '12:00'})</div>
                  </div>
                </div>

                <span className="status-pill scheduled" style={{ fontSize: '0.65rem' }}>
                  Scheduled
                </span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
              No upcoming post deadlines
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
