import React, { useState, useEffect } from 'react';

const API_URL = '/api/tasks';

const STATUSES = [
  { key: 'daily', name: '交辦事項', color: '#f59e0b' },
  { key: 'backlog', name: '需求', color: '#6b7280' },
  { key: 'inprogress', name: '開發', color: '#3b82f6' },
  { key: 'testing', name: '測試', color: '#8b5cf6' },
  { key: 'deploy', name: '部署', color: '#f97316' },
  { key: 'done', name: '交付', color: '#10b981' }
];

const TAGS = {
  Cat: { color: '#10b981', bg: '#064e3b' },
  SRE: { color: '#3b82f6', bg: '#1e3a5f' },
  cc: { color: '#f59e0b', bg: '#78350f' },
  老闆: { color: '#ec4899', bg: '#831843' }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'backlog', tag: 'Cat' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        fetchTasks();
        setShowModal(false);
        setNewTask({ title: '', description: '', status: 'backlog', tag: 'Cat' });
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask)
      });
      if (res.ok) {
        fetchTasks();
        setEditingTask(null);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('確定要刪除這個任務嗎？')) return;
    try {
      await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🎯 Worker Dashboard v2.0</h1>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}>+ 新增任務</button>
      </header>

      <div style={styles.board}>
        {STATUSES.map(status => (
          <div key={status.key} style={styles.column}>
            <div style={{ ...styles.columnHeader, borderTopColor: status.color }}>
              <span>{status.name}</span>
              <span style={styles.badge}>{getTasksByStatus(status.key).length}</span>
            </div>
            <div style={styles.columnContent}>
              {getTasksByStatus(status.key).map(task => (
                <div key={task.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={{ ...styles.tag, background: TAGS[task.tag]?.bg || '#333', color: TAGS[task.tag]?.color || '#fff' }}>
                      {task.tag}
                    </span>
                    <div style={styles.cardActions}>
                      <button style={styles.iconBtn} onClick={() => setEditingTask(task)}>✏️</button>
                      <button style={styles.iconBtn} onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                    </div>
                  </div>
                  <h3 style={styles.cardTitle}>{task.title}</h3>
                  {task.description && <p style={styles.cardDesc}>{task.description}</p>}
                  <select
                    style={styles.select}
                    value={task.status}
                    onChange={(e) => handleMoveTask(task.id, e.target.value)}
                  >
                    {STATUSES.map(s => (
                      <option key={s.key} value={s.key}>{s.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>新增任務</h2>
            <form onSubmit={handleCreateTask}>
              <input
                style={styles.input}
                placeholder="任務標題"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <textarea
                style={{ ...styles.input, height: '80px' }}
                placeholder="任務描述"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <select
                style={styles.input}
                value={newTask.status}
                onChange={e => setNewTask({ ...newTask, status: e.target.value })}
              >
                {STATUSES.map(s => (
                  <option key={s.key} value={s.key}>{s.name}</option>
                ))}
              </select>
              <select
                style={styles.input}
                value={newTask.tag}
                onChange={e => setNewTask({ ...newTask, tag: e.target.value })}
              >
                <option value="Cat">Cat</option>
                <option value="SRE">SRE</option>
                <option value="cc">cc</option>
                <option value="老闆">老闆</option>
              </select>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>取消</button>
                <button type="submit" style={styles.submitBtn}>建立</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div style={styles.modalOverlay} onClick={() => setEditingTask(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>編輯任務</h2>
            <form onSubmit={handleUpdateTask}>
              <input
                style={styles.input}
                placeholder="任務標題"
                value={editingTask.title}
                onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                required
              />
              <textarea
                style={{ ...styles.input, height: '80px' }}
                placeholder="任務描述"
                value={editingTask.description}
                onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
              />
              <select
                style={styles.input}
                value={editingTask.status}
                onChange={e => setEditingTask({ ...editingTask, status: e.target.value })}
              >
                {STATUSES.map(s => (
                  <option key={s.key} value={s.key}>{s.name}</option>
                ))}
              </select>
              <select
                style={styles.input}
                value={editingTask.tag}
                onChange={e => setEditingTask({ ...editingTask, tag: e.target.value })}
              >
                <option value="Cat">Cat</option>
                <option value="SRE">SRE</option>
                <option value="cc">cc</option>
                <option value="老闆">老闆</option>
              </select>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setEditingTask(null)}>取消</button>
                <button type="submit" style={styles.submitBtn}>儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#1a1a2e', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  addBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', overflowX: 'auto' },
  column: { background: '#16213e', borderRadius: '8px', minWidth: '180px' },
  columnHeader: { padding: '12px', borderTop: '3px solid', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600' },
  badge: { background: '#374151', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' },
  columnContent: { padding: '8px', minHeight: '200px' },
  card: { background: '#0f3460', padding: '10px', borderRadius: '6px', marginBottom: '8px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  tag: { padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  cardActions: { display: 'flex', gap: '4px' },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' },
  cardTitle: { fontSize: '14px', marginBottom: '4px' },
  cardDesc: { fontSize: '12px', color: '#9ca3af', marginBottom: '8px' },
  select: { width: '100%', padding: '6px', background: '#1e293b', color: '#fff', border: '1px solid #374151', borderRadius: '4px', fontSize: '12px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#16213e', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', background: '#0f3460', color: '#fff', border: '1px solid #374151', borderRadius: '6px', fontSize: '14px' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' },
  cancelBtn: { background: '#374151', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default App;
