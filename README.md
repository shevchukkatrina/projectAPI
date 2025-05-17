[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19385436&assignment_repo_type=AssignmentRepo)
# ExpressJsLab4Template

## Initial Machine Setup

1. **Install NodeJS 22**

## Get Started

1. **Install** `npm install`
2. **Configure mysql connection** [config file](https://github.com/ol-kyrychenko/ExpressJsLab4Template/blob/main/config/db.config.js)
2. **Run the app** `npm run start`

## Documentation
Swagger docs can be found at:
- http://localhost:3000/api-docs/

### Linting

Code linters: [eslint](https://eslint.org/) with pluggable [Prettier](https://github.com/jlongster/prettier) configs.

- run: `npm run lint`
- fix JS errors: `lint:fix`
  Eslint configuration file: [here](.eslintrc.json)

### Testing

We use Jest for unit tests. Test file for .js should be named as .test.js and be placed along with code file.

- run unit tests: `npm run test`
- run tests with coverage: `npm run test:cover`

Refer to this [document](https://jestjs.io/docs/en/api) for more details.
