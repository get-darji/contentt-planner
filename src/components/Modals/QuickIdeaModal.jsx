import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Lightbulb, X, Plus } from 'lucide-react';

export const QuickIdeaModal = () => {
  const { isIdeaModalOpen, setIsIdeaModalOpen, addIdea } = usePlanner();
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [notes, setNotes] = useState('');

  if (!isIdeaModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addIdea(title, platform, notes);
    setTitle('');
    setNotes('');
    setIsIdeaModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsIdeaModalOpen(false)}>
      <div className="modal-container" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#fff0db', padding: '6px', borderRadius: '8px', color: 'var(--orange-primary)' }}>
              <Lightbulb size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Save Content Idea</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={() => setIsIdeaModalOpen(false)}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Idea Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 5 AI tools every creator needs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Platform</label>
            <select
              className="form-select"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
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
            <label className="form-label">Key Outline / Notes</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Add quick bullet points or inspiration links..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-orange-primary" style={{ width: '100%', marginTop: '8px' }}>
            Save Idea
          </button>
        </form>

      </div>
    </div>
  );
};
