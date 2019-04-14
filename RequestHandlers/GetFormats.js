const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();

function getFormats(req, res) {
  const getFormatsQuery = `SELECT * FROM ${sqlTables.format}`;
  dbConnection.query(getFormatsQuery, function(error, result) {
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
      .json({ success: true, formats: result });
  });
}

module.exports = getFormats;