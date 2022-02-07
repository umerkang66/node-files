const mysql = require('mysql2');

// We can run multiple queries simultaneously, because it manages multiple connections
const pool = mysql.createPool();
