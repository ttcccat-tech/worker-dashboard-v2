const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new Database(path.join(__dirname, 'database.sqlite'));

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'backlog',
    tag TEXT DEFAULT 'Cat',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Status columns
const STATUSES = ['daily', 'backlog', 'inprogress', 'testing', 'deploy', 'done'];

// Tags
const TAGS = ['Cat', 'SRE', 'cc', '老闆'];

// API Routes

// GET all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description = '', status = 'backlog', tag = 'Cat' } = req.body;
    const stmt = db.prepare('INSERT INTO tasks (title, description, status, tag) VALUES (?, ?, ?, ?)');
    const result = stmt.run(title, description, status, tag);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, tag } = req.body;
    const stmt = db.prepare(`
      UPDATE tasks 
      SET title = COALESCE(?, title), 
          description = COALESCE(?, description),
          status = COALESCE(?, status), 
          tag = COALESCE(?, tag),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(title, description, status, tag, id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT move task to different status
app.put('/api/tasks/:id/move', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Auto-tag logic:
    // - 移到 inprogress → 自動設為 Cat（開始開發）
    // - 移到 testing → 自動設為 cc（要給 cc code review）
    // - 移到 done → 自動設為 老闆（要給老闆驗收）
    let tag = req.body.tag;
    if (status === 'inprogress' && !tag) {
      tag = 'Cat';
    } else if (status === 'testing' && !tag) {
      tag = 'cc';
    } else if (status === 'done' && !tag) {
      tag = '老闆';
    }
    
    const stmt = db.prepare(`
      UPDATE tasks 
      SET status = ?, tag = COALESCE(?, tag), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(status, tag, id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from client build
const buildPath = path.join(__dirname, '..', 'client', 'build');
console.log('Static files path:', buildPath);

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Worker Dashboard v2.0 running on port ${PORT}`);
});
