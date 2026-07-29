import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getPlatformIcon } from '../Calendar/ContentTile';
import { DatePostsListModal } from '../Calendar/DatePostsListModal';
import { ContentDetailView } from '../Calendar/ContentDetailView';
import { ContentModal } from '../Calendar/ContentModal';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertTriangle, Plus } from 'lucide-react';

export const CalendarGrid = ({ onOpenAddModal }) => {
  const { tasks } = usePlanner();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState('Month View');
  const [pastDateWarning, setPastDateWarning] = useState('');

  // Modals state
  const [selectedDateForList, setSelectedDateForList] = useState(null);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [selectedDateForNew, setSelectedDateForNew] = useState('');

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const yearsList = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigation Handlers
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

  // Dynamic Days Grid
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

  const handleCellClick = (cell) => {
    if (!cell.isCurrentMonth) return;
    
    const dayTasks = tasks.filter(t => t.scheduledDate === cell.dateString);

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
      setIsNewPostModalOpen(true);
    }
  };

  return (
    <div className="ui-card compact-calendar-card" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {pastDateWarning && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} /> {pastDateWarning}
        </div>
      )}

      {/* Toolbar Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Month & Year Selectors Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <CalendarIcon size={18} color="var(--orange-primary)" />
            
            <select 
              value={month}
              onChange={handleMonthSelect}
              style={{ background: 'transparent', border: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            >
              {monthNames.map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
            </select>

            <select 
              value={year}
              onChange={handleYearSelect}
              style={{ background: 'transparent', border: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            >
              {yearsList.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Prev / Today / Next Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-main)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button className="btn btn-secondary btn-icon" onClick={handlePrevMonth} style={{ border: 0, background: 'transparent' }} title="Previous Month">
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-secondary" onClick={handleToday} style={{ padding: '4px 14px', fontSize: '0.8rem', border: 0, fontWeight: 800 }}>
              Today
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleNextMonth} style={{ border: 0, background: 'transparent' }} title="Next Month">
              <ChevronRight size={16} />
            </button>
          </div>

          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Month View">Month View</option>
            <option value="Week View">Week View</option>
          </select>

        </div>

      </div>

      {/* Weekday Labels Header */}
      <div className="calendar-weekdays" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
        {daysOfWeek.map(d => (
          <div key={d} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="calendar-month-grid compact-calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {calendarGrid.map((cell, idx) => {
          if (!cell.isCurrentMonth) {
            return (
              <div 
                key={`empty_${idx}`} 
                style={{ 
                  height: '76px', 
                  background: '#fcfcf9', 
                  borderRadius: '10px', 
                  border: '1px solid transparent',
                  opacity: 0.25
                }} 
              />
            );
          }

          const dayTasks = tasks.filter(t => t.scheduledDate === cell.dateString);
          const hasScheduled = dayTasks.some(t => t.status === 'scheduled');
          const hasMissed = dayTasks.some(t => t.status === 'missed');
          const hasPublished = dayTasks.some(t => t.status === 'published');

          let cellBg = '#ffffff';
          if (hasScheduled) cellBg = 'var(--status-scheduled-bg)';
          if (hasMissed) cellBg = 'var(--status-missed-bg)';
          if (hasPublished) cellBg = 'var(--status-published-bg)';
          if (cell.isPast && !dayTasks.length) cellBg = '#fafafa';

          return (
            <div
              key={cell.dateString}
              onClick={() => handleCellClick(cell)}
              style={{
                height: '76px',
                background: cellBg,
                border: cell.isToday 
                  ? '2px solid var(--orange-primary)' 
                  : '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '6px 8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: cell.isPast && !dayTasks.length ? 0.6 : 1,
                cursor: cell.isPast && !dayTasks.length ? 'not-allowed' : 'pointer',
                boxShadow: cell.isToday ? '0 4px 12px rgba(255, 122, 0, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: cell.isToday ? 'var(--orange-primary)' : 'var(--text-main)' }}>
                  {cell.dayNum} {cell.isToday ? '(Today)' : ''}
                </span>

                {dayTasks.length > 0 && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'var(--orange-primary)', color: '#fff', padding: '1px 5px', borderRadius: '10px' }}>
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Render Social Platform Icons for Tasks on this Day */}
              {dayTasks.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedTaskForDetails(task); }}
                      style={{ background: '#ffffff', padding: '2px 4px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex' }}
                      title={`${task.title} (${task.status})`}
                    >
                      {getPlatformIcon(task.platform)}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Color Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          Published
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
          Scheduled
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          Missed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d4d4d4' }} />
          No Content
        </div>
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
          setIsNewPostModalOpen(true);
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
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        initialDate={selectedDateForNew}
      />

    </div>
  );
};
