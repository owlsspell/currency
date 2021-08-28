// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      user: "developer",
      database: "baseA",
      password: "123456",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "baseA",
      user: "developer",
      password: "123456",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "baseA",
      user: "developer",
      password: "123456",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
