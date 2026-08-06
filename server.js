import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/darji';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB database successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas & Models
const WorkspaceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  handle: { type: String, required: true },
  category: { type: String },
  ownerEmail: { type: String, required: true },
  teamMembers: [
    {
      email: { type: String, required: true },
      name: { type: String },
      role: { type: String, default: 'planner' },
      addedAt: { type: String }
    }
  ]
});
const Workspace = mongoose.model('Workspace', WorkspaceSchema);

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  platform: { type: String, required: true },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String },
  description: { type: String },
  assignee: { type: String },
  contentLink: { type: String },
  status: { type: String, default: 'scheduled' },
  workspaceId: { type: String, required: true },
  createdAt: { type: String }
});
const Task = mongoose.model('Task', TaskSchema);

const IdeaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  platform: { type: String },
  notes: { type: String },
  workspaceId: { type: String, required: true }
});
const Idea = mongoose.model('Idea', IdeaSchema);

// REST API Routes

// 1. Workspaces Routes
app.get('/api/workspaces', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }
  try {
    const userEmail = email.toLowerCase();
    const workspaces = await Workspace.find({
      $or: [
        { ownerEmail: userEmail },
        { 'teamMembers.email': userEmail }
      ]
    });
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workspaces.', details: err.message });
  }
});

app.post('/api/workspaces', async (req, res) => {
  try {
    const { id, name, handle, category, ownerEmail, teamMembers } = req.body;
    const newWorkspace = new Workspace({
      id: id || 'ws_' + Date.now(),
      name,
      handle,
      category: category || 'Creator Studio',
      ownerEmail: ownerEmail.toLowerCase(),
      teamMembers: teamMembers || []
    });
    await newWorkspace.save();
    res.status(201).json(newWorkspace);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workspace.', details: err.message });
  }
});

app.put('/api/workspaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, handle } = req.body;
    const updated = await Workspace.findOneAndUpdate(
      { id },
      { $set: { name, handle } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Workspace not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workspace.', details: err.message });
  }
});

app.post('/api/workspaces/:id/team', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, addedAt } = req.body;
    const workspace = await Workspace.findOne({ id });
    if (!workspace) return res.status(404).json({ error: 'Workspace not found.' });

    const trimmedEmail = email.trim().toLowerCase();
    if (workspace.teamMembers.some(m => m.email.toLowerCase() === trimmedEmail)) {
      return res.status(400).json({ error: 'Email already exists in the team.' });
    }
    if (workspace.ownerEmail.toLowerCase() === trimmedEmail) {
      return res.status(400).json({ error: 'Cannot add the owner to the team.' });
    }

    const newMember = {
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      role: role || 'planner',
      addedAt: addedAt || new Date().toISOString().split('T')[0]
    };

    workspace.teamMembers.push(newMember);
    await workspace.save();
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add team member.', details: err.message });
  }
});

app.delete('/api/workspaces/:id/team/:email', async (req, res) => {
  try {
    const { id, email } = req.params;
    const workspace = await Workspace.findOne({ id });
    if (!workspace) return res.status(404).json({ error: 'Workspace not found.' });

    workspace.teamMembers = workspace.teamMembers.filter(m => m.email.toLowerCase() !== email.toLowerCase());
    await workspace.save();
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove team member.', details: err.message });
  }
});

// 2. Tasks Routes
app.get('/api/tasks', async (req, res) => {
  const { workspaceId } = req.query;
  if (!workspaceId) {
    return res.status(400).json({ error: 'workspaceId parameter is required.' });
  }
  try {
    const tasks = await Task.find({ workspaceId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks.', details: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const taskObj = req.body;
    const newTask = new Task({
      id: taskObj.id || 'task_' + Date.now(),
      createdAt: taskObj.createdAt || new Date().toISOString().split('T')[0],
      title: taskObj.title,
      platform: taskObj.platform,
      scheduledDate: taskObj.scheduledDate,
      scheduledTime: taskObj.scheduledTime || '12:00',
      description: taskObj.description || '',
      assignee: taskObj.assignee || 'Content Owner',
      contentLink: taskObj.contentLink || '',
      status: taskObj.status || 'scheduled',
      workspaceId: taskObj.workspaceId
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task.', details: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Task.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Task not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task.', details: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ error: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task.', details: err.message });
  }
});

// 3. Ideas Routes
app.get('/api/ideas', async (req, res) => {
  const { workspaceId } = req.query;
  if (!workspaceId) {
    return res.status(400).json({ error: 'workspaceId parameter is required.' });
  }
  try {
    const ideas = await Idea.find({ workspaceId }).sort({ id: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ideas.', details: err.message });
  }
});

app.post('/api/ideas', async (req, res) => {
  try {
    const { id, title, platform, notes, workspaceId } = req.body;
    const newIdea = new Idea({
      id: id || 'idea_' + Date.now(),
      title,
      platform,
      notes: notes || '',
      workspaceId
    });
    await newIdea.save();
    res.status(201).json(newIdea);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create idea.', details: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
