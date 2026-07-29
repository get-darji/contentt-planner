import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  BarChart2, 
  Users, 
  PlusCircle, 
  Sparkles, 
  LogOut, 
  ChevronDown,
  Layers
} from 'lucide-react';

export const Navbar = ({ onOpenAddModal }) => {
  const { workspace, activeTab, setActiveTab } = usePlanner();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 900 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand & Workspace Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('calendar')}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}>
              {workspace.logo || '⚡'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '6px' }}>
                REGIMES
                <span style={{ fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>PRO</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={12} /> {workspace.name}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <button 
            className={`btn ${activeTab === 'calendar' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('calendar')}
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: activeTab === 'calendar' ? 'var(--brand-gradient)' : 'transparent', color: activeTab === 'calendar' ? '#fff' : 'var(--text-secondary)' }}
          >
            <CalendarIcon size={16} /> Calendar
          </button>
          
          <button 
            className={`btn ${activeTab === 'analytics' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('analytics')}
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: activeTab === 'analytics' ? 'var(--brand-gradient)' : 'transparent', color: activeTab === 'analytics' ? '#fff' : 'var(--text-secondary)' }}
          >
            <BarChart2 size={16} /> Analytics
          </button>

          <button 
            className={`btn ${activeTab === 'workspace' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('workspace')}
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: activeTab === 'workspace' ? 'var(--brand-gradient)' : 'transparent', color: activeTab === 'workspace' ? '#fff' : 'var(--text-secondary)' }}
          >
            <Users size={16} /> Workspace
          </button>
        </nav>

        {/* Right CTA & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={16} /> Add Content
          </button>

          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', background: showProfileMenu ? 'var(--bg-surface-elevated)' : 'transparent' }}
            >
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
                alt={user?.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)' }}
              />
              <div style={{ display: 'none', mdDisplay: 'block', textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name || 'Google user'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role || 'Admin'}</div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>

            {showProfileMenu && (
              <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '48px', width: '220px', padding: '8px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000 }}>
                <div style={{ padding: '8px', borderBottom: '1px solid var(--border-light)', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
                <button 
                  onClick={() => { setShowProfileMenu(false); logout(); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 0, color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', borderRadius: '6px', textAlign: 'left' }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
