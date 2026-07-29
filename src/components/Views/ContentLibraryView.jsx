import React, { useState } from 'react';
import { Image, Video, Upload, Trash2, FolderPlus, Tag } from 'lucide-react';

export const ContentLibraryView = () => {
  const [assets, setAssets] = useState([
    { id: 1, title: 'Brand Hero Image 4K', type: 'Image', size: '3.4 MB', platform: 'Instagram', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Summer Collection Teaser Video', type: 'Video', size: '18.2 MB', platform: 'YouTube', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'AI Marketing Infographic Slide', type: 'Image', size: '1.2 MB', platform: 'LinkedIn', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80' }
  ]);

  const handleUpload = () => {
    alert('Simulated Media Upload: New high resolution asset added to your library!');
    const newAsset = {
      id: Date.now(),
      title: 'Uploaded Media Asset #' + (assets.length + 1),
      type: 'Image',
      size: '2.1 MB',
      platform: 'General',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'
    };
    setAssets([newAsset, ...assets]);
  };

  return (
    <div style={{ padding: '0 32px 48px 32px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Content Library</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Store and reuse brand assets, high-res images, video clips, and templates.</p>
        </div>

        <button className="btn btn-orange-primary" onClick={handleUpload}>
          <Upload size={16} /> Upload New Asset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {assets.map(asset => (
          <div key={asset.id} className="ui-card" style={{ overflow: 'hidden' }}>
            <img src={asset.url} alt={asset.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>{asset.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>{asset.type} • {asset.size}</span>
                <span className="status-pill pending">{asset.platform}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
