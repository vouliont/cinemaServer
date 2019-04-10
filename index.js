const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const getSqlConfig = require('./SqlConfig').getSqlConfig;
const getUrls = require('./Helpers/Urls').getUrls;

// database
const dbConnection = mysql.createConnection(getSqlConfig());
dbConnection.connect(function(error) {
  if (error) {
    console.log('Connection to database has failed.');
    console.log(error);
    throw error;
  } else {
    console.log('Connection to database has successed.');
  }
});
module.exports = dbConnection;

const AllRequestHandlers = require('./RequestHandlers/AllRequestHandlers');

// app
const app = express();
app.use(bodyParser.json())
app.listen(80, function() {
  console.log('Server has started');
});

app.post(getUrls().signup, AllRequestHandlers.signUpHandler);
app.post(getUrls().signin, AllRequestHandlers.signInHandler);
app.get(getUrls().getuserdata, AllRequestHandlers.getUserDataHandler);

app.get(getUrls().cities, AllRequestHandlers.getCities);
app.get(getUrls().cinemas, AllRequestHandlers.getCinemas);