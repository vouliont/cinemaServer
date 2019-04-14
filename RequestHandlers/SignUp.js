const checkIsSignUpDataValid = require('../Helpers/Validator').checkIsSignUpDataValid;
const crypto = require('crypto');
const mysql = require('mysql');
const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();

function signUpHandler(req, res) {
  const userEmail = req.body.email;
  const userName = req.body.name;
  const userPassword = req.body.password;
  const userCityId = req.body.cityId;

  const isDataValid = checkIsSignUpDataValid(userEmail, userName, userPassword);
  if (!isDataValid.isValid) {
    res
      .type('json')
      .status(415)
      .json({ success: false, message: isDataValid.message });
    return;
  }

  const findUserWithEmailQuery = `SELECT COUNT(*) AS userCount FROM ${sqlTables.user} WHERE email = "${userEmail}"`;
  dbConnection.query(findUserWithEmailQuery, function(error, result) {
    if (error) {
      res
        .status(500)
        .type('json')
        .json({ success: false, message: 'Запрос к базе данных не удался.' });
      return;
    }

    const isUserDefined = result[0]['userCount'] != 0;
    if (isUserDefined) {
      res
        .type('json')
        .status(200)
        .json({ success: false, message: 'Пользователь с таким email уже существует.' });
      return;
    }

    // add new user
    const hashPassword = crypto
      .createHash('sha256')
      .update(userPassword, 'utf8')
      .digest('hex');

    const createUserQuery = `INSERT INTO ${sqlTables.user} (name, email, password, cityId) VALUES ("${userName}", "${userEmail}", "${hashPassword}", ${userCityId})`;
    dbConnection.query(createUserQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false, message: 'Запрос к базе данных не удался. Пользователь не был создан.' });
        return;
      }

      res
        .type('json')
        .status(200)
        .json({ success: true, message: 'Пользователь успешно добавлен.' });
    });
  });

}

module.exports = signUpHandler;