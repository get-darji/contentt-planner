import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import {
  Building,
  CheckCircle2,
  Layers
} from 'lucide-react';

export const WorkspaceSettings = () => {
  const { workspace, updateWorkspaceName } = usePlanner();

  const [wsName, setWsName] = useState(workspace.name);
  const [wsHandle, setWsHandle] = useState(workspace.handle);
  const [saveWsMsg, setSaveWsMsg] = useState('');

  const handleUpdateWorkspace = (e) => {
    e.preventDefault();
    updateWorkspaceName(wsName, wsHandle);
    setSaveWsMsg('Workspace settings saved successfully!');
    setTimeout(() => setSaveWsMsg(''), 3000);
  };

  return (
    <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Workspace Settings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Manage the active brand workspace for your Google-authenticated planner.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Building size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} /> Workspace Details
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Single active workspace</span>
          </div>
        </div>

        {saveWsMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> {saveWsMsg}
          </div>
        )}

        <form onSubmit={handleUpdateWorkspace}>
          <div className="form-group">
            <label className="form-label">Workspace Name</label>
            <input
              type="text"
              className="form-input"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand Handle / Slug</label>
            <input
              type="text"
              className="form-input"
              value={wsHandle}
              onChange={(e) => setWsHandle(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Save Workspace
          </button>
        </form>
      </div>
    </div>
  );
};
