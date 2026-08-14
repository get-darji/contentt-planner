import React, { useState, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar, AlertTriangle, Link as LinkIcon } from 'lucide-react';

export const ContentModal = ({ isOpen, onClose, initialDate, editingTask }) => {
  const { addTask, updateTask, isPlanner } = usePlanner();
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const assigneeName = user?.name || 'Content Owner';

  const [formData, setFormData] = useState({
    title: '',
    platform: 'Instagram',
    scheduledDate: initialDate || todayStr,
    scheduledTime: '12:00',
    description: '',
    assignee: assigneeName,
    contentLink: '',
    status: 'scheduled'
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        platform: editingTask.platform || 'Instagram',
        scheduledDate: editingTask.scheduledDate || todayStr,
        scheduledTime: editingTask.scheduledTime || '12:00',
        description: editingTask.description || '',
        assignee: editingTask.assignee || assigneeName,
        contentLink: editingTask.contentLink || '',
        status: editingTask.status || 'scheduled'
      });
    } else {
      setFormData({
        title: '',
        platform: 'Instagram',
        scheduledDate: initialDate || todayStr,
        scheduledTime: '12:00',
        description: '',
        assignee: assigneeName,
        contentLink: '',
        status: 'scheduled'
      });
    }
    setErrorMsg('');
  }, [assigneeName, initialDate, isOpen, editingTask, todayStr]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Please enter a content title.');
      return;
    }

    const isDateChanged = editingTask ? formData.scheduledDate !== editingTask.scheduledDate : true;

    // Enforce date validation rules for Planner: cannot schedule in the past.
    // If they are editing an existing past post, they are allowed to edit it, but NOT schedule it in the past (meaning they cannot change the date to a new past date).
    if (isPlanner && formData.scheduledDate < todayStr && isDateChanged) {
      setErrorMsg('Cannot schedule content on past dates. Please select today or a future date.');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: formData.title,
        platform: formData.platform,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        description: formData.description,
        contentLink: formData.contentLink,
        status: formData.status
      });
    } else {
      addTask({
        ...formData,
        status: formData.status || 'scheduled'
      });
    }

    onClose();
  };

  const minDate = isPlanner ? (editingTask && editingTask.scheduledDate < todayStr ? editingTask.scheduledDate : todayStr) : undefined;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {editingTask ? 'Edit Scheduled Post' : 'Schedule New Content'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {editingTask ? 'Update post schedule details and content.' : 'Set publish date and platform for this post.'}
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

          {/* Platform & Status Row */}
          <div className="form-grid two-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                <option value="Medium">Medium</option>
                <option value="Reddit">Reddit</option>
                <option value="pintrest">Pintrest</option>
                <option value="Thread">Thread</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Post Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="form-grid two-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Scheduled Date *</label>
              <input
                type="date"
                className="form-input"
                min={minDate}
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

          {/* Content Link */}
          <div className="form-group">
            <label className="form-label">Content Link / URL</label>
            <div style={{ position: 'relative' }}>
              <input
                type="url"
                className="form-input"
                placeholder="e.g. https://instagram.com/p/... or https://youtube.com/..."
                value={formData.contentLink || ''}
                onChange={(e) => setFormData({ ...formData, contentLink: e.target.value })}
                style={{ paddingLeft: '38px' }}
              />
              <LinkIcon size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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

          {/* Schedule CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-orange-primary" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              <Calendar size={16} /> {editingTask ? 'Save Changes' : 'Schedule Post'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
