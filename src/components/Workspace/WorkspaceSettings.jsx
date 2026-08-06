import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import {
  Building,
  CheckCircle2,
  Layers,
  Users,
  UserPlus,
  Trash2,
  Shield,
  Lock,
  AlertTriangle
} from 'lucide-react';

export const WorkspaceSettings = () => {
  const { 
    workspace, 
    updateWorkspaceName, 
    teamMembers, 
    isPlanner, 
    addTeamMember, 
    removeTeamMember,
    createWorkspace
  } = usePlanner();

  const [wsName, setWsName] = useState(workspace.name);
  const [wsHandle, setWsHandle] = useState(workspace.handle);
  const [saveWsMsg, setSaveWsMsg] = useState('');

  const [newWsName, setNewWsName] = useState('');
  const [newWsHandle, setNewWsHandle] = useState('');
  const [newWsCategory, setNewWsCategory] = useState('Creator Studio');
  const [createWsSuccess, setCreateWsSuccess] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [teamError, setTeamError] = useState('');
  const [teamSuccess, setTeamSuccess] = useState('');

  const handleUpdateWorkspace = (e) => {
    e.preventDefault();
    if (isPlanner) return;
    updateWorkspaceName(wsName, wsHandle);
    setSaveWsMsg('Workspace settings saved successfully!');
    setTimeout(() => setSaveWsMsg(''), 3000);
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    setCreateWsSuccess('');
    if (!newWsName.trim() || !newWsHandle.trim()) return;

    try {
      await createWorkspace(newWsName, newWsHandle, newWsCategory);
      setCreateWsSuccess('Workspace created and switched successfully!');
      setNewWsName('');
      setNewWsHandle('');
      setNewWsCategory('Creator Studio');
      setTimeout(() => setCreateWsSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTeamMember = (e) => {
    e.preventDefault();
    if (isPlanner) return;
    setTeamError('');
    setTeamSuccess('');

    if (!newEmail.trim()) {
      setTeamError('Please enter a team member email.');
      return;
    }

    try {
      addTeamMember(newEmail, newName);
      setTeamSuccess('Planner added to workspace team successfully!');
      setNewEmail('');
      setNewName('');
      setTimeout(() => setTeamSuccess(''), 3000);
    } catch (err) {
      setTeamError(err.message || 'Failed to add team member.');
    }
  };

  const handleRemoveMember = (email) => {
    if (isPlanner) return;
    if (window.confirm(`Are you sure you want to remove ${email} from the workspace team?`)) {
      removeTeamMember(email);
      setTeamSuccess('Team member removed.');
      setTimeout(() => setTeamSuccess(''), 2000);
    }
  };

  return (
    <div className="page-container workspace-page" style={{ maxWidth: '800px', margin: '32px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Workspace Settings & Team
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Manage your active brand workspace and invite planners to collaborate.
        </p>
      </div>

      {/* 1. Workspace Details Card */}
      <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Building size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} /> Workspace Details
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Single active workspace settings</span>
          </div>
        </div>

        {isPlanner && (
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} /> Read-only mode: Only Workspace Owners can modify workspace settings.
          </div>
        )}

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
              disabled={isPlanner}
              style={{ background: isPlanner ? 'var(--bg-main)' : '#ffffff', cursor: isPlanner ? 'not-allowed' : 'text' }}
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
              disabled={isPlanner}
              style={{ background: isPlanner ? 'var(--bg-main)' : '#ffffff', cursor: isPlanner ? 'not-allowed' : 'text' }}
            />
          </div>

          {!isPlanner && (
            <button type="submit" className="btn btn-orange-primary" style={{ width: '100%', marginTop: '8px' }}>
              Save Workspace
            </button>
          )}
        </form>
      </div>

      {/* 2. Team Management Panel */}
      <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Team Members
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Collaborators allowed to schedule posts in this workspace</span>
          </div>
        </div>

        {teamError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> {teamError}
          </div>
        )}

        {teamSuccess && (
          <div style={{ background: '#dcfce7', border: '1px solid #6ee7b7', color: '#059669', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {teamSuccess}
          </div>
        )}

        {/* Invite Form (Owner Only) */}
        {!isPlanner ? (
          <form onSubmit={handleAddTeamMember} style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={16} color="var(--orange-primary)" /> Add Team Member
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. planner@brand.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sam Planner"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} color="#3b82f6" /> Assigned Role: <strong>Planner</strong> (Locked)
              </div>
              <button type="submit" className="btn btn-orange-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                Add Planner
              </button>
            </div>
          </form>
        ) : (
          <div style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)', color: '#1d4ed8', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} /> Only Workspace Owners can add or remove team members.
          </div>
        )}

        {/* Team Members List */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 700 }}>
                <th style={{ padding: '10px 14px' }}>NAME</th>
                <th style={{ padding: '10px 14px' }}>EMAIL / ID</th>
                <th style={{ padding: '10px 14px' }}>ROLE</th>
                <th style={{ padding: '10px 14px' }}>ADDED DATE</th>
                {!isPlanner && <th style={{ padding: '10px 14px', textAlign: 'right' }}>ACTION</th>}
              </tr>
            </thead>
            <tbody>
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={isPlanner ? 4 : 5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No team members added yet. Planners will show here.
                  </td>
                </tr>
              ) : (
                teamMembers.map((member) => (
                  <tr key={member.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>{member.name}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{member.email}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px', border: '1px solid #93c5fd', textTransform: 'capitalize' }}>
                        {member.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{member.addedAt}</td>
                    {!isPlanner && (
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary btn-icon" 
                          onClick={() => handleRemoveMember(member.email)}
                          style={{ color: '#dc2626', padding: '6px' }}
                          title="Remove Team Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Create New Workspace */}
      <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <UserPlus size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Create New Workspace
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Launch a brand new isolated content calendar</span>
          </div>
        </div>

        {createWsSuccess && (
          <div style={{ background: '#dcfce7', border: '1px solid #6ee7b7', color: '#059669', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {createWsSuccess}
          </div>
        )}

        <form onSubmit={handleCreateWorkspace}>
          <div className="form-group">
            <label className="form-label">New Workspace Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. My Side Hustle / Client B"
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              required
            />
          </div>

          <div className="form-grid two-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Brand Handle / Slug *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. @my_brand"
                value={newWsHandle}
                onChange={(e) => setNewWsHandle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Workspace Category</label>
              <select
                className="form-select"
                value={newWsCategory}
                onChange={(e) => setNewWsCategory(e.target.value)}
              >
                <option value="Creator Studio">Creator Studio</option>
                <option value="Creator Workspace">Creator Workspace</option>
                <option value="Agency Client">Agency Client</option>
                <option value="Personal Brand">Personal Brand</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-orange-primary" style={{ width: '100%', marginTop: '8px', background: '#10b981', borderColor: '#10b981', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}>
            Create Workspace Now
          </button>
        </form>
      </div>

    </div>
  );
};
