import React, { createContext, useContext, useState, useEffect } from 'react';

const PlannerContext = createContext();

// Fail-proof Parser for YYYY-MM-DD + HH:MM / HH:MM AM/PM
export const getTaskDeadlineTimestamp = (scheduledDate, scheduledTime) => {
  if (!scheduledDate) return Date.now();
  
  const [year, month, day] = scheduledDate.split('-').map(Number);
  
  let hours = 12;
  let minutes = 0;
  
  if (scheduledTime) {
    const rawTime = String(scheduledTime).trim();
    const isPM = /pm/i.test(rawTime);
    const isAM = /am/i.test(rawTime);
    
    const cleanTime = rawTime.replace(/[^\d:]/g, '');
    const parts = cleanTime.split(':').map(Number);
    
    if (parts.length >= 1 && !isNaN(parts[0])) {
      hours = parts[0];
    }
    if (parts.length >= 2 && !isNaN(parts[1])) {
      minutes = parts[1];
    }
    
    if (isPM && hours < 12) {
      hours += 12;
    }
    if (isAM && hours === 12) {
      hours = 0;
    }
  }

  const deadlineDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return deadlineDate.getTime();
};

// 30 Minutes Grace Period in milliseconds
export const GRACE_PERIOD_MS = 30 * 60 * 1000;

export const processTaskStatuses = (taskList) => {
  const nowMs = Date.now();

  return taskList.map(task => {
    if (task.status === 'scheduled') {
      const deadlineMs = getTaskDeadlineTimestamp(task.scheduledDate, task.scheduledTime);
      const expirationMs = deadlineMs + GRACE_PERIOD_MS;
      
      // If current time exceeds scheduled time + 30 mins grace period, mark as missed!
      if (nowMs >= expirationMs) {
        return { ...task, status: 'missed' };
      }
    }
    return task;
  });
};

const INITIAL_WORKSPACES = [
  { id: 'ws_1', name: 'Personal Brand', handle: '@personal_brand', category: 'Creator Studio' },
  { id: 'ws_2', name: 'Content HQ', handle: '@content_hq', category: 'Creator Workspace' }
];

export const PlannerProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('darji_tasks');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (parsed.some(t => t.id === 'task_101' || t.id === 'task_1' || t.id === 'task_102')) {
        return [];
      }
      return processTaskStatuses(parsed);
    } catch (e) {
      return [];
    }
  });

  const [ideas, setIdeas] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [workspaces, setWorkspaces] = useState(INITIAL_WORKSPACES);
  const [currentWorkspace, setCurrentWorkspace] = useState(INITIAL_WORKSPACES[0]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // Evaluate 30-min grace period continuously every 1 second
  useEffect(() => {
    const checkStatus = () => {
      setTasks(prev => {
        const updated = processTaskStatuses(prev);
        if (JSON.stringify(updated) !== JSON.stringify(prev)) {
          return updated;
        }
        return prev;
      });
    };

    checkStatus(); // Immediate check on mount
    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('darji_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Operations
  const addTask = (newTask) => {
    const deadlineMs = getTaskDeadlineTimestamp(newTask.scheduledDate, newTask.scheduledTime);
    const expirationMs = deadlineMs + GRACE_PERIOD_MS;
    let initialStatus = newTask.status || 'scheduled';

    if (initialStatus === 'scheduled' && Date.now() >= expirationMs) {
      initialStatus = 'missed';
    }

    const taskObj = {
      id: 'task_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      contentLink: newTask.contentLink || '',
      description: newTask.description || '',
      assignee: newTask.assignee || 'Content Owner',
      ...newTask,
      status: initialStatus
    };

    setTasks(prev => [taskObj, ...prev]);

    const newNotif = {
      id: 'notif_' + Date.now(),
      title: 'Content Scheduled',
      message: `"${taskObj.title}" was scheduled for ${taskObj.platform} at ${taskObj.scheduledTime || '12:00'}.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    return taskObj;
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const merged = { ...t, ...updatedFields };
        if (merged.status === 'scheduled') {
          const deadlineMs = getTaskDeadlineTimestamp(merged.scheduledDate, merged.scheduledTime);
          const expirationMs = deadlineMs + GRACE_PERIOD_MS;
          if (Date.now() >= expirationMs) {
            merged.status = 'missed';
          }
        }
        return merged;
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addIdea = (title, platform, notes) => {
    const ideaObj = { id: 'idea_' + Date.now(), title, platform, notes };
    setIdeas(prev => [ideaObj, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateWorkspaceName = (name, handle) => {
    setCurrentWorkspace(prev => ({ ...prev, name, handle }));
  };

  return (
    <PlannerContext.Provider value={{
      tasks,
      ideas,
      notifications,
      workspaces,
      workspace: currentWorkspace,
      setWorkspace: setCurrentWorkspace,
      activeTab,
      setActiveTab,
      platformFilter,
      setPlatformFilter,
      statusFilter,
      setStatusFilter,
      addTask,
      updateTask,
      deleteTask,
      addIdea,
      markAllNotificationsRead,
      updateWorkspaceName,
      isIdeaModalOpen,
      setIsIdeaModalOpen
    }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => useContext(PlannerContext);
