import React from 'react';
import { WhatsNextBanner } from './WhatsNextBanner';
import { MetricsBar } from './MetricsBar';
import { CalendarGrid } from './CalendarGrid';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';

export const DashboardView = ({ onOpenAddModal }) => {
  return (
    <div className="page-container dashboard-page" style={{ padding: '0 32px 48px 32px', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* 1. What's Next Horizontal Banner Card */}
      <WhatsNextBanner />

      {/* 2. 6 Stat Metrics Bar */}
      <MetricsBar />

      {/* 3. Main Grid Layout (Calendar & Activity on left, Quick Actions on right) */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* Left / Middle Section */}
        <div>
          {/* Calendar Card */}
          <CalendarGrid onSelectDate={(date) => onOpenAddModal && onOpenAddModal(date)} />

          {/* Recent activity and content progress cards */}
          <RecentActivity />
        </div>

        {/* Right Section */}
        <div>
          <QuickActions onOpenAddModal={onOpenAddModal} />
        </div>

      </div>

    </div>
  );
};
