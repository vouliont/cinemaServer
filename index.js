const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const getSqlConfig = require('./SqlConfig').getSqlConfig;
const urls = require('./Helpers/Urls').getUrls();

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
exports.dbConnection = dbConnection;

const AllRequestHandlers = require('./RequestHandlers/AllRequestHandlers');

// app
const app = express();
app.use(bodyParser.json())
app.listen(80, function() {
  console.log('Server has started');
});

app.post(urls.signup, AllRequestHandlers.signUpHandler);
app.post(urls.signin, AllRequestHandlers.signInHandler);
app.get(urls.getuserdata, AllRequestHandlers.getUserDataHandler);

app.get(urls.cities, AllRequestHandlers.getCities);
app.get(urls.cinemas, AllRequestHandlers.getCinemas);
app.get(urls.formats, AllRequestHandlers.getFormats);
app.get(urls.films, AllRequestHandlers.getFilms);
app.get(urls.genres, AllRequestHandlers.getGenres);
app.get(urls.film, AllRequestHandlers.getFilm);
app.get(urls.sessions, AllRequestHandlers.getSessions);