import { useState, useEffect } from 'react'
import axios from 'axios'

// use VITE_API_URL from environment (set during build/deploy) or fall back to localhost
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos'  // e.g. "https://todo-api.example.com/api/todos"

const priorityColors = {
  low: 'var(--low)',
  medium: 'var(--medium)',
  high: 'var(--high)',
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API)
      setTodos(res.data)
    } catch (err) {
      console.error('Failed to fetch todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    try {
      const res = await axios.post(API, { title: title.trim(), priority })
      setTodos([res.data, ...todos])
      setTitle('')
      setPriority('medium')
    } catch (err) {
      console.error('Failed to add todo:', err)
    } finally {
      setAdding(false)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const res = await axios.patch(`${API}/${todo._id}`, {
        completed: !todo.completed,
      })
      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)))
    } catch (err) {
      console.error('Failed to toggle todo:', err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      setTodos(todos.filter((t) => t._id !== id))
    } catch (err) {
      console.error('Failed to delete todo:', err)
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditingTitle(todo.title)
  }

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return
    try {
      const res = await axios.patch(`${API}/${id}`, { title: editingTitle.trim() })
      setTodos(todos.map((t) => (t._id === id ? res.data : t)))
      setEditingId(null)
      setEditingTitle('')
    } catch (err) {
      console.error('Failed to edit todo:', err)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.logo}>Tasko</h1>
          <p style={styles.tagline}>A quiet place to get things done.</p>
        </header>

        {/* Progress */}
        {totalCount > 0 && (
          <div style={styles.progressWrapper}>
            <div style={styles.progressInfo}>
              <span style={styles.progressText}>{completedCount} of {totalCount} completed</span>
              <span style={styles.progressPercent}>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Add Todo Form */}
        <form onSubmit={addTodo} style={styles.form}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <div style={styles.formBottom}>
            <div style={styles.priorityGroup}>
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  style={{
                    ...styles.priorityBtn,
                    backgroundColor: priority === p ? priorityColors[p] : 'transparent',
                    color: priority === p ? '#fff' : priorityColors[p],
                    borderColor: priorityColors[p],
                  }}
                >
                  {priorityLabels[p]}
                </button>
              ))}
            </div>
            <button type="submit" style={styles.addBtn} disabled={adding}>
              {adding ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>

        {/* Filter Tabs */}
        <div style={styles.filters}>
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: filter === f ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div style={styles.list}>
          {loading ? (
            <p style={styles.emptyText}>Loading...</p>
          ) : filteredTodos.length === 0 ? (
            <p style={styles.emptyText}>
              {filter === 'completed' ? 'No completed tasks yet.' : 'No tasks here. Add one above.'}
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo._id} style={{
                ...styles.todoItem,
                opacity: todo.completed ? 0.6 : 1,
              }}>
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo)}
                  style={{
                    ...styles.checkbox,
                    backgroundColor: todo.completed ? 'var(--accent)' : 'transparent',
                    borderColor: todo.completed ? 'var(--accent)' : 'var(--border)',
                  }}
                >
                  {todo.completed && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div style={styles.todoContent}>
                  {editingId === todo._id ? (
                    <div style={styles.editRow}>
                      <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(todo._id)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        style={styles.editInput}
                        autoFocus
                      />
                      <button onClick={() => saveEdit(todo._id)} style={styles.saveBtn}>Save</button>
                      <button onClick={cancelEdit} style={styles.cancelBtn}>Cancel</button>
                    </div>
                  ) : (
                    <div style={styles.todoRow}>
                      <span style={{
                        ...styles.todoTitle,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'var(--completed)' : 'var(--text-primary)',
                      }}>
                        {todo.title}
                      </span>
                      <span style={{
                        ...styles.priorityTag,
                        color: priorityColors[todo.priority],
                        backgroundColor: todo.priority === 'high'
                          ? 'var(--accent-light)'
                          : todo.priority === 'medium'
                          ? '#fef9ec'
                          : '#edf5ed',
                      }}>
                        {priorityLabels[todo.priority]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {editingId !== todo._id && (
                  <div style={styles.actions}>
                    <button onClick={() => startEditing(todo)} style={styles.iconBtn} title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteTodo(todo._id)} style={{ ...styles.iconBtn, color: 'var(--accent)' }} title="Delete">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {totalCount > 0 && (
          <footer style={styles.footer}>
            <span style={styles.footerText}>{totalCount - completedCount} task{totalCount - completedCount !== 1 ? 's' : ''} remaining</span>
          </footer>
        )}

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '60px 20px',
  },
  container: {
    width: '100%',
    maxWidth: '620px',
  },
  header: {
    marginBottom: '40px',
  },
  logo: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '2.8rem',
    fontWeight: '400',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    lineHeight: 1,
    marginBottom: '6px',
  },
  tagline: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    fontWeight: '300',
    fontStyle: 'italic',
  },
  progressWrapper: {
    marginBottom: '28px',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  progressText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: '400',
  },
  progressPercent: {
    fontSize: '0.8rem',
    color: 'var(--accent)',
    fontWeight: '500',
  },
  progressBar: {
    height: '3px',
    backgroundColor: 'var(--border)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--accent)',
    borderRadius: '999px',
    transition: 'width 0.4s ease',
  },
  form: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    padding: '8px 0',
    fontSize: '0.98rem',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    outline: 'none',
    marginBottom: '16px',
    fontWeight: '400',
  },
  formBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  priorityGroup: {
    display: 'flex',
    gap: '8px',
  },
  priorityBtn: {
    padding: '5px 12px',
    borderRadius: '999px',
    border: '1px solid',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'var(--transition)',
    letterSpacing: '0.3px',
  },
  addBtn: {
    backgroundColor: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '8px 20px',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  filters: {
    display: 'flex',
    gap: '4px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border)',
  },
  filterBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    fontSize: '0.875rem',
    fontWeight: '400',
    transition: 'var(--transition)',
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emptyText: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    padding: '40px 0',
    fontStyle: 'italic',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition)',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'var(--transition)',
  },
  todoContent: {
    flex: 1,
    minWidth: 0,
  },
  todoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  todoTitle: {
    fontSize: '0.95rem',
    fontWeight: '400',
    lineHeight: 1.4,
    transition: 'var(--transition)',
  },
  priorityTag: {
    fontSize: '0.7rem',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '999px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  editRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    border: 'none',
    borderBottom: '1px solid var(--accent)',
    outline: 'none',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    padding: '2px 0',
  },
  saveBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.78rem',
    fontWeight: '500',
  },
  cancelBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.78rem',
  },
  actions: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
  },
  footer: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border)',
    textAlign: 'right',
  },
  footerText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
}

export default App