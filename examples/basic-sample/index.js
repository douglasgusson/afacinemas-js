const { getReleases, getSessions, getTheaters } = require('afacinemas');

getTheaters().then(theaters => {
  console.log(JSON.stringify(theaters, null, 2));
});

getReleases().then(releases => {
  console.log(JSON.stringify(releases, null, 2));
});

getSessions(10, '2023-10-06').then(sessions => {
  console.log(JSON.stringify(sessions, null, 2));
});
