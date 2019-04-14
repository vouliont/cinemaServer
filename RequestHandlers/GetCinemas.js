const dbConnection = require('../index').dbConnection;
const checkIsUserEntered = require('./ExtraHandlers').checkIsUserEntered;
const sqlTables = require('../SqlConfig').getTables();

function getCinemas(req, res) {
  const userToken = req.header('X-Session-Token');
  const userCityId = req.query.cityId;
  const userFormats = req.query.formats || [];

  // todo check is data valid (only city and formats)

  const userFormatsString = userFormats.join(', ');

  checkIsUserEntered(userToken, res, function(userEmail) {
    const getCinemasQuery = `SELECT DISTINCT id, name, address
    FROM ${sqlTables.cinema}
    LEFT JOIN ${sqlTables.cinemaFormat} ON ${sqlTables.cinema}.id = ${sqlTables.cinemaFormat}.cinemaId
    WHERE ${sqlTables.cinema}.cityId = ${userCityId}${(userFormats.length != 0) ? ` AND ${sqlTables.cinemaFormat}.formatId IN (${userFormatsString})` : ''}`;

    dbConnection.query(getCinemasQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false });
        return;
      }

      if (result.length == 0) {
        res
          .type('json')
          .status(200)
          .json({ success: true, cinemas: [] });
        return;
      }

      const cinemas = {};
      result.forEach(function(item) {
        const id = item['id'];
        const name = item['name'];
        const address = item['address'];

        cinemas[id] = {
          'name': name,
          'address': address,
          'formats': []
        };
      });
      const cinemaIdsString = Object.keys(cinemas).join(', ');

      const getFormatsQuery = `SELECT ${sqlTables.cinemaFormat}.cinemaId, ${sqlTables.cinemaFormat}.formatId, ${sqlTables.format}.name FROM ${sqlTables.cinemaFormat} LEFT JOIN ${sqlTables.format} ON ${sqlTables.cinemaFormat}.formatId = ${sqlTables.format}.id WHERE ${sqlTables.cinemaFormat}.cinemaId IN (${cinemaIdsString})`;
      dbConnection.query(getFormatsQuery, function(error, result) {
        if (error) {
          res
            .type('json')
            .status(500)
            .json({ success: false });
          return;
        }

        result.forEach(function(item) {
          const cinemaId = item['cinemaId'];
          const formatId = item['formatId'];
          const formatName = item['name'];

          cinemas[cinemaId]['formats'].push({
            'id': formatId,
            'name': formatName
          });
        });

        res
          .type('json')
          .status(200)
          .json({ success: true, cinemas: cinemas });
      });
    });
  });
}

module.exports = getCinemas;