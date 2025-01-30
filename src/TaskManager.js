import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ITEM_TYPE = "TASK";

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "React lernen" },
    { id: 2, text: "Drag &Drop hinzufügen" },
    { id: 3, text: "Projekt auf GitHub hochladen" },
  ]);
  const [newTask, setNewTask] = useState("");

  const moveTask = (dragIndex, hoverIndex) => {
    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, draggedTask);
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask }]);
      setNewTask("");
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <h2>Task Manager</h2>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Neue Aufgabe..."
          style={{ marginRight: "10px" }}
        />
        <button onClick={addTask}>Aufgabe Hinzufügen</button>
        {tasks.map((task, index) => (
          <TaskItem key={task.id} index={index} task={task} moveTask={moveTask} removeTask={removeTask} />
        ))}
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
        backgroundColor: isDragging ? "#ddd" : "#f8f8f8",
        border: "1px solid #ccc",
        cursor: "grab",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {task.text}
      <button onClick={() => removeTask(task.id)} style={{ marginLeft: "10px" }}>❌</button>
    </div>
  );
};

export default TaskManager;
