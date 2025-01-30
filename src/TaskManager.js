import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ITEM_TYPE = "TASK";

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "📌 React lernen", priority: 2 },
    { id: 2, text: "📂 Drag & Drop hinzufügen", priority: 1 },
    { id: 3, text: "🚀 Projekt auf GitHub hochladen", priority: 3 },
    { id: 4, text: "🧑‍🎨 Balsamiq-Stil hinzufügen", priority: 1 },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState(1);

  const moveTask = (dragIndex, hoverIndex) => {
    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, draggedTask);
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: `📌 ${newTask}`, priority: newPriority }]);
      setNewTask("");
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const sortTasksByPriority = () => {
    setTasks([...tasks].sort((a, b) => b.priority - a.priority));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ maxWidth: "400px", padding: "20px", fontFamily: "Comic Sans MS, sans-serif", border: "2px solid black", borderRadius: "10px", backgroundColor: "#f8f8f8" }}>
          <h2 style={{ textAlign: "center", backgroundColor: "black", color: "white", padding: "5px", borderRadius: "5px" }}>📋 Task Manager</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="+ Neue Aufgabe..."
              style={{ flex: 1, padding: "5px", border: "1px solid black" }}
            />
            <select value={newPriority} onChange={(e) => setNewPriority(Number(e.target.value))}>
              <option value={1}>Prio: Low</option>
              <option value={2}>Prio: Medium</option>
              <option value={3}>Prio: High</option>
            </select>
            <button onClick={addTask} style={{ padding: "5px", backgroundColor: "black", color: "white", border: "none", cursor: "pointer" }}>➕</button>
          </div>
          <button onClick={sortTasksByPriority} style={{ marginBottom: "10px", padding: "5px", backgroundColor: "black", color: "white", border: "none", cursor: "pointer", width: "100%" }}>Sortieren nach Priorität</button>
          {tasks.map((task, index) => (
            <TaskItem key={task.id} index={index} task={task} moveTask={moveTask} removeTask={removeTask} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

const TaskItem = ({ task, index, moveTask, removeTask }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      style={{
        padding: "10px",
        marginBottom: "5px",
        backgroundColor: isDragging ? "#ffc107" : "white",
        border: isDragging ? "2px dashed black" : "2px solid black",
        cursor: "grab",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Comic Sans MS, sans-serif",
        opacity: isDragging ? 0.6 : 1,
        transform: isDragging ? "scale(1.05)" : "none",
        transition: "transform 0.3s ease, background-color 0.3s ease, opacity 0.3s ease",
      }}
    >
      <span style={{ cursor: "grab", marginRight: "10px" }}>⋮</span>
      {task.text} ({task.priority})
      <button onClick={() => removeTask(task.id)} style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>❌</button>
    </div>
  );
};

export default TaskManager;
