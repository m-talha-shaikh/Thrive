const mysql = require('mysql2'); // Use mysql2 instead of mysql
// Create the MySQL connection pool
var db= mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hamza504',
  database: 'thrive_db'
});

// Middleware to pass the database connection pool to routes
function attachDb(req, res, next) {
  req.db = db;
  next();
}

module.exports = attachDb;
