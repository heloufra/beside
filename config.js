require('dotenv').config({path: __dirname + '/.env'});

module.exports = {
  sessionSecret: process.env.SESSION_SECRET,
  serverPort: 3000,
  privateKey:process.env.PRIVATE_KEY,
  db: {
    host: process.env.DATABASE_TEST_HOST,
    port: process.env.DATABASE_HOST_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
};
