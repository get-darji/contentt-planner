import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Calendar, CheckCircle2, AlertCircle, Clock, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { getPlatformIcon } from '../Calendar/ContentTile';

export const MetricsBar = () => {
  const { tasks, setActiveTab, setStatusFilter, setPlatformFilter } = usePlanner();

  const scheduledCount = tasks.filter(t => t.status === 'scheduled').length;
  const publishedCount = tasks.filter(t => t.status === 'published').length;
  const missedCount = tasks.filter(t => t.status === 'missed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending' || t.status === 'draft').length;
  
  const totalTasks = tasks.length;
  const completionRatePct = totalTasks > 0 ? Math.round((publishedCount / totalTasks) * 100) + '%' : '0%';

  // Find platform with highest posts count
  const platformCounts = {};
  tasks.forEach(t => {
    platformCounts[t.platform] = (platformCounts[t.platform] || 0) + 1;
  });
  let bestPlatform = 'Instagram';
  let maxP = 0;
  Object.keys(platformCounts).forEach(p => {
    if (platformCounts[p] > maxP) {
      maxP = platformCounts[p];
      bestPlatform = p;
    }
  });

  const handleKpiClick = (tab, status = 'All', platform = 'All') => {
    setStatusFilter(status);
    setPlatformFilter(platform);
    setActiveTab(tab);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' }}>
      
      {/* 1. Scheduled KPI Card -> Redirects to Content Table (Filtered: Scheduled) */}
      <div 
        className="ui-card" 
        onClick={() => handleKpiClick('content', 'scheduled')}
        style={{ 
          padding: '16px', 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderLeft: '4px solid var(--orange-primary)'
        }}
        title="Click to view all Scheduled posts"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ background: '#fff0db', padding: '8px', borderRadius: '10px', color: 'var(--orange-primary)' }}>
            <Calendar size={18} />
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Scheduled
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {scheduledCount}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange-primary)', marginTop: '4px' }}>
          This Month →
        </div>
      </div>

      {/* 2. Published KPI Card -> Redirects to Content Table (Filtered: Published) */}
      <div 
        className="ui-card" 
        onClick={() => handleKpiClick('content', 'published')}
        style={{ 
          padding: '16px', 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderLeft: '4px solid #10b981'
        }}
        title="Click to view all Published posts"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '10px', color: '#10b981' }}>
            <CheckCircle2 size={18} />
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Published
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {publishedCount}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
          This Month →
        </div>
      </div>

      {/* 3. Missed KPI Card -> Redirects to Content Table (Filtered: Missed) */}
      <div 
        className="ui-card" 
        onClick={() => handleKpiClick('content', 'missed')}
        style={{ 
          padding: '16px', 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderLeft: '4px solid #ef4444'
        }}
        title="Click to view all Missed posts"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '10px', color: '#ef4444' }}>
            <AlertCircle size={18} />
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Missed
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {missedCount}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>
          This Month →
        </div>
      </div>

      {/* 4. Pending KPI Card -> Redirects to Content Table (Filtered: Pending/Draft) */}
      <div 
        className="ui-card" 
        onClick={() => handleKpiClick('content', 'pending')}
        style={{ 
          padding: '16px', 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderLeft: '4px solid #3b82f6'
        }}
        title="Click to view all Pending / Draft posts"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '10px', color: '#3b82f6' }}>
            <Clock size={18} />
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Pending
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {pendingCount}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6', marginTop: '4px' }}>
          This Month →
        </div>
      </div>

      {/* 5. Completion Rate KPI Card -> Redirects to Analytics Dashboard Page */}
      <div 
        className="ui-card" 
        onClick={() => handleKpiClick('analytics')}
        style={{ 
          padding: '16px', 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderLeft: '4px solid #a855f7'
        }}
        title="Click to view Analytics Dashboard"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ background: '#f3e8ff', padding: '8px', borderRadius: '10px', color: '#a855f7' }}>
            <TrendingUp size={18} />
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Completion Rate
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {completionRatePct}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', marginTop: '4px' }}>
          This Month →
        </div>
      </div>

      {/* 6. Best Platform KPI Card -> Redirects to Analytics Filtered by Best Platform */}
      <div 
        className="ui-card" 
        onClick={() => handleKpiClick('analytics', 'All', bestPlatform)}
        style={{ 
          padding: '16px', 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderLeft: '4px solid #f59e0b'
        }}
        title={`Click to view ${bestPlatform} Analytics`}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ background: '#fff9c4', padding: '8px', borderRadius: '10px', color: '#f59e0b' }}>
            <Star size={18} fill="#f59e0b" />
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Best Platform
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          {getPlatformIcon(bestPlatform)} {bestPlatform}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>
          View Analytics →
        </div>
      </div>

    </div>
  );
};
