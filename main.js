const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming request bodies (form data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the static folder for serving the HTML file and any other static assets
app.use(express.static(path.join(__dirname)));

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'taskmanager', // Make sure this matches your database name
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the taskmanager database');
});

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'finalllll.html')); // Ensure your HTML file is located here
});

app.post('/projects', (req, res) => {
    console.log(req.body); // Log the request body to check what is being received
    const { projectName, projectID, projectPrio } = req.body;

    const sql = 'INSERT INTO project (projectName, projectID, projectPrio) VALUES (?, ?, ?)';
    db.query(sql, [projectName, projectID, projectPrio], (err, result) => {
        if (err) {
            console.error('Error creating project:', err);
            return res.status(500).send('Error creating project');
        }
        
        console.log('New project created:', { projectName, projectID, projectPrio });
        res.redirect('/'); // Redirect back to the homepage or to a success page
    });
});

// Route to create a new task
app.post('/tasks', (req, res) => {
  const { taskName, taskStartDate, taskDueDate, taskPriority, projectID, taskDone, notes } = req.body;

  const sql = 'INSERT INTO tasks (taskName, taskStartDate, taskDueDate, taskPriority, projectID, taskDone, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [taskName, taskStartDate, taskDueDate, taskPriority, projectID, taskDone ? 1 : 0, notes], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).send('Error creating task');
    }

    console.log('New task created:', { taskName, taskStartDate, taskDueDate, taskPriority, projectID, taskDone, notes });
    res.redirect('/'); // Redirect back to the homepage or to a success page
  });
});

// Route to view all projects
app.get('/projects', (req, res) => {
    const sql = 'SELECT * FROM project';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results); // Send JSON response with projects
    });
});


// Route to view tasks for a specific project by projectID
app.get('/tasks', (req, res) => {
    const { projectID } = req.query; // Get projectID from query parameters

    const sql = 'SELECT * FROM tasks WHERE projectID = ?';
    db.query(sql, [projectID], (err, results) => {
        if (err) throw err;
        res.json(results); // Send JSON response with tasks
    });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
