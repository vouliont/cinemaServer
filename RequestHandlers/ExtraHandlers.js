const getTimeOfTokenLife = require('../SqlConfig').getTimeOfTokenLife;
const dbConnection = require('../index').dbConnection;
const checkIsTokenValid = require('../Helpers/Validator').checkIsTokenValid;
const sqlTables = require('../SqlConfig').getTables();

function updateUserToken(userEmail) {
  const endTime = Math.floor(Date.now() / 1000) + getTimeOfTokenLife();
  const updateUserTokenQuery = `UPDATE ${sqlTables.userToken} SET endTime = ${endTime} WHERE  email = "${userEmail}"`;
  dbConnection.query(updateUserTokenQuery, function() {});
};

function removeUserToken(userEmail) {
  const removeUserTokenQuery = `DELETE FROM ${sqlTables.userToken} WHERE email = "${userEmail}"`;
  dbConnection.query(removeUserTokenQuery, function() {});
}

function checkIsUserEntered(userToken, res, completionHandler) {
  const isValid = checkIsTokenValid(userToken);
  if (!isValid) {
    res
      .type('json')
      .status(415)
      .json({ success: false });
    return;
  }

  const getUserWithTokenQuery = `SELECT email, endTime FROM ${sqlTables.userToken} WHERE token = "${userToken}"`;
  dbConnection.query(getUserWithTokenQuery, function(error, result) {
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
        .status(404)
        .json({ success: false });
      return;
    }

    const userEmail = result[0]['email']
    const endTime = result[0]['endTime'];
    const now = Math.floor(Date.now() / 1000);
    if (now > endTime) {
      removeUserToken(userEmail);
      res
        .type('json')
        .status(415)
        .json({ success: false });
      return;
    }

    updateUserToken(userEmail);
    completionHandler(userEmail);
  });
};

exports.updateUserToken = updateUserToken;
exports.checkIsUserEntered = checkIsUserEntered;