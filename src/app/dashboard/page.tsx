"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  LogOut, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search,
  LayoutDashboard,
  Loader2,
  X
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user: {
    _id: string;
    name: string;
    email: string;
  } | string;
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      showMessage('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const handleOpenModal = (task: Task | null = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
        showMessage('Task updated successfully');
      } else {
        await api.post('/tasks', formData);
        showMessage('Task created successfully');
      }
      fetchTasks();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Operation failed', error);
      showMessage(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        showMessage('Task deleted successfully');
        fetchTasks();
      } catch (error: any) {
        console.error('Delete failed', error);
        showMessage(error.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <header className="glass-card" style={{ borderRadius: '0', borderLeft: '0', borderRight: '0', borderTop: '0', marginBottom: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
              <LayoutDashboard size={24} color="white" />
            </div>
            <div>
              <h2 className="gradient-text" style={{ fontSize: '1.2rem', margin: '0' }}>Primetrade Hub</h2>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right', display: 'none' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.email}</p>
            </div>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Notification Message */}
        {message && (
          <div style={{ 
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--error)'}`, 
            color: message.type === 'success' ? 'var(--success)' : 'var(--error)', 
            padding: '12px 20px', 
            borderRadius: '8px', 
            marginBottom: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* Actions Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px' }}
            />
          </div>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={20} /> Create Task
          </button>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task._id} className="glass-card" style={{ transition: 'transform 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      backgroundColor: task.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : task.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981'
                    }}>
                      {task.priority} Priority
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOpenModal(task)} style={{ color: 'rgba(255,255,255,0.6)' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(task._id)} style={{ color: 'rgba(239, 68, 68, 0.6)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{task.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px', lineHeight: '1.5' }}>{task.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      {task.status === 'completed' ? <CheckCircle size={16} color="#10b981" /> : task.status === 'in-progress' ? <Clock size={16} color="#3b82f6" /> : <AlertCircle size={16} color="#94a3b8" />}
                      <span style={{ textTransform: 'capitalize' }}>{task.status.replace('-', ' ')}</span>
                    </div>
                    {user.role === 'admin' && typeof task.user === 'object' && (
                       <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>By: {task.user.name}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                <p>No tasks found. Create one to get started!</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', color: 'rgba(255,255,255,0.6)' }}>
              <X size={24} />
            </button>
            
            <h2 style={{ marginBottom: '24px' }}>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem' }}>Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem' }}>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  required 
                  style={{ minHeight: '100px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem' }}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem' }}>Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as any})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
