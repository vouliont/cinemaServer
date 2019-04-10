const getTimeOfTokenLife = require('../SqlConfig').getTimeOfTokenLife;
const dbConnection = require('../index');

function updateUserToken(userEmail) {
  const endTime = Math.floor(Date.now() / 1000) + getTimeOfTokenLife();
  const updateUserTokenQuery = `UPDATE user_token SET endTime = ${endTime} WHERE  email = "${userEmail}"`;
  dbConnection.query(updateUserTokenQuery, function() {});
};

function removeUserToken(userEmail) {
  const removeUserTokenQuery = `DELETE FROM user_token WHERE email = "${userEmail}"`;
  dbConnection.query(removeUserTokenQuery, function() {});
}

function checkIsUserEntered(userToken, res, completionHandler) {
  const getUserWithTokenQuery = `SELECT email, endTime FROM user_token WHERE token = "${userToken}"`;
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