import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getPlatformIcon } from './ContentTile';
import { X, Plus, Calendar, Clock, ChevronRight, User } from 'lucide-react';

export const DatePostsListModal = ({ isOpen, onClose, dateString, onSelectPost, onScheduleNew }) => {
  const { tasks, isPlanner } = usePlanner();
  const todayStr = new Date().toISOString().split('T')[0];
  const isPast = dateString < todayStr;
  const showScheduleBtn = !isPlanner || !isPast;

  if (!isOpen || !dateString) return null;

  const dayTasks = tasks.filter(t => t.scheduledDate === dateString);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--orange-primary)" /> Content for {dateString}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {dayTasks.length} post{dayTasks.length === 1 ? '' : 's'} scheduled for this date
            </p>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Posts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '340px', overflowY: 'auto' }}>
          {dayTasks.map(task => (
            <div
              key={task.id}
              onClick={() => onSelectPost(task)}
              className="ui-card"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: '#ffffff',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--bg-main)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                  {getPlatformIcon(task.platform)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '2px' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {task.scheduledTime || '12:00'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <User size={11} /> {task.assignee}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`status-pill ${task.status}`}>
                  {task.status}
                </span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to schedule another post for this date */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: showScheduleBtn ? 'space-between' : 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          
          {showScheduleBtn && (
            <button 
              className="btn btn-orange-primary" 
              onClick={() => onScheduleNew(dateString)}
              style={{ fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Schedule Another Post
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
