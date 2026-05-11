import React, { useState, useEffect } from 'react';
import { db, isDemoMode } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, updateDoc, deleteDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, CheckCircle, Circle, Clock, Filter, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;

    if (isDemoMode) {
      const storedTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`) || '[]');
      setTasks(storedTasks);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  const saveDemoTasks = (newTasks) => {
    localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    if (isDemoMode) {
      const task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };
      saveDemoTasks([task, ...tasks]);
      setNewTask('');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        text: newTask,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewTask('');
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id, completed) => {
    if (isDemoMode) {
      const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !completed } : t);
      saveDemoTasks(newTasks);
      return;
    }

    try {
      await updateDoc(doc(db, 'tasks', id), { completed: !completed });
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    if (isDemoMode) {
      const newTasks = tasks.filter(t => t.id !== id);
      saveDemoTasks(newTasks);
      return;
    }

    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Your <span style={{ color: 'var(--primary-color)' }}>Tasks</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Stay organized and productive every day</p>
      </header>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Task Form */}
        <form onSubmit={addTask} className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '2rem', borderRadius: '20px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Add a new task..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ border: 'none', background: 'transparent' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px' }}>
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </form>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'pending', 'completed'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {filteredTasks.length} tasks
          </div>
        </div>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card" 
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--success-color)' : 'var(--text-secondary)' }}
                  >
                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  <span style={{ 
                    fontSize: '1.1rem', 
                    color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {task.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="btn-secondary" 
                  style={{ background: 'rgba(244, 63, 94, 0.1)', border: 'none', color: 'var(--accent-color)', padding: '0.5rem', borderRadius: '10px' }}
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
              <Clock size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No tasks found in this view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
