const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : 'root',
  password : 'root',
  database : 'praktikum'
});

connection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the database.');
});

module.exports = connection;