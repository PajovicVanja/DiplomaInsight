const mysql = require('mysql');
require('dotenv').config();


// const connection = mysql.createConnection({
//     host     : 'localhost',   // The hostname of the database you are connecting to.
//     user     : 'root',        // The MySQL user to authenticate as.
//     password : '123',    // The password of that MySQL user.
//     database : 'praktikum'  // Name of the database to use for this connection.
//   });
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
});

connection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the database.');
});

module.exports = connection;