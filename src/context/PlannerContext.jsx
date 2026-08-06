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

  // Offline-first state initialization from localStorage
  const [allWorkspaces, setAllWorkspaces] = useState(() => {
    const saved = localStorage.getItem('darji_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    const saved = localStorage.getItem('darji_workspaces');
    const parsed = saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
    return parsed[0];
  });

  const [allTasks, setAllTasks] = useState(() => {
    const saved = localStorage.getItem('darji_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [allIdeas, setAllIdeas] = useState(() => {
    const saved = localStorage.getItem('darji_ideas');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // 1. Fetch Workspaces on Login with localStorage backup
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/workspaces?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error('API server returned non-ok response');
        const data = await res.json();
        
        const hasOwned = data.some(ws => ws.ownerEmail.toLowerCase() === user.email.toLowerCase());
        let finalWorkspaces = data;
        if (!hasOwned) {
          // Initialize default workspaces in database
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
          finalWorkspaces = savedList;
        }
        setAllWorkspaces(finalWorkspaces);
        localStorage.setItem('darji_workspaces', JSON.stringify(finalWorkspaces));
      } catch (err) {
        console.error('Failed to load workspaces from MongoDB, using localStorage:', err);
        const saved = localStorage.getItem('darji_workspaces');
        if (saved) {
          setAllWorkspaces(JSON.parse(saved));
        } else {
          // Generate defaults offline
          const defaults = getInitialWorkspaces(user.email);
          setAllWorkspaces(defaults);
          localStorage.setItem('darji_workspaces', JSON.stringify(defaults));
        }
      }
    };
    fetchWorkspaces();
  }, [user]);

  const activeWorkspaces = user 
    ? allWorkspaces.filter(ws => 
        (ws.ownerEmail && ws.ownerEmail.toLowerCase() === user.email.toLowerCase()) ||
        (ws.teamMembers || []).some(m => m.email && m.email.toLowerCase() === user.email.toLowerCase())
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

  // 2. Fetch Tasks and Ideas on active Workspace change with localStorage backup
  useEffect(() => {
    const fetchTasksAndIdeas = async () => {
      if (!currentWorkspace) return;
      try {
        const tasksRes = await fetch(`${API_BASE}/tasks?workspaceId=${encodeURIComponent(currentWorkspace.id)}`);
        if (!tasksRes.ok) throw new Error('API tasks fetch failed');
        const tasksData = await tasksRes.json();
        setAllTasks(processTaskStatuses(tasksData));
        
        // Mirror current workspace tasks in global darji_tasks localStorage
        const savedTasks = localStorage.getItem('darji_tasks');
        let parsed = savedTasks ? JSON.parse(savedTasks) : [];
        parsed = parsed.filter(t => t.workspaceId !== currentWorkspace.id);
        const merged = [...tasksData, ...parsed];
        localStorage.setItem('darji_tasks', JSON.stringify(merged));

        const ideasRes = await fetch(`${API_BASE}/ideas?workspaceId=${encodeURIComponent(currentWorkspace.id)}`);
        if (!ideasRes.ok) throw new Error('API ideas fetch failed');
        const ideasData = await ideasRes.json();
        setAllIdeas(ideasData);

        // Mirror current workspace ideas in global darji_ideas localStorage
        const savedIdeas = localStorage.getItem('darji_ideas');
        let parsedIdeas = savedIdeas ? JSON.parse(savedIdeas) : [];
        parsedIdeas = parsedIdeas.filter(idea => idea.workspaceId !== currentWorkspace.id);
        const mergedIdeas = [...ideasData, ...parsedIdeas];
        localStorage.setItem('darji_ideas', JSON.stringify(mergedIdeas));
      } catch (err) {
        console.error('Failed to load tasks and ideas from MongoDB, using localStorage:', err);
        const savedTasks = localStorage.getItem('darji_tasks');
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks);
          const filtered = parsed.filter(t => t.workspaceId === currentWorkspace.id);
          setAllTasks(processTaskStatuses(filtered));
        }
        const savedIdeas = localStorage.getItem('darji_ideas');
        if (savedIdeas) {
          const parsed = JSON.parse(savedIdeas);
          const filtered = parsed.filter(idea => idea.workspaceId === currentWorkspace.id);
          setAllIdeas(filtered);
        }
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

  // Operations via REST API with Offline-First localStorage fallbacks

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

    const newMember = {
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      role: 'planner',
      addedAt: new Date().toISOString().split('T')[0]
    };

    const updatedWorkspace = {
      ...currentWorkspace,
      teamMembers: [...(currentWorkspace.teamMembers || []), newMember]
    };

    // Update state & localStorage first
    setAllWorkspaces(prev => {
      const list = prev.map(ws => ws.id === currentWorkspace.id ? updatedWorkspace : ws);
      localStorage.setItem('darji_workspaces', JSON.stringify(list));
      return list;
    });

    try {
      await fetch(`${API_BASE}/workspaces/${currentWorkspace.id}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
    } catch (err) {
      console.error('Failed to add team member to MongoDB, saved locally:', err);
    }
  };

  const removeTeamMember = async (email) => {
    if (!currentWorkspace) return;
    const updatedWorkspace = {
      ...currentWorkspace,
      teamMembers: (currentWorkspace.teamMembers || []).filter(m => m.email.toLowerCase() !== email.toLowerCase())
    };

    setAllWorkspaces(prev => {
      const list = prev.map(ws => ws.id === currentWorkspace.id ? updatedWorkspace : ws);
      localStorage.setItem('darji_workspaces', JSON.stringify(list));
      return list;
    });

    try {
      await fetch(`${API_BASE}/workspaces/${currentWorkspace.id}/team/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to remove team member from MongoDB:', err);
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

    // Update state & localStorage first
    setAllTasks(prev => {
      const list = [taskData, ...prev];
      localStorage.setItem('darji_tasks', JSON.stringify(list));
      return list;
    });

    const newNotif = {
      id: 'notif_' + Date.now(),
      title: 'Content Scheduled',
      message: `"${taskData.title}" was scheduled for ${taskData.platform} at ${taskData.scheduledTime || '12:00'}.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    try {
      await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
    } catch (err) {
      console.error('Failed to add task to MongoDB:', err);
    }
    return taskData;
  };

  const updateTask = async (id, updatedFields) => {
    setAllTasks(prev => {
      const list = prev.map(t => {
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
      });
      localStorage.setItem('darji_tasks', JSON.stringify(list));
      return list;
    });

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
    setAllTasks(prev => {
      const list = prev.filter(t => t.id !== id);
      localStorage.setItem('darji_tasks', JSON.stringify(list));
      return list;
    });

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

    setAllIdeas(prev => {
      const list = [ideaData, ...prev];
      localStorage.setItem('darji_ideas', JSON.stringify(list));
      return list;
    });

    try {
      await fetch(`${API_BASE}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData)
      });
    } catch (err) {
      console.error('Failed to add idea to MongoDB:', err);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateWorkspaceName = async (name, handle) => {
    if (!currentWorkspace) return;
    const updatedWorkspace = { ...currentWorkspace, name, handle };

    setAllWorkspaces(prev => {
      const list = prev.map(ws => ws.id === currentWorkspace.id ? updatedWorkspace : ws);
      localStorage.setItem('darji_workspaces', JSON.stringify(list));
      return list;
    });

    try {
      await fetch(`${API_BASE}/workspaces/${currentWorkspace.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, handle })
      });
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

    // Update state & localStorage first
    setAllWorkspaces(prev => {
      const list = [...prev, wsData];
      localStorage.setItem('darji_workspaces', JSON.stringify(list));
      return list;
    });
    setCurrentWorkspace(wsData);

    try {
      const res = await fetch(`${API_BASE}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wsData)
      });
      const savedWs = await res.json();
      setAllWorkspaces(prev => {
        const list = prev.map(ws => ws.id === wsData.id ? savedWs : ws);
        localStorage.setItem('darji_workspaces', JSON.stringify(list));
        return list;
      });
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
