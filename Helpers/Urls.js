const mainUrl = '/v1';
const urls = {
  signup: `${mainUrl}/signup`,
  signin: `${mainUrl}/signin`,
  getuserdata: `${mainUrl}/getuserdata`,
  cities: `${mainUrl}/cities`,
  cinemas: `${mainUrl}/cinemas`,
  films: `${mainUrl}/films`,
  formats: `${mainUrl}/formats`,
  genres: `${mainUrl}/genres`,
  film: `${mainUrl}/film`,
  sessions: `${mainUrl}/sessions`
};

function getUrls() {
  return urls;
}

exports.getUrls = getUrls;