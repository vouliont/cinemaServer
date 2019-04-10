const dbConnection = require('../index');

function getCities(req, res) {
  const getCitiesQuery = `SELECT DISTINCT city FROM cinemas`;
  dbConnection.query(getCitiesQuery, function(error, result) {
    if (error) {
      res
        .type('json')
        .status(500)
        .json({ success: false });
      return;
    }

    let cities = [];
    for (let i = 0; i < result.length; i++) {
      cities.append(result[i]);
    }

    res
      .type('json')
      .status(200)
      .json({ success: true, cities: cities });
  });
}

module.exports = getCities;