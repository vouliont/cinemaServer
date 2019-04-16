const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();
const checkIsUserEntered = require('./ExtraHandlers').checkIsUserEntered;

function getFilm(req, res) {
  const userToken = req.header('X-Session-Token');
  const userFilmId = req.query.filmId;

  checkIsUserEntered(userToken, res, function(userEmail) {
    const getFilmQuery = `SELECT name, description, duration, director FROM ${sqlTables.film} WHERE ${sqlTables.film}.id = ${userFilmId}`;
    dbConnection.query(getFilmQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false });
        return;
      }

      let film = result[0]

      const getGenresQuery = `SELECT ${sqlTables.genre}.name
      FROM ${sqlTables.filmGenre} LEFT JOIN ${sqlTables.genre}
      ON ${sqlTables.filmGenre}.genreId = ${sqlTables.genre}.id
      WHERE ${sqlTables.filmGenre}.filmId = ${userFilmId}`;
      dbConnection.query(getGenresQuery, function(error, result) {
        if (error) {
          res
            .type('json')
            .status(500)
            .json({ success: false });
          return;
        }

        film['genres'] = result.map(function(item) {
          return item['name'];
        });

        res
          .type('json')
          .status(200)
          .json({ success: true, film: film });
      })
    });
  });
}

module.exports = getFilm;