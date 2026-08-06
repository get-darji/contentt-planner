import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import { getPlatformIcon } from '../Calendar/ContentTile';
import { 
  Search, 
  Bell, 
  Briefcase, 
  ChevronDown, 
  Command, 
  CheckCheck,
  User,
  LogOut,
  X,
  Plus
} from 'lucide-react';

export const Header = () => {
  const { 
    workspace, 
    workspaces, 
    setWorkspace, 
    notifications, 
    markAllNotificationsRead, 
    tasks,
    setActiveTab,
    isPlanner
  } = usePlanner();

  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Search Filtering
  const searchResults = searchQuery.trim() ? tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <header className="app-header" style={{
      background: 'transparent',
      padding: '24px 32px 16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      position: 'relative'
    }}>
      
      {/* Greeting & Tagline */}
      <div className="header-title">
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Good morning, {user?.name ? user.name.split(' ')[0] : 'there'}!
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
          Plan. Create. Publish. Grow.
        </p>
      </div>

      {/* Right Tools Widget */}
      <div className="header-tools" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* Workspace Dropdown */}
        <div className="workspace-menu-wrap" style={{ position: 'relative' }}>
          <div 
            onClick={() => { setShowWorkspaceMenu(!showWorkspaceMenu); setShowNotifMenu(false); setShowProfileMenu(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              padding: '6px 14px',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ background: '#fff0db', padding: '6px', borderRadius: '8px', color: 'var(--orange-primary)', display: 'flex' }}>
              <Briefcase size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Workspace</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {workspace.name} <ChevronDown size={14} color="var(--text-muted)" />
              </div>
            </div>
          </div>

          {showWorkspaceMenu && (
            <div className="ui-card" style={{ position: 'absolute', right: 0, top: '48px', width: '230px', padding: '8px', zIndex: 1000, boxShadow: 'var(--shadow-dropdown)' }}>
              <div style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                ACTIVE WORKSPACE
              </div>
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => { setWorkspace(ws); setShowWorkspaceMenu(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 0,
                    background: workspace.id === ws.id ? 'var(--orange-light)' : 'transparent',
                    color: workspace.id === ws.id ? 'var(--orange-primary)' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '2px'
                  }}
                >
                  <div>{ws.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>{ws.handle}</div>
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '4px', paddingTop: '4px' }}>
                <button 
                  onClick={() => { setActiveTab('workspaces'); setShowWorkspaceMenu(false); }}
                  style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 0, color: 'var(--orange-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Manage Workspaces
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Input with Shortcut Badge & Dropdown Results */}
        <div className="global-search" style={{ position: 'relative', width: '240px' }}>
          <input 
            type="text"
            className="form-input"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
            onFocus={() => setShowSearchDropdown(true)}
            style={{
              paddingLeft: '36px',
              paddingRight: '48px',
              background: '#ffffff',
              borderRadius: '12px',
              fontSize: '0.85rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          
          <div style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--bg-input)',
            padding: '2px 6px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            border: '1px solid var(--border-color)'
          }}>
            <Command size={10} /> K
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="ui-card" style={{ position: 'absolute', left: 0, right: 0, top: '46px', padding: '12px', zIndex: 1000, boxShadow: 'var(--shadow-dropdown)', maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                <span>SEARCH RESULTS ({searchResults.length})</span>
                <X size={14} style={{ cursor: 'pointer' }} onClick={() => setShowSearchDropdown(false)} />
              </div>

              {searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {searchResults.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => { setActiveTab('calendar'); setShowSearchDropdown(false); }}
                      style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <div style={{ background: '#fff', padding: '4px', borderRadius: '4px', display: 'flex' }}>
                        {getPlatformIcon(item.platform)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.platform} • {item.scheduledDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No content found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => { setShowNotifMenu(!showNotifMenu); setShowWorkspaceMenu(false); setShowProfileMenu(false); }}
            style={{
              position: 'relative',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Bell size={18} color="var(--text-secondary)" />
            {unreadNotifsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: 'var(--orange-primary)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}>
                {unreadNotifsCount}
              </span>
            )}
          </div>

          {showNotifMenu && (
            <div className="ui-card" style={{ position: 'absolute', right: 0, top: '48px', width: '300px', padding: '12px', zIndex: 1000, boxShadow: 'var(--shadow-dropdown)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Notifications</span>
                {unreadNotifsCount > 0 && (
                  <button 
                    onClick={markAllNotificationsRead}
                    style={{ background: 'transparent', border: 0, color: 'var(--orange-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CheckCheck size={14} /> Mark Read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '8px 10px', borderRadius: '8px', background: n.read ? '#ffffff' : 'var(--orange-light)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: n.read ? 'var(--text-main)' : 'var(--orange-primary)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div style={{ position: 'relative' }}>
          <img 
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name || 'Google profile'}
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifMenu(false); setShowWorkspaceMenu(false); }}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
          />

          {showProfileMenu && (
            <div className="ui-card" style={{ position: 'absolute', right: 0, top: '48px', width: '220px', padding: '12px', zIndex: 1000, boxShadow: 'var(--shadow-dropdown)' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{user?.name || 'Google user'}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email || ''}</div>
                <div style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, color: isPlanner ? 'var(--orange-primary)' : 'var(--status-published-text)', background: isPlanner ? 'var(--orange-light)' : 'var(--status-published-bg)', padding: '2px 8px', borderRadius: '10px', marginTop: '6px', border: isPlanner ? '1px solid var(--orange-border)' : '1px solid var(--status-published-border)' }}>
                  Role: {isPlanner ? 'Planner' : 'Owner'}
                </div>
              </div>
              <button 
                onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                style={{ width: '100%', padding: '8px', background: 'transparent', border: 0, color: 'var(--text-main)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <User size={14} /> Google Profile
              </button>
              <button 
                onClick={() => { logout(); setShowProfileMenu(false); }}
                style={{ width: '100%', padding: '8px', background: 'transparent', border: 0, color: '#dc2626', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
