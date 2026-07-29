import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Crown, Check, X, Zap, Sparkles } from 'lucide-react';

export const ProUpgradeModal = () => {
  const { isProModalOpen, setIsProModalOpen } = usePlanner();
  const [annual, setAnnual] = useState(true);

  if (!isProModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsProModalOpen(false)}>
      <div className="modal-container" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ff7a00 0%, #ff9e00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 12px auto',
            boxShadow: '0 8px 24px rgba(255, 122, 0, 0.35)'
          }}>
            <Crown size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Upgrade to Darji Pro</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Unlock AI generation, unlimited content planning, and advanced social analytics.
          </p>
        </div>

        {/* Toggle Billing */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--bg-main)', padding: '4px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setAnnual(false)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 0, background: !annual ? '#fff' : 'transparent', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Monthly Billing
          </button>
          <button 
            onClick={() => setAnnual(true)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 0, background: annual ? 'var(--orange-primary)' : 'transparent', color: annual ? '#fff' : 'var(--text-main)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Annual (Save 20%) 🔥
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>${annual ? '19' : '24'}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> / month</span>
        </div>

        {/* Feature List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {[
            'Unlimited social media content planning',
            'AI Assistant for caption & hashtag generation',
            'Cross-platform automatic publishing',
            'Advanced analytics & PDF export reports',
            'Unlimited workspaces'
          ].map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
              <div style={{ background: '#dcfce7', color: '#10b981', padding: '2px', borderRadius: '50%', display: 'flex' }}>
                <Check size={14} />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => { alert('Thank you for upgrading to Darji Pro!'); setIsProModalOpen(false); }}
          className="btn btn-orange-primary" 
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
        >
          Start 14-Day Free Trial
        </button>

        <button 
          onClick={() => setIsProModalOpen(false)}
          style={{ width: '100%', background: 'transparent', border: 0, color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px', cursor: 'pointer' }}
        >
          Cancel
        </button>

      </div>
    </div>
  );
};
