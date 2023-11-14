const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');

app.use(cors());

const crypto = require('crypto');
const JWT_SECRET = crypto.randomBytes(32).toString('hex');
const User = require('./user');

mongoose.connect('mongodb://127.0.0.1:27017/todolist', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.post('/register', body('username').notEmpty(), body('password').notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // If the username doesn't exist, create a new user
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/todos', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    console.log('No token provided'); 
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err); // Add debugging log
      return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findOne({ _id: decoded.userId })
      .then((user) => {
        if (!user) {
          console.log('User not found:', decoded.username); // Add debugging log
          return res.status(404).json({ message: 'User not found' });
        }

        console.log('Token verification successful:', decoded.username); // Add debugging log
        res.status(200).json(user.todos);
      })
      .catch((err) => {
        console.log('Database error:', err); // Add debugging log
        res.status(500).json({ message: 'Server error' });
      });
  });
});

app.post('/todos', (req, res) => {
  const token = req.header('Authorization');
  const todo = req.body.todo;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized USer' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findOne({ _id: decoded.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        user.todos.push(todo);
        user.save();

        res.status(201).json({ message: 'Todo added successfully' });
      })
      .catch(() => res.status(500).json({ message: 'Server error' }));
  });
});


app.delete('/todos/:id', (req, res) => {
  const token = req.header('Authorization');
  const taskId = req.params.id;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized User' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findOne({ _id: decoded.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

     
        if (taskId !== -1) {
          const deletedTask = user.todos[taskId];
          user.todos.splice(taskId, 1);
          user.save();
          console.log('Task deleted:', deletedTask); // Log the deleted task
          return res.status(200).json({ message: 'Task deleted successfully' });
        } else {
          return res.status(404).json({ message: 'Task not found' });
        }
      })
      .catch((err) => {
        console.log('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      });
  });
});


app.put('/todos/:id', async (req, res) => {
  console.log("Request is -----",req.body.todo);
  const taskId = req.params.id;
  const updatedTask = req.body.todo;
  
  
  try {
    jwt.verify(req.header('Authorization'), JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Unauthorized' });
      }

      
      const user = await User.findById(decoded.userId);
      console.log(user);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

    


/*
      // Find the task within the user's todos array and update it
      const taskIndex = user.todos.findIndex((task) => task._id === taskId);
      console.log("taskindex is ",taskIndex)
     

      if (taskIndex === -1) {
        console.log("Task Not Found")
        return res.status(404).json({ message: 'Task not found' });
      }
*/
      user.todos[taskId] = updatedTask; 

     console.log(user.todos[taskId])
     
      await user.save();

      res.status(200).json({ message: 'Task updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

  
});






app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
