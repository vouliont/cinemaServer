const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();
const partsOfDay = require('../Helpers/Helper').getPartsOfDay();
const checkIsUserEntered = require('./ExtraHandlers').checkIsUserEntered;

function getFilms(req, res) {
  const userToken = req.header('X-Session-Token');
  const userCinemaId = req.query.cinemaId || null;
  const userGenres = req.query.genres || [];
  const userPartsOfDay = req.query.partsOfDay || [];

  const userGenresString = userGenres.join(', ');

  checkIsUserEntered(userToken, res, function(userEmail) {
    const nowInMinutes = Math.floor(Date.now() / 1000 / 60);
    let getFilmsQuery = `SELECT DISTINCT Q1.id, Q1.name FROM
    (SELECT DISTINCT ${sqlTables.film}.id, ${sqlTables.film}.name, ${sqlTables.cinemaFilm}.endDate
    FROM ${sqlTables.film} LEFT JOIN ${sqlTables.cinemaFilm}
    ON ${sqlTables.film}.id = ${sqlTables.cinemaFilm}.filmId
    WHERE ${sqlTables.cinemaFilm}.startDate < ${nowInMinutes}) Q1
    LEFT JOIN ${sqlTables.session} ON ${sqlTables.session}.filmId = Q1.id
    WHERE ${sqlTables.session}.startTime + Q1.endDate > ${nowInMinutes}
    ${userCinemaId !== null ? `AND ${sqlTables.session}.cinemaId = ${userCinemaId}` : ''}
    ${userPartsOfDay.length != 0 ? ` AND (
      ${
        userPartsOfDay.map(function(item) {
          return `(${sqlTables.session}.startTime > ${partsOfDay[item].from} AND ${sqlTables.session}.startTime < ${partsOfDay[item].to})`
        }).join(' OR ')
      }
      )`
      :
      ''
    }`;

    if (userGenres.length != 0) {
      getFilmsQuery = `SELECT DISTINCT Q2.* FROM (${getFilmsQuery}) Q2
      LEFT JOIN ${sqlTables.filmGenre} ON ${sqlTables.filmGenre}.filmId = Q2.id
      WHERE ${sqlTables.filmGenre}.genreId IN (${userGenresString})`;
    }

    dbConnection.query(getFilmsQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false });
        return;
      }

      let films = {};
      result.forEach(function(item) {
        const id = item['id'];
        const name = item['name'];
        films[id] = {
          name: name,
          formats: [],
          genres: []
        }
      });

      const getFormatsQuery = userCinemaId !== null ?
      `SELECT DISTINCT ${sqlTables.session}.filmId,
      ${sqlTables.format}.id AS formatId,
      ${sqlTables.format}.name AS formatName
      FROM ${sqlTables.session} LEFT JOIN ${sqlTables.format}
      ON ${sqlTables.session}.formatId = ${sqlTables.format}.id WHERE ${sqlTables.session}.cinemaId = ${userCinemaId}`
      :
      `SELECT DISTINCT ${sqlTables.film}.id AS filmId,
      ${sqlTables.format}.id AS formatId,
      ${sqlTables.format}.name AS formatName
      FROM ${sqlTables.film} LEFT JOIN ${sqlTables.filmFormat}
      ON ${sqlTables.film}.id = ${sqlTables.filmFormat}.filmId
      LEFT JOIN ${sqlTables.format}
      ON ${sqlTables.filmFormat}.formatId = ${sqlTables.format}.id`;

      dbConnection.query(getFormatsQuery, function(error, result) {
        if (error) {
          res
            .type('json')
            .status(500)
            .json({ success: false });
          return;
        }

        result.forEach(function(item) {
          const filmId = item['filmId'];
          if (!films[filmId]) { return }
          const formatId = item['formatId'];
          const formatName = item['formatName'];
          films[filmId].formats.push({
            id: formatId,
            name: formatName
          });
        });

        const getGenresQuery = `SELECT ${sqlTables.film}.id AS filmId,
        ${sqlTables.genre}.id AS genreId, ${sqlTables.genre}.name AS genreName
        FROM ${sqlTables.film} LEFT JOIN ${sqlTables.filmGenre}
        ON ${sqlTables.film}.id = ${sqlTables.filmGenre}.filmId
        LEFT JOIN ${sqlTables.genre}
        ON ${sqlTables.filmGenre}.genreId = ${sqlTables.genre}.id`;

        dbConnection.query(getGenresQuery, function(error, result) {
          if (error) {
            res
              .type('json')
              .status(500)
              .json({ success: false });
            return;
          }

          result.forEach(function(item) {
            const filmId = item['filmId'];
            if (!films[filmId]) { return }
            const genreId = item['genreId'];
            const genreName = item['genreName'];

            films[filmId].genres.push({
              id: genreId,
              name: genreName
            });
          });

          res
            .type('json')
            .status(200)
            .json({ success: true, films: films });
        })
      });

    });
  });
}

module.exports = getFilms;