const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();

function getCities(req, res) {
  const getCitiesQuery = `SELECT * FROM ${sqlTables.city}`;
  dbConnection.query(getCitiesQuery, function(error, result) {
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
      .json({ success: true, cities: result });
  });
}

module.exports = getCities;