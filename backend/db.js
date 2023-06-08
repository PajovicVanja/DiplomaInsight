const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
  console.log('Successfully connected to the database.');

  // Send a ping request to the database to keep the connection alive
  connection.ping((pingError) => {
    if (pingError) {
      console.error('Error pinging the database:', pingError);
      // Handle the error if needed
    } else {
      console.log('Database connection is alive.');
    }
  });

  // Schedule the ping to be called every 5 minutes
  setInterval(() => {
    connection.ping((pingError) => {
      if (pingError) {
        console.error('Error pinging the database:', pingError);
        // Handle the error if needed
      } else {
        console.log('Database connection is alive.');
      }
    });
  }, 100000); // 5 minutes interval (in milliseconds)
});

// Export the connection for other modules to use
module.exports = connection;
