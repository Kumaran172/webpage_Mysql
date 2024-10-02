const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test', // your MySQL password
    database: 'user_registration'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Ensure index.html is in the same directory as app.js
});

// Register user
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        // Insert user data into MySQL
        const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(query, [username, email, hash], (err, result) => {
            if (err) throw err;

            res.send('Registration successful!');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
