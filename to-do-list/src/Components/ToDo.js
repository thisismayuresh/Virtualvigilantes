import React, { useState, useEffect } from 'react';
import './ToDo.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLocation } from 'react-router-dom';

function ToDo() {
  const location = useLocation();
  const token = location.state?.token || '';
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null); // State to store the task being edited
  const [newTask, setNewTask] = useState(''); // New task input
  const [authorizationSuccess, setAuthorizationSuccess] = useState(false); // New state for success message

  // Function to fetch tasks from server
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        setAuthorizationSuccess(true);
        setTimeout(() => setAuthorizationSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      if (taskToEdit !== null) {

        console.log("This is task to edit", taskToEdit)

        const task = tasks[taskToEdit];

        if (task) {


          try {
            fetch(`http://localhost:8000/todos/${taskToEdit}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
              body: JSON.stringify({ todo: newTask }),
            })
              .then((response) => {
                console.log("New Task updated from todo is " + newTask);
                if (response.ok) {
                  console.log(newTask)
                  setTaskToEdit(null);
                  setNewTask('');
                  fetchTasks();
                }
              })
              .catch((error) => {
                console.error('Error updating task:', error);
                console.log(newTask);
              });
          } catch (error) {
            console.error('Error updating task:', error);
            console.log(newTask);
          }
        } else {
          console.log("No task found at index", taskToEdit);
        }
      } else {
        // Adding a new task
        try {
          fetch('http://localhost:8000/todos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${token}`,
            },
            body: JSON.stringify({ todo: newTask }),
          })
            .then((response) => {
              if (response.ok) {
                setNewTask('');
                fetchTasks();
              }
            })
            .catch((error) => {
              console.error('Error adding task:', error);
            });
        } catch (error) {
          console.error('Error adding task:', error);
        }
      }
    }
  };


  const handleEditTask = (index) => {
    setTaskToEdit(index);
    setNewTask(tasks[index]);
  };

  const handleDeleteTask = (index) => {
    fetch(`http://localhost:8000/todos/${index}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          fetchTasks();
        }
      })
      .catch((error) => {
        console.log('Error deleting task:', error);
      });
  };




  return (
    <>
      <div className="todo-container">
        <h1>To Do</h1>
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-button" onClick={handleAddTask}>
          {taskToEdit !== null ? 'Save' : 'Add'}
        </button>
      </div>

      {tasks.map((task, index) => (
        <div className="todo-card" key={index}>
          {task}

          <div className="icon-container">
            <i className="bi bi-pencil"
              onClick={() => handleEditTask(index)}></i>

            <span className="icon-divider">|</span>

            <i className="bi bi-trash"
              onClick={() => handleDeleteTask(index)}></i>
          </div>
        </div>
      ))}
    </>
  );
}

export default ToDo;
