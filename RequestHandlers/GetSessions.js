const dbConnection = require('../index').dbConnection;
const sqlTables = require('../SqlConfig').getTables();
const partsOfDay = require('../Helpers/Helper').getPartsOfDay();
const getTodayInMinutes = require('../Helpers/Helper').getTodayInMinutes;
const getTodayAfterXDaysInMinutes = require('../Helpers/Helper').getTodayAfterXDaysInMinutes;
const checkIsUserEntered = require('./ExtraHandlers').checkIsUserEntered;

function getSessions(req, res) {
  const userToken = req.header('X-Session-Token');
  const userFilmId = req.query.filmId;
  const userPartsOfDay = req.query.partsOfDay || [];
  const userCinemaId = req.query.cinemaId || null;

  checkIsUserEntered(userToken, res, function(userEmail) {
    let getSessionsQuery = `
      SELECT Q1.*, ${sqlTables.cinema}.name AS cinemaName FROM
      (
        SELECT DISTINCT
        ${sqlTables.session}.cinemaId,
        ${sqlTables.session}.startTime,
        endDate
        FROM ${sqlTables.session}
        LEFT JOIN ${sqlTables.cinemaFilm}
        ON ${sqlTables.session}.filmId = ${sqlTables.cinemaFilm}.filmId
        WHERE ${sqlTables.session}.filmId = ${userFilmId}
        ${
          userPartsOfDay.length != 0 ?
          ` AND
            (${
              userPartsOfDay.map(function(item) {
                return `(
                  ${sqlTables.session}.startTime > ${partsOfDay[item].from}
                  AND
                  ${sqlTables.session}.startTime < ${partsOfDay[item].to}
                )`
              }).join(' OR ')
            })
          `
          :
          ''
        }
        ${
          userCinemaId !== null ?
          ` AND ${sqlTables.session}.cinemaId = ${userCinemaId}`
          :
          ''
        }
      ) Q1
      LEFT JOIN ${sqlTables.cinema}
      ON ${sqlTables.cinema}.id = Q1.cinemaId
    `;

    dbConnection.query(getSessionsQuery, function(error, result) {
      if (error) {
        res
          .type('json')
          .status(500)
          .json({ success: false });
        return;
      }

      let sessions = {};

      const today = getTodayInMinutes();
      const todayAfterXDays = getTodayAfterXDaysInMinutes(2);
      const now = Date.now();

      result.forEach(function(item) {
        const cinemaId = item['cinemaId'];
        const cinemaName = item['cinemaName'];
        if (sessions[cinemaId] == null) {
          sessions[cinemaId] = {
            name: cinemaName,
            times: []
          };
        }
        const startTime = item['startTime'];
        const endDate = Math.min(todayAfterXDays, item['endDate']);
        for (let i = today; i <= todayAfterXDays; i += 1440) {
          const sessionTime = (i + startTime) * 60 * 1000;
          if (now < sessionTime) {
            sessions[cinemaId].times.push(sessionTime / 1000);
          }
        }
      });

      res
        .type('json')
        .status(200)
        .json({ success: true, sessions: sessions });

    });
  });
}

module.exports = getSessions;