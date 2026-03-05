import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api/todos'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    min-height: 100vh;
    font-family: 'Syne', sans-serif;
    color: #e8e8e0;
  }

  .app {
    max-width: 580px;
    margin: 0 auto;
    padding: 72px 28px 100px;
  }

  .header { margin-bottom: 56px; }

  .header-top {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 8px;
  }

  .header h1 {
    font-size: 48px;
    font-weight: 800;
    color: #e8e8e0;
    letter-spacing: -2px;
    line-height: 1;
  }

  .header-dot {
    width: 10px;
    height: 10px;
    background: #39ff8a;
    border-radius: 50%;
    flex-shrink: 0;
    margin-bottom: 4px;
    box-shadow: 0 0 12px #39ff8a88;
  }

  .header p {
    font-family: 'Syne Mono', monospace;
    font-size: 11px;
    color: #444;
    letter-spacing: 1px;
  }

  .input-wrap {
    position: relative;
    margin-bottom: 48px;
  }

  .input-wrap input {
    width: 100%;
    padding: 16px 60px 16px 20px;
    background: #141414;
    border: 1px solid #222;
    color: #e8e8e0;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    outline: none;
    border-radius: 4px;
    transition: border-color 0.2s;
  }

  .input-wrap input::placeholder { color: #333; }

  .input-wrap input:focus {
    border-color: #39ff8a44;
    background: #111;
  }

  .btn-add {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: #39ff8a;
    border: none;
    border-radius: 3px;
    color: #0a0a0a;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.15s;
    line-height: 1;
  }

  .btn-add:hover { background: #5fffaa; transform: translateY(-50%) scale(1.08); }
  .btn-add:disabled { background: #1e1e1e; color: #333; cursor: not-allowed; transform: translateY(-50%); }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .list-label {
    font-family: 'Syne Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: #333;
    text-transform: uppercase;
  }

  .progress-text {
    font-family: 'Syne Mono', monospace;
    font-size: 10px;
    color: #39ff8a;
    letter-spacing: 1px;
  }

  .progress-bar-bg {
    height: 1px;
    background: #1e1e1e;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: #39ff8a;
    transition: width 0.4s ease;
    box-shadow: 0 0 8px #39ff8a66;
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 15px 16px;
    background: #111;
    border-radius: 3px;
    transition: background 0.15s;
    animation: slideIn 0.2s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .todo-item:hover { background: #161616; }
  .todo-item.done { opacity: 0.4; }

  .checkbox {
    width: 18px;
    height: 18px;
    border: 1px solid #333;
    border-radius: 2px;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background 0.2s;
  }

  .checkbox:hover { border-color: #39ff8a; }

  .checkbox.checked {
    background: #39ff8a;
    border-color: #39ff8a;
  }

  .check-icon { display: none; }
  .checkbox.checked .check-icon { display: block; }

  .todo-title {
    flex: 1;
    font-size: 14px;
    color: #c8c8c0;
    font-weight: 400;
    line-height: 1.4;
  }

  .todo-item.done .todo-title {
    text-decoration: line-through;
    color: #333;
  }

  .todo-num {
    font-family: 'Syne Mono', monospace;
    font-size: 10px;
    color: #2a2a2a;
    flex-shrink: 0;
    width: 20px;
    text-align: right;
  }

  .btn-del {
    background: none;
    border: none;
    color: #2a2a2a;
    cursor: pointer;
    font-size: 16px;
    padding: 2px 4px;
    transition: color 0.15s;
    opacity: 0;
    flex-shrink: 0;
    line-height: 1;
  }

  .todo-item:hover .btn-del { opacity: 1; }
  .btn-del:hover { color: #ff4757; }

  .empty {
    text-align: center;
    padding: 56px 0;
    color: #222;
    font-family: 'Syne Mono', monospace;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .error {
    margin-bottom: 24px;
    padding: 12px 16px;
    background: #1a0a0a;
    border: 1px solid #ff475722;
    border-left: 2px solid #ff4757;
    font-size: 12px;
    color: #ff4757;
    font-family: 'Syne Mono', monospace;
    border-radius: 3px;
  }
`

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchTodos() }, [])

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(API)
      setTodos(data)
    } catch {
      setError('Cannot reach backend — is the server running?')
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
      setError('Failed to add task.')
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const { data } = await axios.patch(`${API}/${todo._id}`, { completed: !todo.completed })
      setTodos(prev => prev.map(t => t._id === data._id ? data : t))
    } catch {
      setError('Failed to update task.')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      setTodos(prev => prev.filter(t => t._id !== id))
    } catch {
      setError('Failed to delete task.')
    }
  }

  const done = todos.filter(t => t.completed).length
  const pct = todos.length ? Math.round((done / todos.length) * 100) : 0

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-top">
            <h1>TASKO</h1>
            <div className="header-dot" />
          </div>
          <p>// your tasks, nothing else</p>
        </div>

        {error && <div className="error">⚠ {error}</div>}

        <div className="input-wrap">
          <input
            type="text"
            placeholder="new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button className="btn-add" onClick={addTodo} disabled={loading || !input.trim()}>
            +
          </button>
        </div>

        <div className="list-header">
          <span className="list-label">tasks — {todos.length}</span>
          {todos.length > 0 && <span className="progress-text">{pct}% done</span>}
        </div>

        {todos.length > 0 && (
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        )}

        <div className="todo-list">
          {todos.length === 0 && <div className="empty">— no tasks yet —</div>}
          {todos.map((todo, i) => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
              <span className="todo-num">{String(i + 1).padStart(2, '0')}</span>
              <div
                className={`checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo)}
              >
                <svg className="check-icon" width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 3.5L3.5 6L9 1" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="todo-title">{todo.title}</span>
              <button className="btn-del" onClick={() => deleteTodo(todo._id)}>×</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}