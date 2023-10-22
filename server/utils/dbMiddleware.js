const mysql = require('mysql2');

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'thrive_db',
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    connection.release();
  }
});

// Middleware to pass the database connection pool to routes
function attachDb(req, res, next) {
  req.db = pool;
  next();
}

module.exports = attachDb;
