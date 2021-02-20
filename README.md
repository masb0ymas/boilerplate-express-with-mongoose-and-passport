<h1 align="center">Welcome to express-mongoose-typescript 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-3.5.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/npm-%3E%3D6.10.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D10.x-blue.svg" />
  <a href="https://github.com/masb0ymas/express-mongoose-typescript#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/masb0ymas/express-mongoose-typescript/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/masb0ymas/express-mongoose-typescript/blob/master/LICENSE.md" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/masb0ymas/express-mongoose-typescript" />
  </a>
</p>

> Just boilerplate Express with Mongoose

### 🏠 [Homepage](https://github.com/masb0ymas/express-mongoose-typescript)

## Prerequisites

- npm >= `v6.x`
- node >= `v10.x`
- eslint >= `v7.x`
- Familiar with TypeScript 💪

## Feature

- [TypeScript](https://github.com/microsoft/TypeScript) `v4.x`
- [Mongoose](https://github.com/Automattic/mongoose) `v5.x`
- [Nodemailer](https://github.com/nodemailer/nodemailer)
- [Handlebars](https://github.com/wycats/handlebars.js) for templating HTML
- [Yup](https://github.com/jquense/yup) for validation schema
- JavaScript Style [Airbnb Base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base)
- Formating code using [Prettier](https://github.com/prettier/prettier) Integration [Eslint](https://github.com/prettier/eslint-config-prettier)
- Using [Babel Resolver](https://github.com/tleunen/babel-plugin-module-resolver) for simplify the require/import paths
- Documentation with [Swagger](https://github.com/swagger-api/swagger-ui)
- Generate Log File with [Winston](https://github.com/winstonjs/winston)
- [Convensional Commit](https://www.conventionalcommits.org/en/v1.0.0/) with [Husky](https://github.com/typicode/husky) `v5` & [Commitlint](https://github.com/conventional-changelog/commitlint)

## How to use

clone this repo with `https` / `ssh` / `github cli`

```sh
git clone https://github.com/masb0ymas/express-mongoose-typescript
```

After cloning this repo, make sure you have `duplicated` the `.env.example` file to `.env`, don't let the .env.example file be deleted or renamed.

## Install

```sh
npm install

or

yarn
```

## Enabled Husky

```sh
npx husky install

or

yarn husky install
```

## Usage Development

```sh
npm run dev

or

yarn dev
```

## Type Checking

```sh
npm run type-check

or

yarn type-check
```

## Type Checking Watching

```sh
npm run type-check:watch

or

yarn type-check:watch
```

## Build

Recommended using build with `Babel`, build with `TS` is still unstable

```sh
npm run build:babel

or

yarn build:babel
```

## Using Mongoose

Using mongoose with development mode, you can set the database configuration in `.env`, like this :

```sh
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_AUTH=admin
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_DATABASE=express_mongo
```

## Usage Production

```sh
npm run serve:production

or

yarn serve:production
```

## Run tests

```sh
npm run test

or

yarn test
```

## Dump Database Mongo

```sh
db=your_database yarn run mongo:dump
```

## Restore Database Mongo

```sh
yarn run mongo:restore
```

## Release your version app

if you want to release the app version, you can use the following command :

```sh
npm run release

or

yarn release
```

## SMTP Basic

I use [topol.io](https://topol.io/) to create email templates, and it's free and can export to html format

```sh
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=465
MAIL_AUTH_TYPE=
MAIL_USERNAME=your_mail@domain.com
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=null
```

## SMTP Google Oauth Email ( Gmail )

```sh
MAIL_DRIVER=gmail
MAIL_HOST=null
MAIL_PORT=null
MAIL_AUTH_TYPE=OAuth2
MAIL_USERNAME=your_account@gmail.com
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URL=https://developers.google.com/oauthplayground
OAUTH_REFRESH_TOKEN=your_refresh_token
```

## Author

👤 **masb0ymas**

- Website: https://resume.masb0ymas.vercel.app
- Twitter: [@masb0ymas](https://twitter.com/masb0ymas)
- Github: [@masb0ymas](https://github.com/masb0ymas)
- LinkedIn: [@masb0ymas](https://www.linkedin.com/in/masb0ymas/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/masb0ymas/express-mongoose-typescript/issues). You can also take a look at the [contributing guide](https://github.com/masb0ymas/express-mongoose-typescript/blob/master/CONTRIBUTING.md).

## Support Me

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I2I03MVAI)

[<img height="40" src="https://trakteer.id/images/mix/navbar-logo-lite.png">](https://trakteer.id/masb0ymas)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [masb0ymas](https://github.com/masb0ymas).<br />
This project is [MIT](https://github.com/masb0ymas/express-mongoose-typescript/blob/master/LICENSE.md) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
