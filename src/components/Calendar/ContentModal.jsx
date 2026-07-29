import React, { useState, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar, AlertTriangle } from 'lucide-react';

export const ContentModal = ({ isOpen, onClose, initialDate }) => {
  const { addTask } = usePlanner();
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const assigneeName = user?.name || 'Content Owner';

  const [formData, setFormData] = useState({
    title: '',
    platform: 'Instagram',
    scheduledDate: initialDate || todayStr,
    scheduledTime: '12:00',
    description: '',
    assignee: assigneeName
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setFormData({
      title: '',
      platform: 'Instagram',
      scheduledDate: initialDate || todayStr,
      scheduledTime: '12:00',
      description: '',
      assignee: assigneeName
    });
    setErrorMsg('');
  }, [assigneeName, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Please enter a content title.');
      return;
    }

    if (formData.scheduledDate < todayStr) {
      setErrorMsg('Cannot schedule content on past dates. Please select today or a future date.');
      return;
    }

    // Always create as 'scheduled'
    addTask({
      ...formData,
      status: 'scheduled'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Schedule New Content
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Set publish date and platform for this post.
            </p>
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

        <form onSubmit={handleSubmit}>
          
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Content Title *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. AI Product Launch Reel"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              autoFocus
              required
            />
          </div>

          {/* Platform */}
          <div className="form-group">
            <label className="form-label">Social Platform</label>
            <select 
              className="form-select"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            >
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">X / Twitter</option>
              <option value="TikTok">TikTok</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Scheduled Date *</label>
              <input 
                type="date"
                className="form-input"
                min={todayStr}
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Scheduled Time</label>
              <input 
                type="time"
                className="form-input"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label className="form-label">Assignee</label>
            <input
              type="text"
              className="form-input"
              value={formData.assignee}
              disabled
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea 
              rows={3}
              className="form-textarea"
              placeholder="Add captions, hashtags, or video notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Single Schedule CTA Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-orange-primary" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              <Calendar size={16} /> Schedule Post
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
