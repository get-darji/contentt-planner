import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Palette, Copy, Sparkles } from 'lucide-react';
import { getPlatformIcon } from '../Calendar/ContentTile';

export const TemplatesView = ({ onOpenAddModal }) => {
  const templates = [
    { id: 'tpl_1', name: 'Instagram Carousel (10 Slides)', platform: 'Instagram', desc: 'Hook slide, value content, visual mockup, CTA end slide.' },
    { id: 'tpl_2', name: 'YouTube Video Script & Outline', platform: 'YouTube', desc: '15-second teaser intro, problem statement, demo, call to subscribe.' },
    { id: 'tpl_3', name: 'LinkedIn Thought Leadership Post', platform: 'LinkedIn', desc: 'Bold statement, 5 key lessons, engaging question prompt.' },
    { id: 'tpl_4', name: 'TikTok Trend Reaction Video', platform: 'TikTok', desc: 'Hook text overlay, audio sync, viral challenge reaction.' }
  ];

  return (
    <div className="page-container templates-page" style={{ padding: '0 32px 48px 32px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Content Templates</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pre-built frameworks for rapid content creation.</p>
      </div>

      <div className="card-grid two-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {templates.map(t => (
          <div key={t.id} className="ui-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#fff', padding: '6px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                  {getPlatformIcon(t.platform)}
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.platform} Template</span>
              </div>
              <button className="btn btn-orange-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => onOpenAddModal()}>
                <Copy size={14} /> Use Template
              </button>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>{t.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
