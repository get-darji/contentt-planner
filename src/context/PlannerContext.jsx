import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PlannerContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  const [allWorkspaces, setAllWorkspaces] = useState(INITIAL_WORKSPACES);
  const [currentWorkspace, setCurrentWorkspace] = useState(INITIAL_WORKSPACES[0]);
  const [allTasks, setAllTasks] = useState([]);
  const [allIdeas, setAllIdeas] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // 1. Fetch Workspaces on Login
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/workspaces?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        
        const hasOwned = data.some(ws => ws.ownerEmail.toLowerCase() === user.email.toLowerCase());
        if (!hasOwned) {
          // Initialize default workspaces in database for this user
          const defaults = getInitialWorkspaces(user.email);
          const savedList = [...data];
          for (const ws of defaults) {
            const postRes = await fetch(`${API_BASE}/workspaces`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ws)
            });
            const savedWs = await postRes.json();
            savedList.push(savedWs);
          }
          setAllWorkspaces(savedList);
        } else {
          setAllWorkspaces(data);
        }
      } catch (err) {
        console.error('Failed to load workspaces from MongoDB:', err);
      }
    };
    fetchWorkspaces();
  }, [user]);

  const activeWorkspaces = user 
    ? allWorkspaces.filter(ws => 
        ws.ownerEmail.toLowerCase() === user.email.toLowerCase() ||
        (ws.teamMembers || []).some(m => m.email.toLowerCase() === user.email.toLowerCase())
      )
    : [];

  // Update current workspace if it's no longer valid or updated
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

  // 2. Fetch Tasks and Ideas on active Workspace change
  useEffect(() => {
    const fetchTasksAndIdeas = async () => {
      if (!currentWorkspace) return;
      try {
        const tasksRes = await fetch(`${API_BASE}/tasks?workspaceId=${encodeURIComponent(currentWorkspace.id)}`);
        const tasksData = await tasksRes.json();
        setAllTasks(processTaskStatuses(tasksData));

        const ideasRes = await fetch(`${API_BASE}/ideas?workspaceId=${encodeURIComponent(currentWorkspace.id)}`);
        const ideasData = await ideasRes.json();
        setAllIdeas(ideasData);
      } catch (err) {
        console.error('Failed to load tasks and ideas from MongoDB:', err);
      }
    };
    fetchTasksAndIdeas();
  }, [currentWorkspace]);

  // Evaluate grace period for tasks locally every 1 second
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

  // Derive planner role status
  const isPlanner = user && currentWorkspace
    ? currentWorkspace.ownerEmail.toLowerCase() !== user.email.toLowerCase()
    : false;

  const teamMembers = currentWorkspace ? (currentWorkspace.teamMembers || []) : [];

  // Operations via REST API

  const addTeamMember = async (email, name) => {
    if (!currentWorkspace) return;
    const trimmedEmail = email.trim().toLowerCase();
    const team = currentWorkspace.teamMembers || [];

    if (team.some(m => m.email.toLowerCase() === trimmedEmail)) {
      throw new Error('This email is already added to the team.');
    }
    if (currentWorkspace.ownerEmail.toLowerCase() === trimmedEmail) {
      throw new Error('Cannot add the workspace owner to the team.');
    }

    try {
      const res = await fetch(`${API_BASE}/workspaces/${currentWorkspace.id}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const updatedWorkspace = await res.json();
      if (res.ok) {
        setAllWorkspaces(prev => prev.map(ws => ws.id === currentWorkspace.id ? updatedWorkspace : ws));
      } else {
        throw new Error(updatedWorkspace.error || 'Failed to add team member.');
      }
    } catch (err) {
      throw err;
    }
  };

  const removeTeamMember = async (email) => {
    if (!currentWorkspace) return;
    try {
      const res = await fetch(`${API_BASE}/workspaces/${currentWorkspace.id}/team/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
      const updatedWorkspace = await res.json();
      if (res.ok) {
        setAllWorkspaces(prev => prev.map(ws => ws.id === currentWorkspace.id ? updatedWorkspace : ws));
      }
    } catch (err) {
      console.error('Failed to remove team member:', err);
    }
  };

  const addTask = async (newTask) => {
    if (!currentWorkspace) return;
    const deadlineMs = getTaskDeadlineTimestamp(newTask.scheduledDate, newTask.scheduledTime);
    const expirationMs = deadlineMs + GRACE_PERIOD_MS;
    let initialStatus = newTask.status || 'scheduled';

    if (initialStatus === 'scheduled' && Date.now() >= expirationMs) {
      initialStatus = 'missed';
    }

    const taskData = {
      id: 'task_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      contentLink: newTask.contentLink || '',
      description: newTask.description || '',
      assignee: newTask.assignee || 'Content Owner',
      ...newTask,
      workspaceId: currentWorkspace.id,
      status: initialStatus
    };

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const savedTask = await res.json();
      setAllTasks(prev => [savedTask, ...prev]);

      const newNotif = {
        id: 'notif_' + Date.now(),
        title: 'Content Scheduled',
        message: `"${savedTask.title}" was scheduled for ${savedTask.platform} at ${savedTask.scheduledTime || '12:00'}.`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      return savedTask;
    } catch (err) {
      console.error('Failed to add task to MongoDB:', err);
    }
  };

  const updateTask = async (id, updatedFields) => {
    // Optimistic UI updates
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

    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.error('Failed to update task in MongoDB:', err);
    }
  };

  const deleteTask = async (id) => {
    setAllTasks(prev => prev.filter(t => t.id !== id));
    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete task from MongoDB:', err);
    }
  };

  const addIdea = async (title, platform, notes) => {
    if (!currentWorkspace) return;
    const ideaData = {
      id: 'idea_' + Date.now(),
      title,
      platform,
      notes,
      workspaceId: currentWorkspace.id
    };

    try {
      const res = await fetch(`${API_BASE}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData)
      });
      const savedIdea = await res.json();
      setAllIdeas(prev => [savedIdea, ...prev]);
    } catch (err) {
      console.error('Failed to add idea to MongoDB:', err);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateWorkspaceName = async (name, handle) => {
    if (!currentWorkspace) return;
    try {
      const res = await fetch(`${API_BASE}/workspaces/${currentWorkspace.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, handle })
      });
      const updatedWorkspace = await res.json();
      if (res.ok) {
        setAllWorkspaces(prev => prev.map(ws => ws.id === currentWorkspace.id ? updatedWorkspace : ws));
      }
    } catch (err) {
      console.error('Failed to update workspace details:', err);
    }
  };

  const createWorkspace = async (name, handle, category = 'Creator Studio') => {
    if (!user) return;
    const wsData = {
      id: 'ws_' + Date.now(),
      name,
      handle: handle.startsWith('@') ? handle : '@' + handle,
      category,
      ownerEmail: user.email,
      teamMembers: []
    };

    try {
      const res = await fetch(`${API_BASE}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wsData)
      });
      const savedWs = await res.json();
      setAllWorkspaces(prev => [...prev, savedWs]);
      setCurrentWorkspace(savedWs);
      return savedWs;
    } catch (err) {
      console.error('Failed to create workspace in MongoDB:', err);
    }
  };

  return (
    <PlannerContext.Provider value={{
      tasks: allTasks,
      ideas: allIdeas,
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
      createWorkspace,
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
