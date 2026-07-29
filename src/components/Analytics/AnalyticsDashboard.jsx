import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getPlatformIcon } from '../Calendar/ContentTile';
import { 
  BarChart2, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter,
  Layers,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { tasks, platformFilter: globalPlatform, statusFilter: globalStatus } = usePlanner();

  // Filter toolbar states
  const [filterMode, setFilterMode] = useState('All Time'); // 'All Time' | 'MonthYear' | 'SpecificDate'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // e.g. 2026
  const [specificDate, setSpecificDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPlatform, setSelectedPlatform] = useState(globalPlatform || 'All');

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const yearsList = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // Dynamic Task Filtering by Month/Year/Date & Platform
  const filteredTasks = tasks.filter(task => {
    // Platform match
    const matchesPlatform = selectedPlatform === 'All' || task.platform.toLowerCase() === selectedPlatform.toLowerCase();
    if (!matchesPlatform) return false;

    // Time filter match
    if (filterMode === 'SpecificDate') {
      return task.scheduledDate === specificDate;
    }

    if (filterMode === 'MonthYear') {
      if (!task.scheduledDate) return false;
      const [tYear, tMonth] = task.scheduledDate.split('-').map(Number);
      return tYear === selectedYear && (tMonth - 1) === selectedMonth;
    }

    return true; // 'All Time'
  });

  // Calculate Key Metrics dynamically
  const totalPosts = filteredTasks.length;
  const publishedCount = filteredTasks.filter(t => t.status === 'published').length;
  const scheduledCount = filteredTasks.filter(t => t.status === 'scheduled').length;
  const missedCount = filteredTasks.filter(t => t.status === 'missed').length;
  const pendingCount = filteredTasks.filter(t => t.status === 'pending' || t.status === 'draft').length;

  const publishRate = totalPosts > 0 ? Math.round((publishedCount / totalPosts) * 100) : 0;

  // Platform Breakdown Counts
  const platformsList = ['YouTube', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Facebook'];
  const platformCounts = platformsList.map(p => {
    const pTasks = filteredTasks.filter(t => t.platform.toLowerCase() === p.toLowerCase());
    return {
      name: p,
      count: pTasks.length,
      published: pTasks.filter(t => t.status === 'published').length,
      scheduled: pTasks.filter(t => t.status === 'scheduled').length,
      missed: pTasks.filter(t => t.status === 'missed').length,
    };
  });

  const maxCount = Math.max(...platformCounts.map(p => p.count), 1);

  return (
    <div className="page-container analytics-page" style={{ maxWidth: '1300px', margin: '32px auto', padding: '0 24px' }}>
      
      {/* Top Header & Analytics Time Range Toolbar */}
      <div className="ui-card analytics-toolbar" style={{ padding: '20px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Content Performance Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            {filterMode === 'All Time' && 'Showing all-time performance metrics across channels'}
            {filterMode === 'MonthYear' && `Showing performance metrics for ${monthNames[selectedMonth]} ${selectedYear}`}
            {filterMode === 'SpecificDate' && `Showing performance metrics for date ${specificDate}`}
          </p>
        </div>

        {/* Dynamic Time Range & Platform Filter Controls */}
        <div className="filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Time Filter Mode Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <CalendarIcon size={16} color="var(--orange-primary)" />
            <select 
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              style={{ background: 'transparent', border: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All Time">All Time</option>
              <option value="MonthYear">Filter by Month & Year</option>
              <option value="SpecificDate">Filter by Specific Date</option>
            </select>
          </div>

          {/* Month & Year Controls */}
          {filterMode === 'MonthYear' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                style={{ background: 'transparent', border: 0, fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
              >
                {monthNames.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>

              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                style={{ background: 'transparent', border: 0, fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {/* Specific Date Control */}
          {filterMode === 'SpecificDate' && (
            <input 
              type="date"
              className="form-input"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              style={{ width: '160px', padding: '6px 10px', fontSize: '0.85rem', fontWeight: 700 }}
            />
          )}

          {/* Platform Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Filter size={16} color="var(--orange-primary)" />
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              style={{ background: 'transparent', border: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Platforms</option>
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">X / Twitter</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="TikTok">TikTok</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>

        </div>

      </div>

      {/* Metrics Top Row */}
      <div className="analytics-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        
        {/* Card 1: Total Posts */}
        <div className="ui-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Posts</span>
            <div style={{ background: 'var(--orange-light)', padding: '6px', borderRadius: '8px', color: 'var(--orange-primary)' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalPosts}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--orange-primary)', fontWeight: 700, marginTop: '6px' }}>
            {filterMode === 'All Time' ? 'Total Scheduled & Published' : 'Selected Period'}
          </div>
        </div>

        {/* Card 2: Published */}
        <div className="ui-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Published Content</span>
            <div style={{ background: '#dcfce7', padding: '6px', borderRadius: '8px', color: '#10b981' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{publishedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Publish Rate: <strong style={{ color: 'var(--text-main)' }}>{publishRate}%</strong>
          </div>
        </div>

        {/* Card 3: Scheduled */}
        <div className="ui-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scheduled Upcoming</span>
            <div style={{ background: '#fff0db', padding: '6px', borderRadius: '8px', color: '#f59e0b' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{scheduledCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Ready for publishing
          </div>
        </div>

        {/* Card 4: Missed */}
        <div className="ui-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Missed Schedule</span>
            <div style={{ background: '#fee2e2', padding: '6px', borderRadius: '8px', color: '#ef4444' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{missedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '6px', fontWeight: 700 }}>
            Overdue posts
          </div>
        </div>

      </div>

      {/* Visual Graphs & Charts Section */}
      <div className="analytics-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Chart 1: Platform Content Distribution Bar Chart */}
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="var(--orange-primary)" /> Platform Posting Velocity & Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Volume of posts scheduled, published, and missed across social channels.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {platformCounts.map((item) => {
              const barPercentage = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getPlatformIcon(item.name)}
                      <span>{item.name}</span>
                    </div>

                    {/* Fixed High-Contrast Text Color formatting for Total Count */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.published} Pub
                      </span>
                      <span style={{ color: '#d97706', fontWeight: 700, background: '#fffbeb', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.scheduled} Sch
                      </span>
                      <span style={{ color: '#dc2626', fontWeight: 700, background: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.missed} Mis
                      </span>
                      {/* Bold High Contrast Dark Text for Total Posts Count */}
                      <span style={{ color: 'var(--text-main)', fontWeight: 800, background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '6px' }}>
                        ({item.count} Total)
                      </span>
                    </div>
                  </div>

                  {/* Visual Velocity Bar */}
                  <div style={{ height: '12px', background: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                    <div 
                      style={{ 
                        width: item.count > 0 ? `${barPercentage}%` : '0%', 
                        height: '100%', 
                        background: 'linear-gradient(90deg, #ff7a00 0%, #a855f7 100%)',
                        borderRadius: '6px',
                        transition: 'width 0.6s ease'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Status Share Overview Donut Visualizer */}
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>
            Status Share Overview
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Ratio of post statuses for selected period.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 0' }}>
            
            {/* Visual SVG Ring Chart */}
            <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="180" height="180" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.8"
                  strokeDasharray={`${totalPosts > 0 ? (publishedCount / totalPosts) * 100 : 0}, 100`}
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.8"
                  strokeDasharray={`${totalPosts > 0 ? (scheduledCount / totalPosts) * 100 : 0}, 100`}
                  strokeDashoffset={`-${totalPosts > 0 ? (publishedCount / totalPosts) * 100 : 0}`}
                />
              </svg>

              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalPosts}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filtered Posts</div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>🟩 Published</span>
                <strong style={{ fontSize: '0.9rem', color: '#059669' }}>{publishedCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706' }}>🟨 Scheduled</span>
                <strong style={{ fontSize: '0.9rem', color: '#d97706' }}>{scheduledCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626' }}>🟥 Missed</span>
                <strong style={{ fontSize: '0.9rem', color: '#dc2626' }}>{missedCount}</strong>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
