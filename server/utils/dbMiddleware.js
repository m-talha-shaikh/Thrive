const mysql = require('mysql');

// Create the MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'thrive_db'
});

// Middleware to pass the database connection pool to routes
function attachDb(req, res, next) {
  req.db = db;
  next();
}

module.exports = attachDb;
