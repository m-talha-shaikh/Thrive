const mysql = require('mysql2');


const database_host = process.env.DATABASE_HOST || 'localhost'
const database_port = process.env.DATABASE_PORT || '3306'
const database_user = process.env.DATABASE_USER || 'root'
const database_password = process.env.DATABASE_PASSWORD || ''
const database_name = process.env.DATABASE_NAME || 'thrive_db'


const connection_string = process.env.DATABASE_SERVICE_URI

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: database_host,
  port: database_port,
  user: database_user,
  password: database_password,
  database: database_name,
  waitForConnections: true,
  connectionLimit: 5,
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
