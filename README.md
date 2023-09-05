# Foobar

Sample project for expressJS REST API application to include different express features in one app for references.

## Installation

### Pre-requisite
NodeJs installed
MongoDB local or https://cloud.mongodb.com/ account available with login credentials

### Env file
Config.Env needs valid data for below fields
```env
NODE_ENV=<development or production>
PORT=<8000>
USERNAME=<string>
PASSWORD=<string>
DATABASE=<mongo connection string>
DATABASE_LOCAL=<local mongo db connection string if local db used>
DATABASE_PASSWORD=<mongo key>

JWT_SECRET=<client secret>
JWT_EXPIRES_IN=<90d>
```
### Install Dependency
```bash
npm install
```

## Usage 
### Development server
```bash
npm run start:dev
```
### Production server
```bash
npm run start:prod
```
### Test watch
```bash
npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
