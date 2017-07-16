module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: `./database/dev.sqlite3`
    }
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: `./database/prod.sqlite3`
    }
  }
};