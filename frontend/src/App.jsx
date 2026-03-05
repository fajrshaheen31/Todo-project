import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api/todos'

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #f5f0e8;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
  }

  .app {
    max-width: 620px;
    margin: 0 auto;
    padding: 60px 24px 80px;
  }

  .header {
    margin-bottom: 48px;
  }

  .header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 52px;
    color: #1a1a1a;
    line-height: 1;
    letter-spacing: -1px;
  }

  .header h1 span {
    color: #c0392b;
    font-style: italic;
  }

  .header p {
    margin-top: 10px;
    font-size: 14px;
    color: #888;
    font-weight: 300;
  }

  .input-row {
    display: flex;
    gap: 10px;
    margin-bottom: 36px;
  }

  .input-row input {
    flex: 1;
    padding: 14px 18px;
    border: 2px solid #1a1a1a;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    border-radius: 0;
    transition: border-color 0.2s;
  }

  .input-row input:focus {
    border-color: #c0392b;
  }

  .input-row input::placeholder {
    color: #bbb;
  }

  .btn-add {
    padding: 14px 24px;
    background: #1a1a1a;
    color: #f5f0e8;
    border: 2px solid #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.2s, color 0.2s;
  }

  .btn-add:hover {
    background: #c0392b;
    border-color: #c0392b;
  }

  .btn-add:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .section-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 14px;
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    background: #fff;
    border-left: 3px solid transparent;
    transition: border-color 0.2s, opacity 0.2s;
    animation: fadeIn 0.25s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .todo-item.done {
    border-left-color: #c0392b;
    opacity: 0.6;
  }

  .todo-item:hover {
    border-left-color: #1a1a1a;
  }

  .todo-item.done:hover {
    border-left-color: #c0392b;
  }

  .checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.2s, background 0.2s;
  }

  .checkbox.checked {
    background: #c0392b;
    border-color: #c0392b;
  }

  .checkbox svg {
    display: none;
  }

  .checkbox.checked svg {
    display: block;
  }

  .todo-title {
    flex: 1;
    font-size: 15px;
    color: #1a1a1a;
    line-height: 1.4;
  }

  .todo-item.done .todo-title {
    text-decoration: line-through;
    color: #999;
  }

  .btn-delete {
    background: none;
    border: none;
    color: #ccc;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 2px 4px;
    transition: color 0.2s;
    opacity: 0;
  }

  .todo-item:hover .btn-delete {
    opacity: 1;
  }

  .btn-delete:hover {
    color: #c0392b;
  }

  .empty {
    text-align: center;
    padding: 48px 0;
    color: #bbb;
    font-size: 14px;
    font-style: italic;
  }

  .error {
    background: #fdecea;
    border-left: 3px solid #c0392b;
    padding: 12px 16px;
    font-size: 13px;
    color: #c0392b;
    margin-bottom: 20px;
  }

  .stats {
    margin-top: 32px;
    font-size: 12px;
    color: #bbb;
    letter-spacing: 0.5px;
  }
`

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(API)
      setTodos(data)
    } catch {
      setError('Could not connect to backend. Is the server running?')
    }
  }

  const addTodo = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(API, { title: input.trim() })
      setTodos(prev => [data, ...prev])
      setInput('')
    } catch {
      setError('Failed to add todo.')
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const { data } = await axios.patch(`${API}/${todo._id}`, {
        completed: !todo.completed,
      })
      setTodos(prev => prev.map(t => t._id === data._id ? data : t))
    } catch {
      setError('Failed to update todo.')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      setTodos(prev => prev.filter(t => t._id !== id))
    } catch {
      setError('Failed to delete todo.')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  const done = todos.filter(t => t.completed).length

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <h1>Tasko<span>.</span></h1>
          <p>Stay on top of things.</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="input-row">
          <input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="btn-add" onClick={addTodo} disabled={loading || !input.trim()}>
            {loading ? '...' : '+ Add'}
          </button>
        </div>

        <div className="section-label">Tasks — {todos.length}</div>

        <div className="todo-list">
          {todos.length === 0 && (
            <div className="empty">No tasks yet. Add one above.</div>
          )}
          {todos.map(todo => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
              <div
                className={`checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo)}
              >
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="todo-title">{todo.title}</span>
              <button className="btn-delete" onClick={() => deleteTodo(todo._id)}>×</button>
            </div>
          ))}
        </div>

        {todos.length > 0 && (
          <div className="stats">{done} of {todos.length} completed</div>
        )}
      </div>
    </>
  )
}