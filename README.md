# afacinemas.js 🎥
> A web scraper library for [AFA Cinemas](http://www.afacinemas.com.br/)

[![npm version](https://badge.fury.io/js/afacinemas.svg)](https://badge.fury.io/js/afacinemas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install afacinemas
```

## Usage

### ES6

```javascript
import { getTheaters, getReleases } from "afacinemas";

Promise.all([getTheaters(), getReleases()]).then(([theaters, releases]) => {
  console.log(theaters);
  console.log(releases);
});
```

### CommonJS

```javascript
const { getTheaters, getReleases } = require("afacinemas");

Promise.all([getTheaters(), getReleases()]).then(([theaters, releases]) => {
  console.log(theaters);
  console.log(releases);
});
```

## API

### getTheaters()

Fetches the list of theaters.

```javascript
import { getTheaters } from "afacinemas";

getTheaters().then(theaters => {
  console.log(theaters);
});
```

### getReleases()

Fetches the list of next releases.

```javascript
import { getReleases } from "afacinemas";

getReleases().then(releases => {
  console.log(releases);
});
```

### getSessions(theaterId, sessionsDate)

Fetches the list of sessions for a given theater and date.

```javascript
import { getSessions } from "afacinemas";

getSessions(12, "2023-09-20").then(sessions => {
  console.log(sessions);
});
```
