const express = require('express');
const cors = require('cors');
const path = require('path');
const data = require('./data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

// API Endpoints
app.get('/api/user', (req, res) => {
    res.json(data.user);
});

app.get('/api/courses', (req, res) => {
    res.json(data.courses);
});

app.get('/api/activities', (req, res) => {
    res.json(data.activities);
});

app.get('/api/bulletins', (req, res) => {
    res.json(data.bulletins);
});

app.get('/api/todos', (req, res) => {
    res.json(data.todos);
});

// Serve frontend for any other route (fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Frontend accessible at http://localhost:${PORT}/index.html`);
});
