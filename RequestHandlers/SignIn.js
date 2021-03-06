const checkIsSignInDataValid = require('../Helpers/Validator').checkIsSignInDataValid;
const secretKey = require('../SqlConfig').getSecretKey();
const getTimeOfTokenLife = require('../SqlConfig').getTimeOfTokenLife;
const crypto = require('crypto');
const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();

function signInHandler(req, res) {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const isDataValid = checkIsSignInDataValid(userEmail, userPassword);
  if (!isDataValid.isValid) {
    res
      .type('json')
      .status(415)
      .json({ success: false, message: isDataValid.message });
    return;
  }

  const findUserWithEmailQuery = `SELECT password FROM ${sqlTables.user} WHERE email = "${userEmail}"`;
  dbConnection.query(findUserWithEmailQuery, function(error, result) {
    if (error) {
      res
        .type('json')
        .status(500)
        .json({ success: false, message: 'Запрос к базе данных не удался.' });
      return;
    }

    if (result.length == 0) {
      res
        .type('json')
        .status(404)
        .json({ success: false, message: 'Пользователь с таким email не найден.' });
      return;
    }

    const hashPassword = crypto
      .createHash('sha256')
      .update(userPassword, 'utf8')
      .digest('hex');

    if (hashPassword !== result[0]['password']) {
      res
        .type('json')
        .status(415)
        .json({ success: false, message: 'Неверный пароль.' });
      return;
    }

    // remove old record of info about user session if needed
    const checkIsUserWasEnteredQuery = `SELECT COUNT(*) AS userCount FROM ${sqlTables.userToken} WHERE email = "${userEmail}"`;
    dbConnection.query(checkIsUserWasEnteredQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false, message: 'Запрос к базе данных не удался.' });
        return;
      }

      // user is being entered (create/update token for him)
      const userToken = crypto
        .createHash('sha512')
        .update(`${userEmail}${secretKey}${Date.now()}`)
        .digest('hex');

      const endTime = Math.floor(Date.now() / 1000) + getTimeOfTokenLife();

      const isUserWasEntered = result[0]['userCount'] != 0;
      const addTokenForUserQuery = isUserWasEntered ?
        `UPDATE ${sqlTables.userToken} SET token = "${userToken}", endTime = ${endTime} WHERE email = "${userEmail}"`
        :
        `INSERT INTO ${sqlTables.userToken} (email, token, endTime) VALUES ("${userEmail}", "${userToken}", ${endTime})`;

      dbConnection.query(addTokenForUserQuery, function(error) {
        if (error) {
          res
            .type('json')
            .status(500)
            .json({ success: false, message: 'Запрос к базе данных не удался.' });
          return;
        }

        res
          .type('json')
          .status(200)
          .json({ success: true, message: 'Пользователь удачно вошел!', token: userToken });
      });
    });
  });
}

module.exports = signInHandler;