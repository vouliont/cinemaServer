const sqlConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'my-ang&dem-2sql',
  database: 'cinemas',
  insecureAuth: true
};
const secretKey = 'angels&demons';
const timeOfTokenLife = 30 * 24 * 60 * 60;
const tables = {
  user: 'user',
  userCinema: 'user_cinema',
  userToken: 'user_token',
  cinema: 'cinema',
  cinemaFormat: 'cinema_format',
  city: 'city',
  format: 'format',
  cinemaPromotion: 'cinema_promotion',
  film: 'film',
  filmGenre: 'film_genre',
  filmFormat: 'film_format',
  genre: 'genre',
  filmActor: 'film_actor'
}

function getSqlConfig() {
  return sqlConfig;
}
function getSecretKey() {
  return secretKey;
}
function getTimeOfTokenLife() {
  return timeOfTokenLife;
}
function getTables() {
  return tables;
}

exports.getSqlConfig = getSqlConfig;
exports.getSecretKey = getSecretKey;
exports.getTimeOfTokenLife = getTimeOfTokenLife;
exports.getTables = getTables;