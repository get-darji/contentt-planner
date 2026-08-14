import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getPlatformIcon } from '../Calendar/ContentTile';
import { Search, Filter, ExternalLink, Trash2, Edit3, Plus, CheckCircle2 } from 'lucide-react';

export const ContentView = ({ onOpenAddModal, onEditTask }) => {
  const { tasks, deleteTask, isPlanner } = usePlanner();
  const todayStr = new Date().toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || t.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || t.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="page-container content-page" style={{ padding: '0 32px 48px 32px', maxWidth: '1600px', margin: '0 auto' }}>

      {/* Header & Controls */}
      <div className="page-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Content Manager</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage all scheduled, published, and draft posts across social channels.</p>
        </div>

        <button className="btn btn-orange-primary" onClick={onOpenAddModal}>
          <Plus size={16} /> New Content
        </button>
      </div>

      {/* Filter Bar */}
      <div className="ui-card filter-bar" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div className="filter-search" style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search content title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div className="filter-selects" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-select"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="All">All Platforms</option>
            <option value="YouTube">YouTube</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">X / Twitter</option>
            <option value="Medium">Medium</option>
            <option value="Reddit">Reddit</option>
            <option value="Pintrest">Pintrest</option>
            <option value="Thread">Thread</option>
            <option value="Facebook">Facebook</option>
          </select>

          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="All">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="ui-card table-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 700 }}>
              <th style={{ padding: '14px 20px' }}>CONTENT TITLE</th>
              <th style={{ padding: '14px 20px' }}>PLATFORM</th>
              <th style={{ padding: '14px 20px' }}>SCHEDULED DATE</th>
              <th style={{ padding: '14px 20px' }}>STATUS</th>
              <th style={{ padding: '14px 20px' }}>ASSIGNEE</th>
              <th style={{ padding: '14px 20px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 800 }}>
                  {task.title}
                  {task.contentLink && (
                    <a href={task.contentLink} target="_blank" rel="noreferrer" style={{ marginLeft: '8px', color: 'var(--orange-primary)' }}>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    {getPlatformIcon(task.platform)} {task.platform}
                  </div>
                </td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                  {task.scheduledDate} at {task.scheduledTime}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className={`status-pill ${task.status}`}>
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                  {task.assignee}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-icon" onClick={() => onEditTask(task)} title="Edit Task">
                      <Edit3 size={14} />
                    </button>
                    {!isPlanner && (
                      <button className="btn btn-secondary btn-icon" onClick={() => deleteTask(task.id)} style={{ color: '#dc2626' }} title="Delete Task">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
