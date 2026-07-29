import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Sparkles, AlertCircle, X, ArrowRight } from 'lucide-react';

export const AlertBanner = () => {
  const { alertBanner, setAlertBanner, tasks } = usePlanner();

  if (!alertBanner.visible) return null;

  // Calculate missed & scheduled counts dynamically
  const missedCount = tasks.filter(t => t.status === 'missed').length;
  const todayScheduled = tasks.filter(t => t.status === 'scheduled' && t.scheduledDate === '2026-07-26').length;

  return (
    <div style={{
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
      color: '#ffffff',
      padding: '8px 24px',
      fontSize: '0.85rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(79, 70, 229, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
        <Sparkles size={16} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))' }} />
        <span>{alertBanner.message}</span>
        {missedCount > 0 && (
          <span style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={12} color="#f87171" /> {missedCount} Missed Content Task{missedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <button 
        onClick={() => setAlertBanner(prev => ({ ...prev, visible: false }))}
        style={{ background: 'transparent', border: 0, color: '#ffffff', cursor: 'pointer', opacity: 0.8, padding: '2px' }}
        title="Dismiss Announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
};
