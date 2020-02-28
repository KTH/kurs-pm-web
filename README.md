# Welcome to kurs-pm-data-web 👋

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-12.14.1-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kurs-pm-data-web is a microservice with the public view of course memos. It uses `React`, `MobX`, and is based on [https://github.com/KTH/node-web](https://github.com/KTH/node-web).

### 🏠 [Homepage](https://github.com/KTH/kurs-pm-data-web)

## Overview

TBD

### API:s

Application is fetching data from [https://github.com/KTH/kurs-pm-data-api](https://github.com/KTH/kurs-pm-data-api).

### Related projects

- [https://github.com/KTH/kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)
- [https://github.com/KTH/kurs-pm-data-api](https://github.com/KTH/kurs-pm-data-api)
- [https://github.com/KTH/node-web](https://github.com/KTH/node-web)

## Prerequisites

- node 12.14.1

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore. It needs to contain at least ldap connection URI and password in order for authentication to work properly.

```
LDAP_BASE=OU=UG,DC=ref,DC=ug,DC=kth,DC=se
LDAP_URI=ldaps://[find in gsv-key vault]@[ref].ug.kth.se@ldap.[ref].ug.kth.se
LDAP_PASSWORD=[password]
KURS_PM_DATA_API_URI=http://localhost:3001/api/kurs-pm-data #Default development setting
KURS_PM_DATA_API_KEY=[secret key to connect to kurs-pm-data-api]
SESSION_SECRET=[secret]
SESSION_KEY=kurs-pm-data-web.pid
BROWSER_SYNC_PORT=[default is SERVER_PORT + 10]
```

These settings are also available in an `env.in` file.

## Install

```sh
npm install
```

## Usage

Start the service on [localhost:3000/kurs-pm/:courseCode/:semester](http://localhost:3000/kurs-pm/:courseCode/:semester).

```sh
npm run start-dev
```

## Run tests

```sh
npm run test
```

## Use 🐳

Copy `docker-compose.yml.in` to `docker-compose.yml` and make necessary changes, if any. `KURS_PM_DATA_API_URI` probably needs to be set to reflect your local development setup.

```sh
docker-compose up
```

## Browsersync

[Browsersync](https://www.browsersync.io/) is added as a dev dependency and will run if `NODE_ENV` is `'development'`, e.g. when the service is started with `npm run start-dev`.

### Port

On a started service, _Browsersync_ is available on [localhost:3010/kurs-pm/:courseCode/:semester](http://localhost:3010/kurs-pm/:courseCode/:semester). The _Browsersync_ port can be set with the environment variable `BROWSER_SYNC_PORT`.

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
