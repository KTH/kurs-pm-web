# Welcome to kurs-pm-web 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

### 🏠 [Homepage](https://github.com/KTH/kurs-pm-web)

## Overview

A course memo is an actual plan for taking the course. A course memo help students to plan and prepare for all the learning activities during the course offering. A course memo contains information about the goals of the course, activities, preparations, detailed information about the examination, and contacts. It is particularly important for students just before the start of the course. A teacher, or a course coordinator, creates a course memo, and it must be published no later than by course the start.

Kurs-pm-web is a microservice with the public view of course memos. It uses [React](https://reactjs.org/) and is based on [node-web](https://github.com/KTH/node-web).

### API:s

Kurs-pm-web fetches data from:

- Course memo API `/api/kurs-pm-data`
- API to store information about course syllabuses `/api/kursplan`
- API för kurs- och programinformation `/api/ladokApi`
- API för examinator `/api/ugRestApi`

### Related projects

- [kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)
- [kurs-pm-data-api](https://github.com/KTH/kurs-pm-data-api)
- [kursplan-api](https://github.com/KTH/kursplan-api)
- [node-web](https://github.com/KTH/node-web)

## Prerequisites

- Node.js 18

### Secrets for Development

Secrets during local development are stored in a gitignored `.env` file (`env.in` can be used as template for your `.env` file). More details about environment variable setup and secrets can be found in [confluence](https://confluence.sys.kth.se/confluence/x/OYKBDQ).

## For Development

### Install

```sh
npm install

```

You might need to install as well:

```sh
npm install cross-env
npm install concurrently
```

### Usage

Start the service on [localhost:3000/kurs-pm/:courseCode](http://localhost:3000/kurs-pm/:courseCode).

```sh
npm run start-dev
```

### Debug in Visual Studio Code

It's possible to use debugging options available in Visual Studio Code
Add to .vscode file launch.json:

- _Microsoft_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursinfo-web",
      "program": "${workspaceFolder}\\app.js",
      "envFile": "${workspaceFolder}\\.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

- _Mac, Unix and so on_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursutvecling-web",
      "program": "${workspaceFolder}/app.js",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Run tests

```sh
npm run test
```

### Performance Tests

```sh
npm run test-performance-in-docker
```

Performance tests are run with [Artillery](https://artillery.io/). All api:s are mocked, so only the performance of `kurs-pm-web` is tested.

## Monitor and Dashboards

To monitor status during local development:

- [localhost:3000/kursinfoadmin/kurs-pm-data/\_monitor](http://localhost:3000/kursinfoadmin/kurs-pm-data/_monitor)

To see branch information during local development:

- [localhost:3000/kursinfoadmin/kurs-pm-data/\_about](http://localhost:3000/kursinfoadmin/kurs-pm-data/_about)

## Use 🐳

Copy `docker-compose.yml.in` to `docker-compose.yml` and make necessary changes, if any. `KURS_PM_DATA_API_URI` probably needs to be set to reflect your local development setup.

```sh
docker-compose up
```

## Deploy

The deployment process is described in [Om kursen: Release till produktion](https://confluence.sys.kth.se/confluence/x/xIjCCg).

## Pre-\*\*-git-hooks

We use `husky` to run [pre-commit](/.husky/pre-commit) and [pre-push](/.husky/pre-push) hooks and `lint-staged` to run eslint and prettier.

## Nomenclature

| Name             | Aliases           | Example                                       | Notes                                              |
| ---------------- | ----------------- | --------------------------------------------- | -------------------------------------------------- |
| Course Memo Name |  `courseMemoName` | _Course memo Autumn 2020-1_                   | `courseMemoName` in database is not the same thing |
| Course Title     |  `courseTitle`    | _SF1625 Calculus in One Variable 7.5 credits_ |                                                    |
| Department Name  |  `departmentName` | _SCI/Matematik_                               |                                                    |

## Author

👤 **KTH**

- Website: [kth.github.io/](https://kth.github.io/)
- Github: [@KTH](https://github.com/KTH)
