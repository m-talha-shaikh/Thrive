const mysql = require('mysql');

// Create the MySQL connection pool
const db = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12649802',
  password: '8llcc6EsRD',
  database: 'sql12649802'
});

// Middleware to pass the database connection pool to routes
function attachDb(req, res, next) {
  req.db = db;
  next();
}

module.exports = attachDb;
