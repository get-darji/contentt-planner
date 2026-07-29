import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { ContentTile } from './ContentTile';
import { ContentModal } from './ContentModal';
import { ContentDetailView } from './ContentDetailView';
import { DatePostsListModal } from './DatePostsListModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Calendar as CalendarIcon,
  AlertTriangle
} from 'lucide-react';

export const CalendarView = () => {
  const { tasks, platformFilter, setPlatformFilter, statusFilter, setStatusFilter } = usePlanner();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateForList, setSelectedDateForList] = useState(null);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedDateForNew, setSelectedDateForNew] = useState('');
  const [pastDateWarning, setPastDateWarning] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const yearsList = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthSelect = (e) => {
    const selectedMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(currentDate.getFullYear(), selectedMonth, 1));
  };

  const handleYearSelect = (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(selectedYear, currentDate.getMonth(), 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarGrid = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarGrid.push({ isCurrentMonth: false, dayNum: '' });
  }
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast = formattedDate < todayStr;
    const isToday = formattedDate === todayStr;

    calendarGrid.push({
      isCurrentMonth: true,
      dayNum: day,
      dateString: formattedDate,
      isPast,
      isToday
    });
  }

  const filteredTasks = tasks.filter(task => {
    const matchesPlatform = platformFilter === 'All' || task.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || task.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesPlatform && matchesStatus;
  });

  const handleDayClick = (cell) => {
    if (!cell.isCurrentMonth) return;

    const dayTasks = filteredTasks.filter(t => t.scheduledDate === cell.dateString);

    if (cell.isPast) {
      if (dayTasks.length > 0) {
        setSelectedDateForList(cell.dateString);
      } else {
        setPastDateWarning(`Cannot schedule content on past date (${cell.dateString}). Please select today or a future date.`);
        setTimeout(() => setPastDateWarning(''), 4000);
      }
      return;
    }

    setPastDateWarning('');

    if (dayTasks.length > 0) {
      setSelectedDateForList(cell.dateString);
    } else {
      setSelectedDateForNew(cell.dateString);
      setIsNewModalOpen(true);
    }
  };

  return (
    <div className="page-container calendar-page" style={{ maxWidth: '1400px', margin: '24px auto', padding: '0 24px' }}>
      
      {pastDateWarning && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} /> {pastDateWarning}
        </div>
      )}

      {/* Top Filter & Toolbar Bar */}
      <div className="ui-card calendar-toolbar" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        <div className="calendar-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary btn-icon" onClick={handlePrevMonth} title="Previous Month">
            <ChevronLeft size={18} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '4px 10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <select 
              value={month}
              onChange={handleMonthSelect}
              style={{ background: 'transparent', border: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            >
              {monthNames.map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
            </select>

            <select 
              value={year}
              onChange={handleYearSelect}
              style={{ background: 'transparent', border: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            >
              {yearsList.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-secondary" onClick={handleToday} style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 800 }}>
            Today
          </button>

          <button className="btn btn-secondary btn-icon" onClick={handleNextMonth} title="Next Month">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Platform & Status Filters */}
        <div className="filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} /> Platform:
            </span>
            {['All', 'YouTube', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Facebook'].map(p => (
              <button 
                key={p}
                onClick={() => setPlatformFilter(p)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 0,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: platformFilter === p ? 'var(--orange-primary)' : 'transparent',
                  color: platformFilter === p ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {p === 'Twitter' ? 'X / Twitter' : p}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 8px' }}>
              Status:
            </span>
            <button 
              onClick={() => setStatusFilter('All')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 0,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: statusFilter === 'All' ? 'var(--orange-primary)' : 'transparent',
                color: statusFilter === 'All' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('scheduled')}
              className={`status-pill ${statusFilter === 'scheduled' ? 'scheduled' : ''}`}
              style={{ opacity: statusFilter === 'scheduled' || statusFilter === 'All' ? 1 : 0.4, cursor: 'pointer' }}
            >
              🟨 Scheduled
            </button>
            <button 
              onClick={() => setStatusFilter('missed')}
              className={`status-pill ${statusFilter === 'missed' ? 'missed' : ''}`}
              style={{ opacity: statusFilter === 'missed' || statusFilter === 'All' ? 1 : 0.4, cursor: 'pointer' }}
            >
              🟥 Missed
            </button>
            <button 
              onClick={() => setStatusFilter('published')}
              className={`status-pill ${statusFilter === 'published' ? 'published' : ''}`}
              style={{ opacity: statusFilter === 'published' || statusFilter === 'All' ? 1 : 0.4, cursor: 'pointer' }}
            >
              🟩 Published
            </button>
          </div>

        </div>

      </div>

      {/* Calendar Grid Headers */}
      <div className="calendar-weekdays" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '8px', textAlign: 'center' }}>
        {daysOfWeek.map(day => (
          <div key={day} style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Big Tiles Grid */}
      <div className="calendar-month-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
        {calendarGrid.map((cell, idx) => {
          if (!cell.isCurrentMonth) {
            return (
              <div 
                key={`empty_${idx}`} 
                style={{ 
                  minHeight: '140px', 
                  background: '#fcfcf9', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid transparent',
                  opacity: 0.25
                }} 
              />
            );
          }

          const dayTasks = filteredTasks.filter(t => t.scheduledDate === cell.dateString);

          return (
            <div 
              key={cell.dateString}
              className="ui-card"
              onClick={() => handleDayClick(cell)}
              style={{
                minHeight: '140px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: cell.isToday ? 'var(--orange-primary)' : 'var(--border-color)',
                background: cell.isToday ? 'var(--orange-light)' : '#ffffff',
                boxShadow: cell.isToday ? '0 0 15px rgba(255, 122, 0, 0.15)' : 'none',
                opacity: cell.isPast && !dayTasks.length ? 0.6 : 1,
                cursor: cell.isPast && !dayTasks.length ? 'not-allowed' : 'pointer'
              }}
            >
              <div>
                {/* Tile Header: Date Number & Count */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ 
                    fontWeight: 800, 
                    fontSize: '0.9rem', 
                    color: cell.isToday ? 'var(--orange-primary)' : 'var(--text-main)',
                    background: cell.isToday ? '#fff' : 'transparent',
                    padding: cell.isToday ? '2px 8px' : 0,
                    borderRadius: '6px'
                  }}>
                    {cell.dayNum} {cell.isToday ? '(Today)' : ''}
                  </span>

                  {dayTasks.length > 0 && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--orange-primary)', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>
                      {dayTasks.length} post{dayTasks.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>

                {/* Day Tasks Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dayTasks.map(task => (
                    <ContentTile 
                      key={task.id}
                      task={task}
                      onClick={(t) => { setSelectedTaskForDetails(t); }}
                    />
                  ))}
                </div>
              </div>

              {!cell.isPast && dayTasks.length === 0 && (
                <div 
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0', opacity: 0.5 }}
                >
                  + Schedule Post
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Date Posts List Modal */}
      <DatePostsListModal 
        isOpen={Boolean(selectedDateForList)}
        onClose={() => setSelectedDateForList(null)}
        dateString={selectedDateForList}
        onSelectPost={(task) => {
          setSelectedDateForList(null);
          setSelectedTaskForDetails(task);
        }}
        onScheduleNew={(dateStr) => {
          setSelectedDateForList(null);
          setSelectedDateForNew(dateStr);
          setIsNewModalOpen(true);
        }}
      />

      {/* Task Details / Publish Modal */}
      {selectedTaskForDetails && (
        <ContentDetailView 
          task={selectedTaskForDetails}
          onClose={() => setSelectedTaskForDetails(null)}
        />
      )}

      {/* New Schedule Modal */}
      <ContentModal 
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        initialDate={selectedDateForNew}
      />

    </div>
  );
};
