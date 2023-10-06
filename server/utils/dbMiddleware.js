const mysql = require('mysql');

// Create the MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hamza504',
  database: 'THRIVE_DB'
});

// Middleware to pass the database connection pool to routes
function attachDb(req, res, next) {
  req.db = db;
  next();
}

module.exports = attachDb;
