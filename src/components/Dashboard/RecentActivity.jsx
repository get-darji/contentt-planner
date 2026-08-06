import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { CalendarCheck, FileEdit, Send, TrendingUp } from 'lucide-react';

export const RecentActivity = () => {
  const { tasks, ideas } = usePlanner();

  // Dynamically build recent activities from real tasks
  const realActivities = tasks.slice(0, 3).map(task => {
    let action = 'Post scheduled';
    let color = '#f59e0b';
    let icon = CalendarCheck;
    
    if (task.status === 'published') {
      action = 'Marked as published';
      color = '#10b981';
      icon = Send;
    } else if (task.status === 'missed') {
      action = 'Post missed';
      color = '#dc2626';
      icon = CalendarCheck;
    }

    return {
      id: task.id,
      icon,
      action,
      title: task.title,
      time: task.scheduledDate || 'Today',
      color
    };
  });

  // Fallback to static mock list if no real tasks exist
  const recentActivities = realActivities.length > 0 ? realActivities : [
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

  const draftsCount = ideas.length;
  const scheduledCount = tasks.filter(t => t.status === 'scheduled').length;
  const publishedCount = tasks.filter(t => t.status === 'published').length;
  const totalCount = draftsCount + scheduledCount + publishedCount;

  const contentProgress = [
    { 
      id: 1, 
      name: 'Drafts ready', 
      posts: `${draftsCount} post${draftsCount === 1 ? '' : 's'}`, 
      pct: totalCount > 0 ? Math.round((draftsCount / totalCount) * 100) : 0, 
      color: '#3b82f6' 
    },
    { 
      id: 2, 
      name: 'Scheduled queue', 
      posts: `${scheduledCount} post${scheduledCount === 1 ? '' : 's'}`, 
      pct: totalCount > 0 ? Math.round((scheduledCount / totalCount) * 100) : 0, 
      color: '#f59e0b' 
    },
    { 
      id: 3, 
      name: 'Published this week', 
      posts: `${publishedCount} post${publishedCount === 1 ? '' : 's'}`, 
      pct: totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0, 
      color: '#10b981' 
    }
  ];

  return (
    <div className="two-column-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
