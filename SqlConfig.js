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

function getSqlConfig() {
  return sqlConfig;
}
function getSecretKey() {
  return secretKey;
}
function getTimeOfTokenLife() {
  return timeOfTokenLife;
}

exports.getSqlConfig = getSqlConfig;
exports.getSecretKey = getSecretKey;
exports.getTimeOfTokenLife = getTimeOfTokenLife;