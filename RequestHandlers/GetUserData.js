const updateUserToken = require('./ExtraHandlers').updateUserToken;
const checkIsUserEntered = require('./ExtraHandlers').checkIsUserEntered;
const dbConnection = require('../index');

function getUserDataHandler(req, res) {
  const userToken = req.header('X-Session-Token');

  checkIsUserEntered(userToken, res, function(userEmail) {
    const getUserDataQuery = `SELECT name, city, accessLevel FROM users WHERE email = "${userEmail}"`;
    dbConnection.query(getUserDataQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false });
        return;
      }

      const userName = result[0]['name'];
      const userCity = result[0]['city'];
      const userAccessLevel = result[0]['accessLevel'];

      res
        .type('json')
        .status(200)
        .json({ success: true, name: userName, city: userCity, accessLevel: userAccessLevel });
    });
  });

}

module.exports = getUserDataHandler;