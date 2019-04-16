const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();

function getGenres(req, res) {
  const getGenresQuery = `SELECT * FROM ${sqlTables.genre}`;
  dbConnection.query(getGenresQuery, function(error, result) {
    if (error) {
      res
        .type('json')
        .status(500)
        .json({ success: false });
      return;
    }

    res
      .type('json')
      .status(200)
      .json({ success: true, genres: result });
  });
}

module.exports = getGenres;