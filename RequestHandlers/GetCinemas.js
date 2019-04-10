const dbConnection = require('../index');
const checkIsUserEntered = require('./ExtraHandlers').checkIsUserEntered;

function getCinemas(req, res) {
  const userToken = req.header('X-Session-Token');
  const userCity = req.query.city || '';
  const userFormats = req.query.formats || [];

  // todo check is data valid (only city and formats)

  userFormats.forEach(function(item, index, array) {
    array[index] = `"${item}"`;
  });
  const userFormatsString = userFormats.join(', ');

  checkIsUserEntered(userToken, res, function(userEmail) {
    const getCinemasQuery = `SELECT DISTINCT id, name, address
    FROM cinemas
    LEFT JOIN cinema_formats ON cinemas.id = cinema_formats.cinemaId
    WHERE cinemas.city = "${userCity}"${(userFormats.length != 0) ? ` AND cinema_formats.format in (${userFormatsString})` : ''}`;

    dbConnection.query(getCinemasQuery, function(error, result) {
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
        .json({ success: true, cinemas: result });
    });
  });
}

module.exports = getCinemas;