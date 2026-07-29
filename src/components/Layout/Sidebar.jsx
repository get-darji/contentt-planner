import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  FileText, 
  BarChart2, 
  FolderKanban, 
  Palette, 
  Building2, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab } = usePlanner();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'library', label: 'Content Library', icon: FolderKanban },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'workspaces', label: 'Workspaces', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: collapsed ? '80px' : '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
      transition: 'width 0.25s ease',
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 900
    }}>
      <div>
        {/* Brand Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '28px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff7a00 0%, #ff9e00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(255, 122, 0, 0.35)'
          }}>
            🪡
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.35rem', color: '#ff7a00', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Darji
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Content Planner
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'workspace' && item.id === 'workspaces');
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 0,
                  background: isActive ? 'var(--orange-light)' : 'transparent',
                  color: isActive ? 'var(--orange-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderRight: isActive ? '3px solid var(--orange-primary)' : '3px solid transparent',
                  borderRadius: isActive ? '10px 0 0 10px' : '10px'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--orange-primary)' : 'var(--text-muted)'} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle (Upgrade banner removed as requested) */}
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'transparent',
            border: 0,
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%'
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
