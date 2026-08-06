import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  { id: 'ws_1', name: 'Personal Brand', handle: '@personal_brand', category: 'Creator Studio', ownerEmail: 'owner@example.com', teamMembers: [
    { email: 'planner@example.com', name: 'Sam Planner', role: 'planner', addedAt: new Date().toISOString().split('T')[0] }
  ] },
  { id: 'ws_2', name: 'Content HQ', handle: '@content_hq', category: 'Creator Workspace', ownerEmail: 'owner@example.com', teamMembers: [] }
];

const getInitialWorkspaces = (userEmail) => {
  const defaultTeam = userEmail.toLowerCase() === 'owner@example.com' ? [
    { email: 'planner@example.com', name: 'Sam Planner', role: 'planner', addedAt: new Date().toISOString().split('T')[0] }
  ] : [];

  return [
    { id: 'ws_1_' + userEmail.replace(/[@.]/g, '_'), name: 'Personal Brand', handle: '@personal_brand', category: 'Creator Studio', ownerEmail: userEmail, teamMembers: defaultTeam },
    { id: 'ws_2_' + userEmail.replace(/[@.]/g, '_'), name: 'Content HQ', handle: '@content_hq', category: 'Creator Workspace', ownerEmail: userEmail, teamMembers: [] }
  ];
};

export const PlannerProvider = ({ children }) => {
  const { user } = useAuth();

  // 1. Workspaces State & Invite Check
  const [allWorkspaces, setAllWorkspaces] = useState(() => {
    const saved = localStorage.getItem('darji_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  useEffect(() => {
    localStorage.setItem('darji_workspaces', JSON.stringify(allWorkspaces));
  }, [allWorkspaces]);

  // Ensure logged in user has their workspaces initialized
  useEffect(() => {
    if (!user) return;
    const hasWorkspaces = allWorkspaces.some(ws => 
      ws.ownerEmail.toLowerCase() === user.email.toLowerCase() ||
      (ws.teamMembers || []).some(m => m.email.toLowerCase() === user.email.toLowerCase())
    );
    if (!hasWorkspaces) {
      const initial = getInitialWorkspaces(user.email);
      setAllWorkspaces(prev => {
        const filteredPrev = prev.filter(ws => !initial.some(i => i.id === ws.id));
        return [...filteredPrev, ...initial];
      });
    }
  }, [user, allWorkspaces]);

  const activeWorkspaces = user 
    ? allWorkspaces.filter(ws => 
        ws.ownerEmail.toLowerCase() === user.email.toLowerCase() ||
        (ws.teamMembers || []).some(m => m.email.toLowerCase() === user.email.toLowerCase())
      )
    : [];

  const [currentWorkspace, setCurrentWorkspace] = useState(INITIAL_WORKSPACES[0]);

  useEffect(() => {
    if (activeWorkspaces.length > 0) {
      if (!currentWorkspace || !activeWorkspaces.some(ws => ws.id === currentWorkspace.id)) {
        setCurrentWorkspace(activeWorkspaces[0]);
      } else {
        const updated = activeWorkspaces.find(ws => ws.id === currentWorkspace.id);
        if (JSON.stringify(updated) !== JSON.stringify(currentWorkspace)) {
          setCurrentWorkspace(updated);
        }
      }
    }
  }, [activeWorkspaces, currentWorkspace]);

  // Derive Planner state from current active workspace
  const isPlanner = user && currentWorkspace
    ? currentWorkspace.ownerEmail.toLowerCase() !== user.email.toLowerCase() &&
      (currentWorkspace.teamMembers || []).some(m => m.email.toLowerCase() === user.email.toLowerCase() && m.role === 'planner')
    : false;

  const teamMembers = currentWorkspace ? (currentWorkspace.teamMembers || []) : [];

  const addTeamMember = (email, name) => {
    if (!currentWorkspace) return;
    const trimmedEmail = email.trim().toLowerCase();
    const team = currentWorkspace.teamMembers || [];

    if (team.some(m => m.email.toLowerCase() === trimmedEmail)) {
      throw new Error('This email is already added to the team.');
    }
    if (currentWorkspace.ownerEmail.toLowerCase() === trimmedEmail) {
      throw new Error('Cannot add the workspace owner to the team.');
    }

    const newMember = {
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      role: 'planner',
      addedAt: new Date().toISOString().split('T')[0]
    };

    setAllWorkspaces(prev => prev.map(ws => {
      if (ws.id === currentWorkspace.id) {
        return {
          ...ws,
          teamMembers: [...(ws.teamMembers || []), newMember]
        };
      }
      return ws;
    }));
  };

  const removeTeamMember = (email) => {
    if (!currentWorkspace) return;
    const trimmedEmail = email.trim().toLowerCase();

    setAllWorkspaces(prev => prev.map(ws => {
      if (ws.id === currentWorkspace.id) {
        return {
          ...ws,
          teamMembers: (ws.teamMembers || []).filter(m => m.email.toLowerCase() !== trimmedEmail)
        };
      }
      return ws;
    }));
  };

  // 2. Tasks State (Global store, filtered by workspace on export)
  const [allTasks, setAllTasks] = useState(() => {
    const saved = localStorage.getItem('darji_tasks');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Migrate legacy tasks
      const migrated = parsed.map(t => {
        if (!t.workspaceId) {
          return { ...t, workspaceId: 'ws_1' };
        }
        return t;
      });
      return processTaskStatuses(migrated);
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const checkStatus = () => {
      setAllTasks(prev => {
        const updated = processTaskStatuses(prev);
        if (JSON.stringify(updated) !== JSON.stringify(prev)) {
          return updated;
        }
        return prev;
      });
    };
    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('darji_tasks', JSON.stringify(allTasks));
  }, [allTasks]);

  // 3. Ideas State
  const [allIdeas, setAllIdeas] = useState(() => {
    const saved = localStorage.getItem('darji_ideas');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(idea => idea.workspaceId ? idea : { ...idea, workspaceId: 'ws_1' });
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('darji_ideas', JSON.stringify(allIdeas));
  }, [allIdeas]);

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // Filter tasks & ideas dynamically for active workspace
  const tasks = currentWorkspace 
    ? allTasks.filter(t => t.workspaceId === currentWorkspace.id)
    : [];

  const ideas = currentWorkspace
    ? allIdeas.filter(idea => idea.workspaceId === currentWorkspace.id)
    : [];

  const addTask = (newTask) => {
    if (!currentWorkspace) return;
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
      workspaceId: currentWorkspace.id,
      status: initialStatus
    };

    setAllTasks(prev => [taskObj, ...prev]);

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
    setAllTasks(prev => prev.map(t => {
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
    setAllTasks(prev => prev.filter(t => t.id !== id));
  };

  const addIdea = (title, platform, notes) => {
    if (!currentWorkspace) return;
    const ideaObj = { id: 'idea_' + Date.now(), title, platform, notes, workspaceId: currentWorkspace.id };
    setAllIdeas(prev => [ideaObj, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateWorkspaceName = (name, handle) => {
    if (!currentWorkspace) return;
    setAllWorkspaces(prev => prev.map(ws => {
      if (ws.id === currentWorkspace.id) {
        return { ...ws, name, handle };
      }
      return ws;
    }));
  };

  return (
    <PlannerContext.Provider value={{
      tasks,
      ideas,
      notifications,
      workspaces: activeWorkspaces,
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
      setIsIdeaModalOpen,
      teamMembers,
      isPlanner,
      addTeamMember,
      removeTeamMember
    }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => useContext(PlannerContext);
