const mainUrl = '/v1';
const urls = {
  signup: `${mainUrl}/signup`,
  signin: `${mainUrl}/signin`,
  getuserdata: `${mainUrl}/getuserdata`,
  cities: `${mainUrl}/cities`,
  cinemas: `${mainUrl}/cinemas`,
  films: `${mainUrl}/films`
};

function getUrls() {
  return urls;
}

exports.getUrls = getUrls;