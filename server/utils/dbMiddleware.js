const mysql = require('mysql2');


// const database_host = process.env.DATABASE_HOST || 'localhost'
// const database_user = process.env.DATABASE_USER || 'root'
// const database_password = process.env.DATABASE_PASSWORD || ''
// const database_name = process.env.DATABASE_NAME || 'thrive_db'

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Hamza504',
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
function attachDB(req, res, next) {
  req.db = pool;
  next();
}

module.exports = attachDB;
