import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos'

const TAGS = ['personal', 'work', 'urgent', 'health']

const TAG_STYLES = {
  work:     { background: '#ede9fe', color: '#5b21b6' },
  personal: { background: '#fef3c7', color: '#92400e' },
  urgent:   { background: '#fee2e2', color: '#991b1b' },
  health:   { background: '#dcfce7', color: '#166534' },
}

function formatDate(iso) {
  if (!iso) return 'Today'
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [tag, setTag] = useState('personal')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchTodos() }, [])

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(API)
      setTodos(data)
    } catch {
      setError('Cannot reach backend — showing demo data')
      setTodos([
        { _id: '1', title: 'Review pull request for auth module', tag: 'work', completed: false, createdAt: new Date().toISOString() },
        { _id: '2', title: 'Buy groceries — milk, eggs, bread', tag: 'personal', completed: false, createdAt: new Date().toISOString() },
        { _id: '3', title: 'Fix critical bug in payment flow', tag: 'urgent', completed: false, createdAt: new Date().toISOString() },
        { _id: '4', title: 'Morning run — 5km', tag: 'health', completed: true, createdAt: new Date().toISOString() },
        { _id: '5', title: 'Update project README documentation', tag: 'work', completed: true, createdAt: new Date().toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!input.trim()) return
    const optimistic = { _id: Date.now().toString(), title: input.trim(), tag, completed: false, createdAt: new Date().toISOString() }
    setTodos(prev => [optimistic, ...prev])
    setInput('')
    setError('')
    try {
      const { data } = await axios.post(API, { title: optimistic.title, tag })
      setTodos(prev => prev.map(t => t._id === optimistic._id ? data : t))
    } catch {
      setError('Failed to add task.')
    }
  }

  const toggleTodo = async (todo) => {
    setTodos(prev => prev.map(t => t._id === todo._id ? { ...t, completed: !t.completed } : t))
    try {
      await axios.patch(`${API}/${todo._id}`, { completed: !todo.completed })
    } catch {
      setTodos(prev => prev.map(t => t._id === todo._id ? { ...t, completed: todo.completed } : t))
    }
  }

  const deleteTodo = async (id) => {
    setTodos(prev => prev.filter(t => t._id !== id))
    try {
      await axios.delete(`${API}/${id}`)
    } catch {
      setError('Failed to delete task.')
    }
  }

  const filtered = todos.filter(t => {
    if (filter === 'pending') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const done = todos.filter(t => t.completed).length
  const pending = todos.filter(t => !t.completed).length

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="logo">task<span>o</span></h1>
          <p className="tagline">Your daily task manager</p>
        </div>
      </header>

      <main className="main">
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value accent">{todos.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pending}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Done</span>
            <span className="stat-value green">{done}</span>
          </div>
        </div>

        {error && <div className="error-bar">⚠ {error}</div>}

        <div className="add-task">
          <div className="add-row">
            <input
              className="add-input"
              type="text"
              placeholder="Add a new task…"
              value={input}
              maxLength={120}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
            />
            <select className="tag-select" value={tag} onChange={e => setTag(e.target.value)}>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button className="add-btn" onClick={addTodo} disabled={!input.trim()}>
              + Add
            </button>
          </div>
        </div>

        <div className="filter-row">
          {['all', 'pending', 'done'].map(f => (
            <button
              key={f}
              className={`filter-tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="task-list">
          {loading && [1, 2, 3].map(i => <div key={i} className="skeleton" />)}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <p>No tasks here</p>
            </div>
          )}

          {!loading && filtered.map(todo => (
            <div
              key={todo._id}
              className={`task-item${todo.completed ? ' completed' : ''}`}
              onClick={() => toggleTodo(todo)}
            >
              <div className={`task-checkbox${todo.completed ? ' checked' : ''}`}>
                {todo.completed && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              <div className="task-body">
                <p className="task-title">{todo.title}</p>
                <div className="task-meta">
                  <span className="task-date">{formatDate(todo.createdAt)}</span>
                  {todo.tag && (
                    <span className="task-tag" style={TAG_STYLES[todo.tag] || TAG_STYLES.personal}>
                      {todo.tag}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); deleteTodo(todo._id) }}
                aria-label="Delete"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}