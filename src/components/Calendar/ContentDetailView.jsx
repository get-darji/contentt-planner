import React, { useState, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getPlatformIcon } from './ContentTile';
import { 
  X, 
  ExternalLink, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2,
  Share2,
  Link as LinkIcon,
  Check
} from 'lucide-react';

export const ContentDetailView = ({ task, onClose }) => {
  const { updateTask, deleteTask } = usePlanner();

  const [contentLink, setContentLink] = useState(task?.contentLink || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (task) {
      setContentLink(task.contentLink || '');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [task]);

  if (!task) return null;

  const handlePublish = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!contentLink.trim()) {
      setErrorMsg('Please paste the live Content Link before publishing.');
      return;
    }

    updateTask(task.id, {
      status: 'published',
      contentLink: contentLink.trim()
    });

    setSuccessMsg('Post marked as Published successfully!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#ffffff', padding: '8px', borderRadius: '10px', display: 'flex', boxShadow: 'var(--shadow-sm)' }}>
              {getPlatformIcon(task.platform)}
            </div>
            <div>
              <span className={`status-pill ${task.status}`} style={{ marginBottom: '4px' }}>
                {task.status}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{task.title}</h3>
            </div>
          </div>

          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#dcfce7', border: '1px solid #6ee7b7', color: '#059669', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Task Details Card */}
        <div className="ui-card" style={{ padding: '16px', marginBottom: '20px', background: 'var(--bg-main)' }}>
          <div className="form-grid two-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Platform</span>
              <strong style={{ fontSize: '0.95rem' }}>{task.platform}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Scheduled Date & Time</span>
              <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="var(--orange-primary)" /> {task.scheduledDate} at {task.scheduledTime || '12:00'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Assignee</span>
              <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={14} /> {task.assignee}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Status</span>
              <strong style={{ textTransform: 'capitalize' }}>{task.status}</strong>
            </div>
          </div>

          {task.description && (
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>Description / Notes</span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {task.description}
              </p>
            </div>
          )}
        </div>

        {/* Publish Action & Content Link Form */}
        {task.status !== 'published' ? (
          <div className="ui-card" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid #10b981' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
              <CheckCircle2 size={18} /> Publish This Post
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Paste your live post URL below to publish and complete this scheduled task.
            </p>

            <form onSubmit={handlePublish}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Live Content URL *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="url"
                    className="form-input"
                    placeholder="https://instagram.com/p/... or https://youtube.com/..."
                    value={contentLink}
                    onChange={(e) => setContentLink(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                    required
                  />
                  <LinkIcon size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button type="submit" className="btn" style={{ width: '100%', background: '#10b981', color: '#ffffff', fontWeight: 700, padding: '12px', fontSize: '0.95rem' }}>
                <Check size={16} /> Publish Content Now
              </button>
            </form>
          </div>
        ) : (
          <div className="ui-card" style={{ padding: '16px', marginBottom: '20px', background: '#ecfdf5', borderColor: '#6ee7b7' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Published
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-main)', wordBreak: 'break-all' }}>
                  {task.contentLink}
                </div>
              </div>

              <a 
                href={task.contentLink} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#059669', borderColor: '#6ee7b7', textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> Open Link
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <button className="btn btn-secondary" onClick={handleDelete} style={{ color: '#dc2626' }}>
            <Trash2 size={16} /> Delete Post
          </button>

          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
