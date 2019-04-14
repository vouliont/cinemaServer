const updateUserToken = require('./ExtraHandlers').updateUserToken;
const checkIsUserEntered = require('./ExtraHandlers').checkIsUserEntered;
const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();

function getUserDataHandler(req, res) {
  const userToken = req.header('X-Session-Token');

  checkIsUserEntered(userToken, res, function(userEmail) {
    const getUserDataQuery = `SELECT name, cityId, accessLevel FROM ${sqlTables.user} WHERE email = "${userEmail}"`;
    dbConnection.query(getUserDataQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false });
        return;
      }

      const userName = result[0]['name'];
      const userCityId = result[0]['cityId'];
      const userAccessLevel = result[0]['accessLevel'];

      const getCityByCityIdQuery = `SELECT name FROM ${sqlTables.city} WHERE id = ${userCityId}`;
      dbConnection.query(getCityByCityIdQuery, function(error, result) {
        if (error) {
          res
            .type('json')
            .status(500)
            .json({ success: false });
          return;
        }

        const userCityName = result[0]['name'];
        res
          .type('json')
          .status(200)
          .json({
            success: true,
            name: userName,
            cityId: userCityId,
            cityName: userCityName,
            accessLevel: userAccessLevel
          });
      });
    });
  });

}

module.exports = getUserDataHandler;