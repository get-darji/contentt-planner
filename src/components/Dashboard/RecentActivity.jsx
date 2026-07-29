import React from 'react';
import { CalendarCheck, FileEdit, Send, TrendingUp } from 'lucide-react';

export const RecentActivity = () => {
  const recentActivities = [
    {
      id: 1,
      icon: FileEdit,
      action: 'Draft updated',
      title: 'AI Marketing Tips',
      time: '2h ago',
      color: '#3b82f6'
    },
    {
      id: 2,
      icon: CalendarCheck,
      action: 'Post scheduled',
      title: 'Carousel Post',
      time: '4h ago',
      color: '#f59e0b'
    },
    {
      id: 3,
      icon: Send,
      action: 'Marked as published',
      title: 'AI Agents Tutorial',
      time: '6h ago',
      color: '#10b981'
    }
  ];

  const contentProgress = [
    { id: 1, name: 'Drafts ready', posts: '8 posts', pct: 70, color: '#3b82f6' },
    { id: 2, name: 'Scheduled queue', posts: '12 posts', pct: 90, color: '#f59e0b' },
    { id: 3, name: 'Published this week', posts: '10 posts', pct: 82, color: '#10b981' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div className="ui-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Recent Activity</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--orange-primary)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {recentActivities.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: item.color }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    {item.action}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.title}</div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ui-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--orange-primary)" /> Content Progress
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--orange-primary)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {contentProgress.map((item) => (
            <div key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>{item.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.pct}%</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{item.posts}</div>
              <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
