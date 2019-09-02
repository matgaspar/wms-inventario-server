const {
  DB,
} = require('.');

module.exports = {
  username: DB.user,
  password: DB.pass,
  database: DB.name,
  host: DB.host,
  dialect: DB.dialect,
  timezone: DB.timezone,
  dialectOptions: {
    useUTC: true, // for reading from database
    dateStrings: true,
    /* typeCast(field, next) {
      // for reading from database
      if (field.type === 'DATETIME') {
        return field.string();
      }
      return next();
    }, */
  },
};
