import { useState, useEffect } from "react";
import API from "./api";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Other");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filter, setFilter] = useState("all");

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
 

  

useEffect(() => {
  const fetchTasks = async () => {
  try {
    const response = await API.get("/");
    setTasks(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  fetchTasks();
}, []);

const addTask = async () => {
  if (!task.trim()) return;

  try {
    const response = await API.post("/", {
      text: task,
      completed: false,
      dueDate,
      priority,
      category,
    });

    setTasks([...tasks, response.data]);

    setTask("");
    setDueDate("");
    setPriority("Low");
    setCategory("Other");
    toast.success("Task added successfully!");
  } catch (error) {
    console.error(error);
  }
};


  const deleteTask = async (id) => {
  try {
    await API.delete(`/${id}`);

    setTasks(tasks.filter((task) => task._id !== id));
    toast.success("Task deleted!");
  } catch (error) {
    console.error(error);
  }

};

const toggleComplete = async (task) => {
  try {
    const response = await API.put(`/${task._id}`, {
      ...task,
      completed: !task.completed,
    });

    setTasks(
      tasks.map((t) =>
        t._id === task._id ? response.data : t
      )
    );
    toast.success(
  !task.completed
    ? "Task completed!"
    : "Task marked pending!"
);
  } catch (error) {
    console.error(error);
  }
};




 const saveEdit = async (index) => {
  try {
    const task = tasks[index];

    const updatedTask = {
      ...task,
      text: editText,
      dueDate: task.__edit?.dueDate ?? task.dueDate,
      priority: task.__edit?.priority ?? task.priority,
      category: task.__edit?.category ?? task.category,
    };
    delete updatedTask.__edit;

    const response = await API.put(
      `/${task._id}`,
      updatedTask
    );

    setTasks(
      tasks.map((t) =>
        t._id === task._id ? response.data : t
      )
    );

    setEditIndex(null);
    setEditText("");
    toast.success("Task updated!");
  } catch (error) {
    console.error(error);
  }
};

  // compute filtered / searched / sorted list
  const filteredTasks = tasks
    .filter((item) => {
      // status filter
      if (filter === "completed") return item.completed;
      if (filter === "pending") return !item.completed;
      return true;
    })
    .filter((item) => {
      // category filter
      if (categoryFilter && categoryFilter !== "All") return item.category === categoryFilter;
      return true;
    })
    .filter((item) => {
      // search
      if (!search.trim()) return true;
      return item.text.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'due') {
        const da = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
        const db = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
        return da - db;
      }
      if (sort === 'priority') {
        const order = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
      }
      return 0;
    });

  const total = tasks.length;
  const completed = tasks.filter(t=>t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed/total)*100);

  const clearCompleted = () => {
    if (!confirm('Clear all completed tasks?')) return;
    setTasks(tasks.filter(t=>!t.completed));
  }

  const handleStartEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text || '');
  }

  const updateEditField = (index, field, value) => {
    const updatedTasks = [...tasks];
    if (!updatedTasks[index].__edit) updatedTasks[index].__edit = {};
    updatedTasks[index].__edit[field] = value;
    setTasks(updatedTasks);
  }

  
    return (
  <>
    <Toaster position="top-right" />
    <div className="container">
      <div className="heading">
        <h1>Task Manager 🚀</h1>
        <p>Organize your day efficiently</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{total}</h3>
          <p>Total</p>
        </div>

        <div className="stat-card">
          <h3>{completed}</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h3>{total - completed}</h3>
          <p>Pending</p>
        </div>

        <div className="progress-card">
          <div className="progress-text">{completed}/{total} completed</div>
          <div className="progress-bar"><div className="progress-fill" style={{width: percent + '%'}}/></div>
        </div>
      </div>

      <div className="controls">
        <input className="search" placeholder="Search tasks..." value={search} onChange={e=>setSearch(e.target.value)} />

        <select className="sort" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="due">Due Date</option>
          <option value="priority">Priority</option>
        </select>

        <select className="category-filter" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Study">Study</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>

        <button className="clear-completed" onClick={clearCompleted}>Clear Completed</button>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${
            filter === "all" ? "active" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`filter-btn ${
            filter === "completed"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("completed")
          }
        >
          Completed
        </button>

        <button
          className={`filter-btn ${
            filter === "pending"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("pending")
          }
        >
          Pending
        </button>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <input type="date" value={dueDate} onChange={(e)=> setDueDate(e.target.value)} />

        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option value="High">High 🔴</option>
          <option value="Medium">Medium 🟡</option>
          <option value="Low">Low 🟢</option>
        </select>

        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="Study">Study</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>

        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">

  {loading && (
    <h3>Loading tasks...</h3>
  )}

  {!loading && filteredTasks.length === 0 && (
    <h3>No tasks found. Add your first task 🚀</h3>
  )}
        {filteredTasks.map((item, index) => (
          <div className="task-item" key={index}>
            <div className="task-main">
              {editIndex === index ? (
                <div className="edit-row">
                  <input type="text" value={editText} onChange={e=>setEditText(e.target.value)} />
                  <input type="date" defaultValue={item.dueDate || ''} onChange={e=> updateEditField(index,'dueDate', e.target.value)} />
                  <select defaultValue={item.priority || 'Low'} onChange={e=> updateEditField(index,'priority', e.target.value)}>
                    <option value="High">High 🔴</option>
                    <option value="Medium">Medium 🟡</option>
                    <option value="Low">Low 🟢</option>
                  </select>
                  <select defaultValue={item.category || 'Other'} onChange={e=> updateEditField(index,'category', e.target.value)}>
                    <option value="Study">Study</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className="task-title" style={{textDecoration: item.completed ? 'line-through':'none', color: item.completed ? '#94a3b8':'white'}}>{item.text}</div>

                  <div className="meta">
                    <div className={`badge priority ${item.priority ? item.priority.toLowerCase() : 'low'}`}>{item.priority || 'Low'}</div>
                    <div className="badge category">{item.category || 'Other'}</div>
                    {item.dueDate && <div className={`due ${getDueStatusClass(item.dueDate)}`}>{getDueStatusText(item.dueDate)}</div>}
                  </div>
                </>
              )}
            </div>

            <div className="task-actions">
              {editIndex === index ? (
                <button className="complete-btn" onClick={()=> saveEdit(index)}>Save</button>
              ) : (
                <button className="filter-btn" onClick={()=> handleStartEdit(index)}>Edit</button>
              )}

              <button className="complete-btn" onClick={() => toggleComplete(item)}>
  {item.completed ? "Undo" : "Complete"}
</button>

<button className="delete-btn" onClick={() => deleteTask(item._id)}>
  Delete
</button>
            </div>
          </div>
        ))}
      </div>
  </div>
</>
);
}

export default App;

// helpers
function getDueStatusText(dueDate){
  if(!dueDate) return '';
  const now = new Date();
  const d = new Date(dueDate);
  const diff = Math.floor((d.setHours(0,0,0) - new Date(now.setHours(0,0,0))) / (1000*60*60*24));
  if (diff < 0) return '❌ Overdue';
  if (diff === 0) return '⚠ Due Today';
  return `📅 Due in ${diff} day${diff>1?'s':''}`;
}

function getDueStatusClass(dueDate){
  if(!dueDate) return '';
  const now = new Date();
  const d = new Date(dueDate);
  const diff = Math.floor((d.setHours(0,0,0) - new Date(now.setHours(0,0,0))) / (1000*60*60*24));
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  return 'upcoming';
}