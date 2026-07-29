import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlanner } from '../../context/PlannerContext';
import { Globe, User } from 'lucide-react';

export const SettingsView = () => {
  const { user } = useAuth();
  const { workspace } = usePlanner();

  return (
    <div className="page-container settings-page" style={{ padding: '0 32px 48px 32px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Settings</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Your profile is managed by Google. Workspace details stay inside Darji.
        </p>
      </div>

      <div className="ui-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--orange-primary)" /> Google Profile
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={user?.avatar}
            alt={user?.name || 'Google profile'}
            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: 'var(--shadow-sm)' }}
          />
          <div>
            <div style={{ fontWeight: 800 }}>{user?.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="ui-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="var(--orange-primary)" /> Workspace Configuration
        </h3>

        <div className="form-group">
          <label className="form-label">Current Active Workspace</label>
          <input type="text" className="form-input" value={workspace.name} disabled />
        </div>
      </div>
    </div>
  );
};
