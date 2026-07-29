import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { CalendarView } from './components/Calendar/CalendarView';
import { ContentView } from './components/Views/ContentView';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { ContentLibraryView } from './components/Views/ContentLibraryView';
import { TemplatesView } from './components/Views/TemplatesView';
import { WorkspaceSettings } from './components/Workspace/WorkspaceSettings';
import { SettingsView } from './components/Views/SettingsView';
import { ContentModal } from './components/Calendar/ContentModal';
import { QuickIdeaModal } from './components/Modals/QuickIdeaModal';
import { AuthModal } from './components/Auth/AuthModal';

const MainContent = () => {
  const { isAuthenticated } = useAuth();
  const { activeTab } = usePlanner();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [selectedDateForModal, setSelectedDateForModal] = useState('');

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  const handleOpenAddModal = (dateStr) => {
    setSelectedTaskForEdit(null);
    if (typeof dateStr === 'string') {
      setSelectedDateForModal(dateStr);
    } else {
      setSelectedDateForModal('');
    }
    setIsAddModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTaskForEdit(task);
    setIsAddModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header */}
        <Header />

        {/* Dynamic View rendering based on active tab */}
        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <DashboardView onOpenAddModal={handleOpenAddModal} />
          )}

          {activeTab === 'calendar' && (
            <CalendarView />
          )}

          {activeTab === 'content' && (
            <ContentView onOpenAddModal={handleOpenAddModal} onEditTask={handleEditTask} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

          {activeTab === 'library' && (
            <ContentLibraryView />
          )}

          {activeTab === 'templates' && (
            <TemplatesView onOpenAddModal={handleOpenAddModal} />
          )}

          {(activeTab === 'workspace' || activeTab === 'workspaces') && (
            <WorkspaceSettings />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Content Task Modal */}
      <ContentModal 
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setSelectedTaskForEdit(null); }}
        editingTask={selectedTaskForEdit}
        initialDate={selectedDateForModal}
      />

      {/* Quick Idea Modal */}
      <QuickIdeaModal />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PlannerProvider>
        <MainContent />
      </PlannerProvider>
    </AuthProvider>
  );
}
